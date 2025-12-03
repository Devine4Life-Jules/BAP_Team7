import { Link } from "preact-router"

import PlanetBg from '../assets/planet.png'

export default function Planet({id, bgColor, title}) {

    const TextStyle = {
        textDecoration: 'none',
        color: 'white',
        textShadow: '0 0 5px purple',
        textAlign: 'center',
        backgroundColor:'red',
    };

    return(
        <>
            <Link href={`/project/${id}`} style={TextStyle}>
                <div id={id} style={{
                    width:'100px',
                    height:"100px",
                    borderRadius:"50%",
                    backgroundImage: `url(${PlanetBg})`, 
                    position:"absolute",  
                    backgroundSize:'cover', 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center'
                }}>
                    <h3>{title}</h3>
                </div>
            </Link>
        </>
    )
}