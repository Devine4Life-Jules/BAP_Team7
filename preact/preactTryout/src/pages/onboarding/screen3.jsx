import { Link } from "preact-router";

function Screen3 () {
    return(
        <div>
            "hello screen 3"
            <div>
                <Link href="/screen2">back </Link>
                <Link href="/map">start</Link>
            </div>
        </div>
    )
}

export default Screen3;