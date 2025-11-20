import { useState, useEffect, useMemo } from 'preact/hooks'
import Planet from "../components/Planet"
import FilterPlanet from '../components/FilterPlanet'
import './map.css'
import articles from '../data/articles.json'
import { route } from 'preact-router'

export default function Map() {


        useEffect(() => {
        function handleKey(e) {
            if (e.code === 'Backspace') {
                route(`/`);
            };
        }

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
    }, []);




    const [selectedIndex, setSelectedIndex] = useState(6)
    
    const filterPlanets = [
        { id:"planet1" ,title: "life sciences", bgColor: "red" },
        { id:"planet2" ,title: "informatie & technologie", bgColor: "red" },
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
    
    const PLANET_COUNT = filterPlanets.length

    const selectedFilterPlanet = filterPlanets[selectedIndex]
    const selectedArea = selectedFilterPlanet.title
    
    const filteredArticles = articles.filter(article => 
        article.areasOfExpertise === selectedArea
    )
    
    const articlePositions = useMemo(() => 
        filteredArticles.map((_, index) => {
            const angle = (index / Math.max(filteredArticles.length, 1)) * 360 + Math.random() * 30
            const radius = 80 + Math.random() * 60
            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius
            return { x, y }
        }),
        [filteredArticles.length]
    )

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'q') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + PLANET_COUNT) % PLANET_COUNT)
            } else if (event.key === 'e') {
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
                {filteredArticles.map((article, index) => {
                    const pos = articlePositions[index]
                    return (
                        <div key={article.id} style={{ position: 'absolute', left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)`, transform: 'translate(-50%, -50%)' }}>
                            <Planet id={article.id} title={article.title} projectManager={article.projectManager} areasOfExpertise={article.areasOfExpertise} themes={article.themes} kernwoorden={article.kernwoorden} text={article.text} bgColor="green"/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}