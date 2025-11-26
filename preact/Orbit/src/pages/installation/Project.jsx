import projects from '../../data/projects.json'
import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import Button from '../../components/Button';



export default function Project({id}){

    useEffect(() => {
        function handleKey(e) {
            if (e.code === 'Backspace') {
                route(`/map`);
            } else if (e.code === 'Space') {
                e.preventDefault();
                route(`/project/${id}/details`);
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
            <h2>{project.ccode}</h2>
            
            <div className="project-info">
                <p>
                    <span className="label">Research Group:</span>
                    <span className="value">{project.researchGroup}</span>
                </p>
                

                {transitiedomeinLabels && (
                    <p>
                        <span className="label">Transitiedomein:</span>
                        <span className="value">{transitiedomeinLabels}</span>
                    </p>
                )}
            </div>

            {project.teaserAbstract && (
                <div className="teaser-abstract">
                    <div dangerouslySetInnerHTML={{__html: project.teaserAbstract}} />
                </div>
            )}

            <Button icon={"check"} text={"Read More"}/>
        </div>
    )
}
