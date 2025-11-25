import projects from '../../data/projects.json'
import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'

export default function ProjectDetails({id}){

    useEffect(() => {
        function handleKey(e) {
            if (e.code === 'Backspace') {
                route(`/project/${id}`);
            };
        }

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
    }, [id]);

    const project = projects.find(p => String(p.id) === String(id))
    
    if (!project) {
        return <div>Project not found</div>
    }

    // Extract transitiedomein labels (the ones with category "Transitiedomein")
    const transitiedomeinLabels = project.transitiedomeinen
        .filter(td => td.category === "Transitiedomein")
        .map(td => td.label)
        .join(", ");
 
    return(
        <div className="project-detail">
            <h2>{project.ccode} - {project.cdesc}</h2>
            
            <div className="project-info">
                <p>
                    <span className="label">Research Group:</span>
                    <span className="value">{project.researchGroup}</span>
                </p>
                
                <p>
                    <span className="label">Cluster:</span>
                    <span className="value">{project.cluster}</span>
                </p>

                {transitiedomeinLabels && (
                    <p>
                        <span className="label">Transitiedomein:</span>
                        <span className="value">{transitiedomeinLabels}</span>
                    </p>
                )}
            </div>

            {project.abstract && (
                <div className="full-abstract">
                    <h3>Full Abstract</h3>
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
