import { Link } from "preact-router"

export default function FilterPlanet({id,bgColor, title}) {
    return(
        <>
            
                <div id={id} style={{width:'100px',height:"100px",borderRadius:"50%",backgroundColor:bgColor, position:"absolute"}}>
                    <h3>{title}</h3>
                </div>
            
        </>
    )
}