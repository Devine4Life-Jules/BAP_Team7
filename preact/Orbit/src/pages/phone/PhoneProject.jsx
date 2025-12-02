import { useState, useEffect } from 'preact/hooks'
import PhoneNav from "../../components/PhoneNav"
import projects from '../../data/projects.json'
import dummyImage from '../../assets/dummyImage.png'
import { Link } from "preact-router"
import './phone.css'

export default function PhoneProject({id}){
    const [isSaved, setIsSaved] = useState(false);

    const project = projects.find(p => String(p.id) === String(id));
    
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
             <h2>{project.ccode}</h2>

             <div class="teaser">
                 <h2>Teaser</h2>
                 <p dangerouslySetInnerHTML={{__html: project.teaserAbstract}} />
                  <Link href='/phone/contact'>Contact page</Link>
             </div>
             
             <button 
                onClick={isSaved ? unsaveProject : saveProject}
                style={{
                    padding: '12px 24px',
                    margin: '20px 0',
                    cursor: 'pointer',
                    backgroundColor: isSaved ? '#4CAF50' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s'
                }}
             >
                {isSaved ? '✓ Saved' : 'Save Project'}
             </button>

             <div>
                <img src={dummyImage} alt="project image" />
             </div>
             <div>
                <h2>Abstract</h2>
                <p dangerouslySetInnerHTML={{__html: project.abstract}} />
             </div>
            <PhoneNav />
        </div>
    )
}