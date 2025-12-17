import { useState, useEffect, useContext } from 'preact/hooks'
import { Link } from 'preact-router'
import PhoneNav from "../../components/PhoneNav"
import { ProjectsContext } from '../../contexts/ProjectsContext'
import PhoneCard from '../../components/PhoneCard'
import { supabase } from '../../lib/supabase'
import PhoneFooter from '../../components/PhoneFooter'
import useGetProjects from '../../hooks/useGetProjects'
import savedPlanet from '../../assets/savedPlanet.png'

import './phone.css'

export default function PhoneFavourites(){


    const projects = useGetProjects();

    const [savedProjects, setSavedProjects] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('savedProjects');
        const savedIds = saved ? JSON.parse(saved) : [];
                const savedProjectData = projects.filter(project => 
            savedIds.includes(String(project.id))
        );
        
        setSavedProjects(savedProjectData);
    }, []);

    return(
        <div className="phoneFavourites" style={{ paddingTop: '2rem' }}>
            <div style={{ borderRadius: '30px', background:'linear-gradient(0deg, rgba(73, 71, 129, 0.00) 0%, #6462A7 100%)', padding: '2rem 1rem',width: '85%', margin: '0 auto' }}>
                <h1 class="mainPhoneTitle centerTitle">Opgeslagen</h1>
                {savedProjects.length === 0 ? (
                    <div className="saved-empty">
                        <p>Je hebt nog niks opgeslagen</p>
                        <p>Ontdek onderzoeken op Orbit, onze installatie die jou bedrijf naar de sterren lanceert!</p>
                        <div className='saved-planet'><img src={savedPlanet} alt="planet illustration" /></div>
                    </div>
                ) : (
                    <div className="saved-projects" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}>
                        <p style={{ textAlign: 'center' }}>Jouw verzameling van onderzoeken. Alles op één plek.</p>
                        {savedProjects.map(project => (
                            <PhoneCard key={project.id} project={project} background={`linear-gradient(90deg, #494781 0%, rgba(73, 71, 129, 0.00) 100%)`} />
                        ))}
                    </div>
                )}
            </div>
            <PhoneNav />
            <PhoneFooter />
        </div>
    )
}