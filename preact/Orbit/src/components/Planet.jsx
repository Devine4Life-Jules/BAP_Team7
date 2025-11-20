import { Link } from "preact-router"

export default function Planet({id,bgColor, title}) {
    return(
        <>
            <Link href={`/article/${id}`}>
                <div id={id} style={{width:'100px',height:"100px",borderRadius:"50%",backgroundColor:bgColor, position:"absolute"}}>
                    <h3>{title}</h3>
                </div>
            </Link>
        </>
    )
}