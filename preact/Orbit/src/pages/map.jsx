import { useState, useEffect, useMemo } from 'preact/hooks'
import Planet from "../components/Planet"
import FilterPlanet from '../components/FilterPlanet'
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

    const selectedFilterPlanet = filterPlanets[selectedIndex]
    const selectedDomain = selectedFilterPlanet.title
    
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
    
    const articlePositions = useMemo(() => 
        filteredProjects.map((_, index) => {
            const angle = (index / Math.max(filteredProjects.length, 1)) * 360 + Math.random() * 30
            const radius = 80 + Math.random() * 60
            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius
            return { x, y }
        }),
        [filteredProjects.length]
    )

    useEffect(() => {
        function handleBackspace(e) {
            if (e.code === 'Backspace') {
                route(`/`)
            }
        }
        window.addEventListener('keydown', handleBackspace)
        return () => window.removeEventListener('keydown', handleBackspace)
    }, [])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + PLANET_COUNT) % PLANET_COUNT)
            } else if (event.key === 'ArrowDown') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % PLANET_COUNT)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [PLANET_COUNT])

    return(
        <div>
            <div>
                {filterPlanets.map((planet, index) => (
                    <div key={index} style={{ opacity: index === selectedIndex ? 1 : 0.5 }}>
                        <FilterPlanet id={planet.id} title={planet.title} bgColor={planet.bgColor}/>
                    </div>
                ))}
            </div>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {filteredProjects.map((project, index) => {
                    const pos = articlePositions[index]
                    return (
                        <div key={project.id} style={{ position: 'absolute', left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)`, transform: 'translate(-50%, -50%)' }}>
                            <Planet id={project.id} title={project.ccode} projectManager={project.researchGroup} areasOfExpertise={project.cluster} themes={project.projectType} kernwoorden={project.analyticalCode} text={project.mainFunding} bgColor="green"/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}