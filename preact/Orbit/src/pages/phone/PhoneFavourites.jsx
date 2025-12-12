import { useState, useEffect, useContext } from 'preact/hooks'
import { Link } from 'preact-router'
import PhoneNav from "../../components/PhoneNav"
import { ProjectsContext } from '../../contexts/ProjectsContext'
import PhoneCard from '../../components/PhoneCard'
import { supabase } from '../../lib/supabase'

import './phone.css'

export default function PhoneFavourites(){


    const { projects, loading } = useContext(ProjectsContext);
    if (loading) return <div class="loader"></div>

    const [savedProjects, setSavedProjects] = useState([]);

    useEffect(() => {
        // Get saved project IDs from localStorage
        const saved = localStorage.getItem('savedProjects');
        const savedIds = saved ? JSON.parse(saved) : [];
        
        // Filter projects to get only saved ones
        const savedProjectData = projects.filter(project => 
            savedIds.includes(String(project.id))
        );
        
        setSavedProjects(savedProjectData);
    }, []);

    return(
        <div className="phoneFavourites">
            <h1 class="mainPhoneTitle">Opgeslagen</h1>
            <p>Jouw verzameling van onderzoeken. Alles op één plek.</p>
            
            {savedProjects.length === 0 ? (
                <p style={{ padding: '20px', color: '#666' }}>
                    No saved projects yet. Save projects to see them here!
                </p>
            ) : (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '15px',
                    padding: '15px'
                }}>
                    {savedProjects.map(project => (
                        <PhoneCard key={project.id} project={project} background={`linear-gradient(90deg, #494781 0%, rgba(73, 71, 129, 0.00) 100%)`} />
                    ))}
                </div>
            )}
            
            <PhoneNav />
        </div>
    )
}