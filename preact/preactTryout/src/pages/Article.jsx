export default function Article({id, title, projectManager, areasOfExpertise,themes,kernwoorden,text}){
    return(
        <div>
            <h2>{id} - {title}</h2>
            <p>project manager <span style={{fontWeight:'bold'}}>{projectManager}</span></p>
            <p>Areas Of Expertise <span style={{fontWeight:'bold'}}>{areasOfExpertise}</span></p>
            <p>themes <span style={{fontWeight:'bold'}}>{themes}</span></p>
            <p>kernwoorden <span style={{fontWeight:'bold'}}>{kernwoorden}</span></p>
            <p>text <span style={{fontWeight:'bold'}}>{text}</span></p>


        </div>
    )
}