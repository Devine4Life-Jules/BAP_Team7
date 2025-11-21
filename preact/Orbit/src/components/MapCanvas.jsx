import { useState, useEffect, useMemo, useRef } from 'preact/hooks'
import Planet from "./Planet"
import { route } from 'preact-router'
import './mapCanvas.css'

export default function MapCanvas({ filteredProjects }) {
    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)
    const [selectedProjectId, setSelectedProjectId] = useState(null)
    const viewportRef = useRef(null)

    const PAN_SPEED = 40 // pixels per arrow key press
    
    // Using 90vh as viewport size (matches app container)
    const VIEWPORT_WIDTH = window.innerHeight * 0.9 // 90vh in pixels
    const VIEWPORT_HEIGHT = window.innerHeight * 0.9 // 90vh in pixels
    const CANVAS_WIDTH = VIEWPORT_WIDTH * 2 // total canvas size (2x viewport)
    const CANVAS_HEIGHT = VIEWPORT_HEIGHT * 2

    // Generate non-overlapping positions for all projects
    const projectPositions = useMemo(() => {
        const positions = {}
        const minDistance = 130 // minimum distance between projects (2x planet size + padding)
        const maxAttempts = 100

        const projects = [...filteredProjects].sort((a, b) => a.id - b.id)

        projects.forEach((project, index) => {
            let positioned = false
            let attempts = 0

            // Try to find a non-overlapping position
            while (!positioned && attempts < maxAttempts) {
                // Use a spiral pattern for deterministic placement
                const angle = (index * 137.5) % 360 // Golden angle
                const spiralRadius = 150 + (index * 15)
                
                const x = CANVAS_WIDTH / 2 + Math.cos((angle * Math.PI) / 180) * spiralRadius
                const y = CANVAS_HEIGHT / 2 + Math.sin((angle * Math.PI) / 180) * spiralRadius

                // Check if this position overlaps with existing ones
                let hasOverlap = false
                for (const pos of Object.values(positions)) {
                    const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
                    if (dist < minDistance) {
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
        
        const planetRadius = 50 // approximate radius of a planet (100px diameter)
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
                    const isOverlapping = distance < planetRadius

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

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp') {
                event.preventDefault()
                setOffsetY(prev => prev - PAN_SPEED)
            } else if (event.key === 'ArrowDown') {
                event.preventDefault()
                setOffsetY(prev => prev + PAN_SPEED)
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault()
                setOffsetX(prev => prev - PAN_SPEED)
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                setOffsetX(prev => prev + PAN_SPEED)
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
                                bgColor="green"
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
