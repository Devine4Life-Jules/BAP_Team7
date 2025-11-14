import { Link } from "preact-router";

function Screen2 () {
    return(
        <div>
            "hello screen 2"
            <div>
                <Link href="/">back </Link>
                <Link href="/screen3">next</Link>
            </div>
        </div>
    )
}

export default Screen2;