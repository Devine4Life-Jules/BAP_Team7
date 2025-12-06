import { useState, useEffect, useContext } from 'preact/hooks'
import { Link } from 'preact-router'
import PhoneNav from "../../components/PhoneNav"
import { ProjectsContext } from '../../contexts/ProjectsContext'
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
        <div className="phoneScreen">
            <h1 class="mainPhoneTitle">Saved Projects</h1>
            
            {savedProjects.length === 0 ? (
                <p style={{ padding: '20px', color: '#666' }}>
                    No saved projects yet. Save projects to see them here!
                </p>
            ) : (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '15px',
                    padding: '20px 0'
                }}>
                    {savedProjects.map(project => (
                        <Link 
                            key={project.id}
                            href={`/phone/project/${project.id}`}
                            style={{
                                padding: '15px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: '#333',
                                border: '1px solid #ddd',
                                transition: 'all 0.3s'
                            }}
                        >
                            <h3 style={{ margin: '0 0 8px 0', color: '#2196F3' }}>
                                {project.ccode}
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                {project.cdesc}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
            
            <PhoneNav />
        </div>
    )
}