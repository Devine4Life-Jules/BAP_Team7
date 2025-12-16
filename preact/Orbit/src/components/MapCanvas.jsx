import { useState, useEffect, useMemo, useRef } from 'preact/hooks'
import Planet from "./Planet"
import { route } from 'preact-router'
import './mapCanvas.css'

// Constants for map configuration
const CONFIG = {
    VIEWPORT_SCALE: 1, // 90vh as percentage of window height
    CANVAS_MULTIPLIER: 2, // canvas size relative to viewport
    PAN_SPEED: 12, // pixels per arrow key press
    PLANET_RADIUS: 50, // approximate radius of a planet (100px diameter)
    MIN_DISTANCE: 140, // minimum distance between projects (2x planet radius + padding)
    SPIRAL_RADIUS_BASE: 200, // starting radius for spiral positioning (increased for better spacing)
    SPIRAL_RADIUS_INCREMENT: 25, // increment per project in spiral (increased for better spacing)
    GOLDEN_ANGLE: 137.5, // golden angle for deterministic spiral distribution
    MAX_POSITIONING_ATTEMPTS: 200, // max attempts to find non-overlapping position (increased)
    INERTIA_FRICTION: 0.85, // velocity multiplier per frame (reduced for Pi performance)
    INERTIA_MIN_VELOCITY: 0.1, // minimum velocity threshold before stopping (higher = stops faster)
}

export default function MapCanvas({ filteredProjects, onSelectionChange, bottomCloudsImg, selectedProject, instructionModalOpen }) {
    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)
    const [selectedProjectId, setSelectedProjectId] = useState(null)
    const [velocityX, setVelocityX] = useState(0)
    const [velocityY, setVelocityY] = useState(0)
    const [animatingPlanets, setAnimatingPlanets] = useState(new Set())
    const previousProjectIdsRef = useRef(new Set())
    const viewportRef = useRef(null)
    const animationFrameRef = useRef(null)
    const isRaspberryPi = useRef(/arm|aarch64/i.test(navigator.userAgent) || navigator.hardwareConcurrency <= 4)

    // Using 90vh as viewport size (matches app container)
    const VIEWPORT_WIDTH = window.innerHeight * CONFIG.VIEWPORT_SCALE
    const VIEWPORT_HEIGHT = window.innerHeight * CONFIG.VIEWPORT_SCALE
    const CANVAS_WIDTH = VIEWPORT_WIDTH * CONFIG.CANVAS_MULTIPLIER
    const CANVAS_HEIGHT = VIEWPORT_HEIGHT * CONFIG.CANVAS_MULTIPLIER

    // Generate non-overlapping positions for all projects
    const projectPositions = useMemo(() => {
        const positions = {}
        const projects = [...filteredProjects].sort((a, b) => a.id - b.id)

        // Helper function to check if a position overlaps with existing planets
        const isPositionValid = (x, y, existingPositions) => {
            // Check bounds - ensure planets stay within canvas with padding
            const padding = CONFIG.PLANET_RADIUS * 2
            if (x < padding || x > CANVAS_WIDTH - padding || 
                y < padding || y > CANVAS_HEIGHT - padding) {
                return false
            }

            // Check distance from all existing planets
            for (const pos of Object.values(existingPositions)) {
                const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
                // Ensure minimum distance is at least 2 planet radii + padding
                if (distance < CONFIG.MIN_DISTANCE) {
                    return false
                }
            }
            return true
        }

        projects.forEach((project, index) => {
            let positioned = false
            let attempts = 0

            // Try to find a non-overlapping position using spiral pattern
            while (!positioned && attempts < CONFIG.MAX_POSITIONING_ATTEMPTS) {
                let x, y

                if (attempts < 50) {
                    // First 50 attempts: use spiral pattern
                    const angle = (index * CONFIG.GOLDEN_ANGLE + attempts * 15) % 360
                    const spiralRadius = CONFIG.SPIRAL_RADIUS_BASE + (index * CONFIG.SPIRAL_RADIUS_INCREMENT) + (attempts * 10)
                    
                    x = CANVAS_WIDTH / 2 + Math.cos((angle * Math.PI) / 180) * spiralRadius
                    y = CANVAS_HEIGHT / 2 + Math.sin((angle * Math.PI) / 180) * spiralRadius
                } else {
                    // Remaining attempts: try random positions in expanding circles
                    const angle = Math.random() * 360
                    const radius = CONFIG.SPIRAL_RADIUS_BASE + (attempts - 50) * 20
                    
                    x = CANVAS_WIDTH / 2 + Math.cos((angle * Math.PI) / 180) * radius
                    y = CANVAS_HEIGHT / 2 + Math.sin((angle * Math.PI) / 180) * radius
                }

                if (isPositionValid(x, y, positions)) {
                    positions[project.id] = { x, y }
                    positioned = true
                }
                
                attempts++
            }

            // Fallback: force placement on edge if no position found (should be rare)
            if (!positioned) {
                console.warn(`Could not find valid position for project ${project.id} after ${CONFIG.MAX_POSITIONING_ATTEMPTS} attempts`)
                const angle = (index * 45) % 360
                const radius = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.4
                const x = CANVAS_WIDTH / 2 + Math.cos((angle * Math.PI) / 180) * radius
                const y = CANVAS_HEIGHT / 2 + Math.sin((angle * Math.PI) / 180) * radius
                positions[project.id] = { x, y }
            }
        })

        return positions
    }, [filteredProjects])

    // Find the most central planet by checking distance from screen center
    const centralProjectId = useMemo(() => {
        if (!viewportRef.current) return null

        // Get the actual center of the viewport in screen coordinates
        const rect = viewportRef.current.getBoundingClientRect()
        const screenCenterX = rect.left + rect.width / 2
        const screenCenterY = rect.top + rect.height / 2
        
        let closestId = null
        let closestDistance = Infinity
        let overlapFound = false

        filteredProjects.forEach(project => {
            const pos = projectPositions[project.id]
            if (pos) {
                // Find the DOM element for this project
                const element = document.querySelector(`[data-project-id="${project.id}"]`)
                if (element) {
                    const elemRect = element.getBoundingClientRect()
                    const elemCenterX = elemRect.left + elemRect.width / 2
                    const elemCenterY = elemRect.top + elemRect.height / 2

                    const distance = Math.sqrt(
                        Math.pow(elemCenterX - screenCenterX, 2) + 
                        Math.pow(elemCenterY - screenCenterY, 2)
                    )

                    // Check if overlapping with center point
                    const isOverlapping = distance < CONFIG.PLANET_RADIUS

                    // Prefer overlapping planets, then closest
                    if (isOverlapping && !overlapFound) {
                        // First overlapping planet found
                        closestDistance = distance
                        closestId = project.id
                        overlapFound = true
                    } else if (isOverlapping && distance < closestDistance) {
                        // Closer overlapping planet
                        closestDistance = distance
                        closestId = project.id
                    } else if (!overlapFound && distance < closestDistance) {
                        // Not overlapping, but closest so far
                        closestDistance = distance
                        closestId = project.id
                    }
                }
            }
        })

        return closestId
    }, [offsetX, offsetY, filteredProjects, projectPositions])

    // Update selected when central changes
    useEffect(() => {
        setSelectedProjectId(centralProjectId)
    }, [centralProjectId])

    // Notify parent of selection change (only when centralProjectId changes)
    useEffect(() => {
        if (onSelectionChange && centralProjectId) {
            const position = projectPositions[centralProjectId]
            if (position) {
                // Calculate screen position of the planet (center of viewport)
                const screenX = VIEWPORT_WIDTH / 2
                const screenY = VIEWPORT_HEIGHT / 2
                onSelectionChange(centralProjectId, { x: screenX, y: screenY })
            }
        }
    }, [centralProjectId, onSelectionChange])

    // Apply inertia/momentum to panning
    useEffect(() => {
        const animate = () => {
            setOffsetX(prev => {
                setVelocityX(v => {
                    const newVelocity = v * CONFIG.INERTIA_FRICTION
                    if (Math.abs(newVelocity) < CONFIG.INERTIA_MIN_VELOCITY) {
                        return 0
                    }
                    return newVelocity
                })
                return prev + velocityX
            })
            
            setOffsetY(prev => {
                setVelocityY(v => {
                    const newVelocity = v * CONFIG.INERTIA_FRICTION
                    if (Math.abs(newVelocity) < CONFIG.INERTIA_MIN_VELOCITY) {
                        return 0
                    }
                    return newVelocity
                })
                return prev + velocityY
            })

            if (Math.abs(velocityX) > CONFIG.INERTIA_MIN_VELOCITY || Math.abs(velocityY) > CONFIG.INERTIA_MIN_VELOCITY) {
                animationFrameRef.current = requestAnimationFrame(animate)
            }
        }

        if (Math.abs(velocityX) > CONFIG.INERTIA_MIN_VELOCITY || Math.abs(velocityY) > CONFIG.INERTIA_MIN_VELOCITY) {
            animationFrameRef.current = requestAnimationFrame(animate)
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [velocityX, velocityY])

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (instructionModalOpen) return;
            if (event.key === 'ArrowUp') {
                event.preventDefault()
                setVelocityY(prev => prev - CONFIG.PAN_SPEED)
            } else if (event.key === 'ArrowDown') {
                event.preventDefault()
                setVelocityY(prev => prev + CONFIG.PAN_SPEED)
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault()
                setVelocityX(prev => prev - CONFIG.PAN_SPEED)
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                setVelocityX(prev => prev + CONFIG.PAN_SPEED)
            } else if (event.code === 'Space') {
                event.preventDefault()
                if (selectedProjectId) {
                    route(`/project/${selectedProjectId}`)
                }
            } else if (event.code === 'Backspace') {
                event.preventDefault()
                route(`/`)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedProjectId, instructionModalOpen])

    // Create a stable string representation of current project IDs for dependency tracking
    const projectIdsString = useMemo(() => 
        filteredProjects.map(p => p.id).sort((a, b) => a - b).join(','),
        [filteredProjects.length, filteredProjects[0]?.id, filteredProjects[filteredProjects.length - 1]?.id]
    )

    // Animate only NEW planets when filter changes
    useEffect(() => {
        const currentProjectIds = new Set(filteredProjects.map(p => p.id))
        
        // Find planets that are new (in current but not in previous)
        const newPlanetIds = Array.from(currentProjectIds).filter(id => !previousProjectIdsRef.current.has(id))
        
        if (newPlanetIds.length > 0) {
            // Initialize all new planets as animating immediately to prevent opacity flash
            setAnimatingPlanets(new Set(newPlanetIds))
            
            const timeouts = []
            
            // Group planets with shared random start times for removal from animation state
            const groupSize = Math.max(1, Math.ceil(newPlanetIds.length / 3)) // 3 groups
            newPlanetIds.forEach((id, index) => {
                // Assign random removal time between 500-700ms (after animation duration of 500ms)
                const randomDelay = 500 + Math.floor((index % groupSize) * (200 / groupSize) + Math.random() * 100)
                
                // Remove planet from animating set after animation completes
                timeouts.push(
                    setTimeout(() => {
                        setAnimatingPlanets(prev => {
                            const updated = new Set(prev)
                            updated.delete(id)
                            return updated
                        })
                    }, randomDelay)
                )
            })
            
            return () => timeouts.forEach(t => clearTimeout(t))
        }
        
        // Update previous project ids for next filter change (using ref, not state)
        previousProjectIdsRef.current = currentProjectIds
    }, [projectIdsString])

    return (
        <div className="map-viewport" ref={viewportRef}>
            {/* Bottom clouds image - fixed in viewport */}
            {bottomCloudsImg && (
                <img 
                    src={bottomCloudsImg} 
                    alt="" 
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        height: 'auto',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />
            )}
            
            {/* Invisible center point indicator */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '6px',
                height: '6px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 50,
                pointerEvents: 'none'
            }} />
            <div
                className="map-canvas"
                style={{
                    transform: `translate(calc(-50% + ${-offsetX}px), calc(-50% + ${-offsetY}px))`,
                    width: `${CANVAS_WIDTH}px`,
                    height: `${CANVAS_HEIGHT}px`
                }}
            >
                {filteredProjects.map(project => {
                    const pos = projectPositions[project.id]
                    if (!pos) return null

                    const isSelected = project.id === selectedProjectId

                    // Calculate distance from the center point (white dot at viewport center)
                    // Planet's position on screen after applying canvas offset
                    const planetScreenX = pos.x - CANVAS_WIDTH / 2 - offsetX
                    const planetScreenY = pos.y - CANVAS_HEIGHT / 2 - offsetY
                    
                    // Distance from planet to viewport center (where the white dot is)
                    const distanceFromCenter = Math.sqrt(
                        planetScreenX * planetScreenX + 
                        planetScreenY * planetScreenY
                    )
                    
                    // Calculate opacity with dramatic falloff
                    const maxFadeDistance = VIEWPORT_WIDTH * 0.5
                    const normalizedDistance = Math.min(distanceFromCenter / maxFadeDistance, 1)
                    // Quadratic falloff for dramatic contrast
                    const rawOpacity = Math.max(0.05, 1 - Math.pow(normalizedDistance, 1.5))
                    // Round to 0.05 increments to reduce CSS changes (0.05, 0.10, 0.15, etc.)
                    const opacityValue = isRaspberryPi.current ? Math.round(rawOpacity * 20) / 20 : rawOpacity

                    return (
                        <div
                            key={project.id}
                            data-project-id={project.id}
                            className={`project-wrapper ${isSelected ? 'selected' : ''}`}
                            style={{
                                position: 'absolute',
                                left: `${pos.x}px`,
                                top: `${pos.y}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <Planet
                                id={project.id}
                                title={project.ccode}
                                bgColor="linear-gradient(134deg, #44C8F5 16.53%, rgba(73, 71, 129, 0.00) 79.49%)"
                                opacity={opacityValue}
                                isAnimating={animatingPlanets.has(project.id)}
                            />
                        </div>
                    )
                })}

                {/* Project Details Modal - positioned relative to planet on canvas */}
                {selectedProject && projectPositions[selectedProject.id] && (
                    <div 
                        style={{
                            position: 'absolute',
                            left: `${projectPositions[selectedProject.id].x + 120}px`, // 120px to the right of planet
                            top: `${projectPositions[selectedProject.id].y - 80}px`, // 80px above planet
                            background: 'white',
                            color: 'black',
                            padding: '15px 20px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            zIndex: 2500,
                            minWidth: '200px',
                            maxWidth: '300px',
                            pointerEvents: 'none',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold' }}>
                            {selectedProject.ccode}
                        </h3>
                        <div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {selectedProject.transitiedomeinen.slice(0, 3).map((td, index) => {
                                    const labelWithoutAbbr = td.label.replace(/\s*\([^)]*\)\s*/g, '').trim()
                                    return (
                                        <span 
                                            key={index}
                                            style={{
                                                background: '#E6007E',
                                                color: 'white',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {labelWithoutAbbr}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
