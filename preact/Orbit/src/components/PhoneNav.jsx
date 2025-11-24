import { Link } from "preact-router/match";
export default function PhoneNav(){
    return(
        <nav>
            <ul>
                <li><Link href="/phone/contact">Contact</Link></li>
                <li><Link href="/phone/favourites">Favourites</Link></li>
                <li><Link href="/phone/project">Project</Link></li>
            </ul>
        </nav>
    )
}
