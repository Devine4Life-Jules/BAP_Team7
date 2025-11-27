import projects from '../../data/projects.json'
import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import useKeyboardNavigation from '../../hooks/useNavigation';

export default function ProjectDetails({id}){

    useKeyboardNavigation({back: `/project/${id}`, next: null});



    const project = projects.find(p => String(p.id) === String(id))
    
    if (!project) {
        return <div>Project not found</div>
    }

    const transitiedomeinen = project.transitiedomeinen
        .filter(td => td.category === "Transitiedomein");
 
    return(
        <div className="project-detail">
            <h2>{project.manager} - {project.cdesc}</h2>
            
            <div className="project-info">
                <p>
                    <span className="label">Research Group:</span>
                    <span className="value">{project.researchGroup}</span>
                </p>
                
                {project.cluster && project.cluster !== "Clusteroverschrijdend" && (
                    <div className="vakgebieden">
                        <div className="pills">
                            <span className="pill vakgebied">
                                {project.cluster}
                            </span>
                        </div>
                    </div>
                )}

                {transitiedomeinen.length > 0 && (
                    <div className="transitiedomeinen">
                        <div className="pills">
                            {transitiedomeinen.map((td, index) => (
                                <span key={index} className={`pill ${td.label}`}>
                                    {td.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {project.abstract && (
                <div className="full-abstract">
                    <div dangerouslySetInnerHTML={{__html: project.abstract}} />
                </div>
            )}

            {project.keywords && (
                <div className="keywords">
                    <h3>Keywords</h3>
                    <p>{project.keywords}</p>
                </div>
            )}
        </div>
    )
}
