import { Link } from "preact-router"

export default function Planet({id,bgColor, title}) {

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
                <div id={id} style={{width:'100px',height:"100px",borderRadius:"50%",background:bgColor, position:"absolute"}}>
                    <h3>{title}</h3>
                </div>
            </Link>
        </>
    )
}