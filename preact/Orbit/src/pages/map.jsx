import { useState, useEffect, useMemo } from 'preact/hooks'
import FilterPlanet from '../components/FilterPlanet'
import MapCanvas from '../components/MapCanvas'
import './map.css'
import projects from '../data/projects.json'
import { route } from 'preact-router'

export default function Map() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    
    const TRANSITION_DOMAINS = ['gezond', 'digitaal', 'ecologisch', 'leren', 'sociaal']
    
    const filterPlanets = [
        { id:"domain1", title: "gezond", bgColor: "red" },
        { id:"domain2", title: "digitaal", bgColor: "blue" },
        { id:"domain3", title: "ecologisch", bgColor: "green" },
        { id:"domain4", title: "leren", bgColor: "purple" },
        { id:"domain5", title: "sociaal", bgColor: "orange" },
        { id:"domain6", title: "overige", bgColor: "gray" },
    ]
    
    const PLANET_COUNT = filterPlanets.length

    const selectedDomain = filterPlanets[selectedIndex].title
    
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
            {filterPlanets.map((planet, index) => {
                const angle = (index / filterPlanets.length) * 360
                const radius = 320 // Position them far out on the circle edge
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius
                
                return (
                    <div key={planet.id} style={{ 
                        position: 'absolute', 
                        left: `calc(50% + ${x}px)`, 
                        top: `calc(50% + ${y}px)`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: index === selectedIndex ? 1 : 0.5,
                        transition: 'opacity 0.2s ease',
                        zIndex: 100
                    }}>
                        <FilterPlanet id={planet.id} title={planet.title} bgColor={planet.bgColor}/>
                    </div>
                )
            })}
            
            {/* MapCanvas for pannable project map */}
            <MapCanvas filteredProjects={filteredProjects} />
        </div>
    )
}