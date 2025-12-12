import { Link } from "preact-router";

export default function PhoneError() {
    return (
        <div className="phoneError">
            <h1>oops</h1>
            <p>this page was not found</p>
            <Link href="/phone/favourites">back to saved projects</Link>
        </div>
    );
}
