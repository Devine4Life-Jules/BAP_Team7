import { Link } from "preact-router"

import PlanetBg from '../assets/planet.png'

export default function Planet({id, bgColor, title, opacity = 1, isAnimating = false}) {

    const TextStyle = {
        textDecoration: 'none',
        color: 'white',
        textShadow: '0 0 5px purple',
        textAlign: 'center',
        backgroundColor:'red',
    };
    
    // Faster transitions for low-end devices
    const isLowEnd = /arm|aarch64/i.test(navigator.userAgent) || navigator.hardwareConcurrency <= 4
    const transitionSpeed = isLowEnd ? '0.15s' : '0.3s'

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
                    justifyContent:'center',
                    opacity: isAnimating ? 0 : opacity,
                    transition: `opacity ${transitionSpeed} ease`,
                    willChange: 'opacity, transform',
                    animation: isAnimating ? 'planetAppear 0.5s ease-out forwards' : 'none',
                    '--final-opacity': opacity
                }}>
                    <h3>{title}</h3>
                </div>
            </Link>
        </>
    )
}