import { useState, useEffect, useContext } from 'preact/hooks'
import PhoneNav from "../../components/PhoneNav"
import dummyImage from '../../assets/dummyImage.png'
import { Link } from "preact-router"
import './phone.css'
import SaveIcon from '../../components/saveIcon'
import imgOverlayClouds from '../../assets/imgOverlayClouds.png'

import { ProjectsContext } from '../../contexts/ProjectsContext';



export default function PhoneProject({id}){


    const { projects, loading } = useContext(ProjectsContext);

    if (loading) return <div class="loader"></div>;

    const [isSaved, setIsSaved] = useState(false);

    const project = projects.find(p => String(p.id) === String(id));

    const transitiedomeinen = project.transitiedomeinen
    .filter(td => td.category === "Transitiedomein");
    
    // Get saved projects from localStorage
    const getSavedProjects = () => {
        const saved = localStorage.getItem('savedProjects');
        return saved ? JSON.parse(saved) : [];
    };

    // Check if current project is saved
    const checkIfSaved = () => {
        const savedProjects = getSavedProjects();
        return savedProjects.includes(String(id));
    };

    // Save project
    const saveProject = () => {
        const savedProjects = getSavedProjects();
        if (!savedProjects.includes(String(id))) {
            savedProjects.push(String(id));
            localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
            setIsSaved(true);
        }
    };

    // Unsave project
    const unsaveProject = () => {
        const savedProjects = getSavedProjects();
        const filtered = savedProjects.filter(projectId => projectId !== String(id));
        localStorage.setItem('savedProjects', JSON.stringify(filtered));
        setIsSaved(false);
    };

    // Check saved status on component mount
    useEffect(() => {
        setIsSaved(checkIfSaved());
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
                                <div className="phoneDomainWrapper">
                                    {transitiedomeinen.map((td, index) => (
                                        <span key={index} id={`phonedomain${index}`} className={`phonedomain ${td.label}`}>
                                            {td.label}
                                        </span>
                                    ))}
                                </div>
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
                         <p dangerouslySetInnerHTML={{__html: project.teaserAbstract}} />
                          <Link href='/phone/contact' className="projectCTA">Samenwerken</Link>
                     </div>
                 </div>
                 

             </div>

             <div>
                <img className="projectImage" src={dummyImage} alt="project image" />
                <img className="imgOverlayClouds" src={imgOverlayClouds} alt="clouds overlay" />
             </div>
             <div className='phoneProjectAbstract'>
                <h2>Abstract</h2>
                <p dangerouslySetInnerHTML={{__html: project.abstract}} />
             </div>
            <PhoneNav />
        </div>
    )
}