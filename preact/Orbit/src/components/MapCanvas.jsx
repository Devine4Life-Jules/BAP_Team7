import { useState, useEffect, useMemo, useRef } from 'preact/hooks'
import Planet from "./Planet"
import { route } from 'preact-router'
import './mapCanvas.css'

// Constants for map configuration
const CONFIG = {
    VIEWPORT_SCALE: 0.9, // 90vh as percentage of window height
    CANVAS_MULTIPLIER: 2, // canvas size relative to viewport
    PAN_SPEED: 12, // pixels per arrow key press
    PLANET_RADIUS: 50, // approximate radius of a planet (100px diameter)
    MIN_DISTANCE: 130, // minimum distance between projects (2x planet size + padding)
    SPIRAL_RADIUS_BASE: 150, // starting radius for spiral positioning
    SPIRAL_RADIUS_INCREMENT: 15, // increment per project in spiral
    GOLDEN_ANGLE: 137.5, // golden angle for deterministic spiral distribution
    MAX_POSITIONING_ATTEMPTS: 100, // max attempts to find non-overlapping position
    INERTIA_FRICTION: 0.88, // velocity multiplier per frame (~half second decay at 60fps)
    INERTIA_MIN_VELOCITY: 0.01, // minimum velocity threshold before stopping
}

export default function MapCanvas({ filteredProjects }) {
    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)
    const [selectedProjectId, setSelectedProjectId] = useState(null)
    const [velocityX, setVelocityX] = useState(0)
    const [velocityY, setVelocityY] = useState(0)
    const viewportRef = useRef(null)
    const animationFrameRef = useRef(null)

    // Using 90vh as viewport size (matches app container)
    const VIEWPORT_WIDTH = window.innerHeight * CONFIG.VIEWPORT_SCALE
    const VIEWPORT_HEIGHT = window.innerHeight * CONFIG.VIEWPORT_SCALE
    const CANVAS_WIDTH = VIEWPORT_WIDTH * CONFIG.CANVAS_MULTIPLIER
    const CANVAS_HEIGHT = VIEWPORT_HEIGHT * CONFIG.CANVAS_MULTIPLIER

    // Generate non-overlapping positions for all projects
    const projectPositions = useMemo(() => {
        const positions = {}

        const projects = [...filteredProjects].sort((a, b) => a.id - b.id)

        projects.forEach((project, index) => {
            let positioned = false
            let attempts = 0

            // Try to find a non-overlapping position
            while (!positioned && attempts < CONFIG.MAX_POSITIONING_ATTEMPTS) {
                // Use a spiral pattern for deterministic placement
                const angle = (index * CONFIG.GOLDEN_ANGLE) % 360
                const spiralRadius = CONFIG.SPIRAL_RADIUS_BASE + (index * CONFIG.SPIRAL_RADIUS_INCREMENT)
                
                const x = CANVAS_WIDTH / 2 + Math.cos((angle * Math.PI) / 180) * spiralRadius
                const y = CANVAS_HEIGHT / 2 + Math.sin((angle * Math.PI) / 180) * spiralRadius

                // Check if this position overlaps with existing ones
                let hasOverlap = false
                for (const pos of Object.values(positions)) {
                    const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
                    if (dist < CONFIG.MIN_DISTANCE) {
                        hasOverlap = true
                        break
                    }
                }

                if (!hasOverlap) {
                    positions[project.id] = { x, y }
                    positioned = true
                } else {
                    attempts++
                }
            }

            // Fallback: place it anyway if we couldn't find a spot
            if (!positioned) {
                const angle = Math.random() * 360
                const radius = 100 + Math.random() * 400
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
    }, [selectedProjectId])

    return (
        <div className="map-viewport" ref={viewportRef}>
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


                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
