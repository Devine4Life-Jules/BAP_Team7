import { Link } from "preact-router"

export default function Planet({bgColor, title}) {
    return(
        <>
            <Link href="/detail">
                <div style={{width:'100px',height:"100px",borderRadius:"50%",backgroundColor:bgColor}}>
                    <h3>{title}</h3>
                </div>
            </Link>
        </>
    )
}