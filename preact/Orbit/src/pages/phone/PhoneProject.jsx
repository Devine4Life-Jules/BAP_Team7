import PhoneNav from "../../components/PhoneNav"
import projects from '../../data/projects.json'
import { Link } from "preact-router"
import './phone.css'



export default function PhoneProject({id}){

    const project = projects.find(p => String(p.id) === String(id));
    
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
             <div>
                <img src={project.image} alt="project image" />
             </div>
             <div>
                <h2>Abstract</h2>
                <p dangerouslySetInnerHTML={{__html: project.abstract}} />
             </div>
            <PhoneNav />
        </div>
    )
}