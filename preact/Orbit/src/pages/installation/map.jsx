import { useState, useEffect, useMemo } from 'preact/hooks'
import FilterShape from '../../components/FilterShape'
import MapCanvas from '../../components/MapCanvas'
import './map.css'
import projects from '../../data/projects.json'
import { route } from 'preact-router'

// Constants for filter configuration
const FILTER_CONFIG = {
    PLANET_RADIUS: 320, // distance from center to filter planets
    SELECTED_OPACITY: 1, // opacity of selected filter
    UNSELECTED_OPACITY: 0.5, // opacity of unselected filters
    OPACITY_TRANSITION: 0.2, // transition duration in seconds
}

export default function Map() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    
    const TRANSITION_DOMAINS = ['gezond', 'digitaal', 'ecologisch', 'leren', 'sociaal']
    
    const filterShapes = [
        { id:"domain1", title: "gezond", bgColor: "red" },
        { id:"domain2", title: "digitaal", bgColor: "blue" },
        { id:"domain3", title: "ecologisch", bgColor: "green" },
        { id:"domain4", title: "leren", bgColor: "purple" },
        { id:"domain5", title: "sociaal", bgColor: "orange" },
        { id:"domain6", title: "overige", bgColor: "gray" },
    ]
    
    const PLANET_COUNT = filterShapes.length

    const selectedDomain = filterShapes[selectedIndex].title
    
    // Filter projects based on selected transitiedomein
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            if (selectedDomain === 'overige') {
                // Projects die geen van de 5 domeinen hebben
                return !project.transitiedomeinen.some(td => 
                    TRANSITION_DOMAINS.includes(td.label.toLowerCase())
                )
            } else {
                // Projects die het geselecteerde domein hebben
                return project.transitiedomeinen.some(td => 
                    td.label.toLowerCase() === selectedDomain.toLowerCase()
                )
            }
        })
    }, [selectedDomain])
    
    // Handle filter planet selection with arrow keys
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'e') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + PLANET_COUNT) % PLANET_COUNT)
            } else if (event.key === 'q') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % PLANET_COUNT)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [PLANET_COUNT])

    return(
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Filter Planets positioned around the circle edge */}
            {filterShapes.map((planet, index) => {
                const angle = (index / filterShapes.length) * 360
                const radius = FILTER_CONFIG.PLANET_RADIUS
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius
                
                return (
                    <div key={planet.id} style={{ 
                        position: 'absolute', 
                        left: `calc(50% + ${x}px)`, 
                        top: `calc(50% + ${y}px)`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: index === selectedIndex ? FILTER_CONFIG.SELECTED_OPACITY : FILTER_CONFIG.UNSELECTED_OPACITY,
                        transition: `opacity ${FILTER_CONFIG.OPACITY_TRANSITION}s ease`,
                        zIndex: 100
                    }}>
                        <FilterShape id={planet.id} title={planet.title} bgColor={planet.bgColor}/>
                    </div>
                )
            })}
            
            {/* MapCanvas for pannable project map */}
            <MapCanvas filteredProjects={filteredProjects} />
        </div>
    )
}