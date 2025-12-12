import { useState, useEffect,  } from 'preact/hooks'
import PhoneNav from "../../components/PhoneNav"
import dummyImage from '../../assets/dummyImage.png'
import { Link } from "preact-router"
import './phone.css'
import SaveIcon from '../../components/SaveIcon'
import imgOverlayClouds from '../../assets/imgOverlayClouds.png'
import useGetProjects from '../../hooks/useGetProjects'
import PhoneDomainPills from '../../components/PhoneDomainPills';
import useGetDomains from '../../hooks/useGetDomains'
import { supabase } from '../../lib/supabase'
import PhoneFooter from '../../components/PhoneFooter'
import PhoneCard from '../../components/PhoneCard'



export default function PhoneProject({id}){


    const projects = useGetProjects();
    const project = projects.find(p => String(p.id) === String(id));
    const transitiedomeinen = useGetDomains(project);

    const [isSaved, setIsSaved] = useState(false);

    // Get 3 similar projects from the same domain
    const similarProjects = projects
        .filter(p => {
            // Exclude current project
            if (String(p.id) === String(id)) return false;
            
            // Check if project has any matching transitiedomein
            return p.transitiedomeinen?.some(td => 
                transitiedomeinen.some(currentTd => 
                    td.label === currentTd.label && td.category === "Transitiedomein"
                )
            );
        })
        .slice(0, 3); // Get first 3 matches

    const getSavedProjects = () => {
        const saved = localStorage.getItem('savedProjects');
        return saved ? JSON.parse(saved) : [];
    };

    const checkIfSaved = () => {
        const savedProjects = getSavedProjects();
        return savedProjects.includes(String(id));
    };

    const saveProject = async () => {
        const savedProjects = getSavedProjects();
        if (!savedProjects.includes(String(id))) {
            savedProjects.push(String(id));
            localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
            setIsSaved(true);
            
            // Log to Supabase
            await supabase
                .from('saved_project_events')
                .insert({ 
                    project_id: parseInt(id), 
                    action: 'save' 
                });
        }
    };

    const unsaveProject = async () => {
        const savedProjects = getSavedProjects();
        const filtered = savedProjects.filter(projectId => projectId !== String(id));
        localStorage.setItem('savedProjects', JSON.stringify(filtered));
        setIsSaved(false);
        
        // Log to Supabase
        await supabase
            .from('saved_project_events')
            .insert({ 
                project_id: parseInt(id), 
                action: 'unsave' 
            });
    };

    useEffect(() => {
        setIsSaved(checkIfSaved());
        
        // Check if user came from QR code scan
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source');
        
        if (source === 'qr') {
            // Log QR scan to Supabase
            supabase
                .from('qr_scan_events')
                .insert({ 
                    project_id: parseInt(id)
                })
                .then(() => {
                    console.log('QR scan logged for project', id);
                })
                .catch(err => {
                    console.error('Error logging QR scan:', err);
                });
            
            // Optional: Remove the ?source=qr from URL to clean it up
            // This prevents logging the same scan if user refreshes
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
        }
    }, [id]);
    
    if (!project) {
        return <div>Project not found</div>
    }

    return(
        <div className="phoneScreen">
            
             <div class="phoneProjectHeader">
                 <div className="phoneProjectHeaderContent">
                     <div className="phoneTitleWrapper">
                         <div>
                             <h1 className="mainPhoneTitle">{project.ccode}</h1>
                            {transitiedomeinen.length > 0 && (
                            <div>
                                <PhoneDomainPills domains={transitiedomeinen} />
                            </div>
                            )}
                         </div>
                         <div>
                            <button
                            onClick={isSaved ? unsaveProject : saveProject}
                            style={{
                            padding:'0',
                            backgroundColor: 'transparent',
                            border: 'none',
                            transition: 'opacity 0.3s'
                            }}
                        >
                            <SaveIcon isSaved={isSaved} />
                        </button>
                         </div>
                     </div>
                     <div className="teaser">
                         <p dangerouslySetInnerHTML={{__html: project.teaserAbstract}} style={{ marginBottom: '2rem' }} />
                          <Link href='/phone/contact' className="projectCTA">Samenwerken</Link>
                     </div>
                 </div>
                 

             </div>

             <div style={{background:'#010133'}}>
                 <div className="phoneProjectImageWrapper">
                    <img className="projectImage" src={dummyImage} alt="project image" />
                    <img className="imgOverlayClouds" src={imgOverlayClouds} alt="clouds overlay" />
                 </div>
                 <div className='phoneProjectAbstract'>
                    <h2 className='abstractTitle'>Abstract</h2>
                    <p className='abstractText' dangerouslySetInnerHTML={{__html: project.abstract}} />
                    <div className='moreLikeThis'>
                        <h3>meer zo als dit</h3>
                        {similarProjects.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {similarProjects.map(similarProject => (
                                    <PhoneCard key={similarProject.id} project={similarProject} textColor={"black"}  />
                                ))}
                            </div>
                        ) : (
                            <p>Geen gelijkaardige projecten gevonden</p>
                        )}
                    </div>
                 </div>
   
             </div>
            <PhoneNav />
            <PhoneFooter />
        </div>
    )
}