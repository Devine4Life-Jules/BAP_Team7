import { useState, useEffect } from 'preact/hooks'
import Planet from "../components/Planet"
import FilterPlanet from '../components/FilterPlanet'
import './map.css'
import articles from '../data/articles.json'

export default function Map() {
    const [selectedIndex, setSelectedIndex] = useState(6)
    
    const filterPlanets = [
        { id:"planet1" ,title: "life sciences", bgColor: "red" },
        { id:"planet2" ,title: "informatie & technologie", bgColor: "blue" },
        { id:"planet3" ,title: "Design Technology & Art", bgColor: "red" },
        { id:"planet4" ,title: "buissness & media", bgColor: "red" },
        { id:"planet5" ,title: "Bedrijf & Organisatie", bgColor: "red" },
        { id:"planet6" ,title: "Architectuur & Design", bgColor: "red" },
        { id:"planet7" ,title: "Active Health", bgColor: "red" },
        { id:"planet8" ,title: "Mens & Welzijn", bgColor: "red" },
        { id:"planet9" ,title: "School Of Education", bgColor: "red" },
        { id:"planet10" ,title: "School Of Nursing", bgColor: "red" },
        { id:"planet11" ,title: "Smart Tech", bgColor: "red" },
        { id:"planet12" ,title: "Social Agogisch Werk", bgColor: "red" },
        { id:"planet13" ,title: "Digital Arts & Entertainment", bgColor: "red" },
    ]

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + filterPlanets.length) % filterPlanets.length)
            } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % filterPlanets.length)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return(
        <div>
            <div>
                {filterPlanets.map((planet, index) => (
                    <div key={index} style={{ opacity: index === selectedIndex ? 1 : 0.5 }}>
                        <FilterPlanet id={planet.id} title={planet.title} bgColor={planet.bgColor}/>
                    </div>
                ))}
            </div>
            <div>
                {articles.map(article => (
                    <Planet key={article.id} id={article.id} title={article.title} projectManager={article.projectManager} areasOfExpertise={article.areasOfExpertise} themes={article.themes} kernwoorden={article.kernwoorden} text={article.text} bgColor="green"/>
                ))}
            </div>
        </div>
    )
}