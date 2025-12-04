import { Link } from "preact-router/match";
export default function PhoneNav(){
    const lastProjectId = localStorage.getItem('lastVisitedProject') || '835'; 

    return(
        <nav>
            <ul>
                <li><Link class="phoneNavButton" href="/phone/contact">Contact</Link></li>
                <li><Link class="phoneNavButton" href="/phone/favourites">Favourites</Link></li>
                <li><Link class="phoneNavButton" href={`/phone/project/${lastProjectId}`}>Project</Link></li>
            </ul>
        </nav>
    )
}
