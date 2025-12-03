// import projects from '../../data/projects.json' offline fallback
import useKeyboardNavigation from '../../hooks/useNavigation';

import { supabase } from '../../lib/supabase'
const { data: projects } = await supabase.from('projects').select('*')

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
            <h2>{project.ccode}</h2>
            
            <div className="project-info">
               
                
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
                        <div className="domains">
                            {transitiedomeinen.map((td, index) => (
                                <span key={index} className={`domain ${td.label}`}>
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

        </div>
    )
}
