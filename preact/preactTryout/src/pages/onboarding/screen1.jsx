import { Link } from "preact-router";

export default function Screen1 () {
    return(
        <div>
            "hello screen 1"
            
            <div>
                <Link href="/screen2">next</Link>
            </div>
        </div>
    )
}

