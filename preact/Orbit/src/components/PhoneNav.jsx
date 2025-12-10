import { Link, Match } from "preact-router/match";

export default function PhoneNav(){
    const lastProjectId = localStorage.getItem('lastVisitedProject') || '835'; 

    return(
        <nav>
            <ul>
                <li>
                    <Match path="/phone/contact">
                        {({ matches }) => (
                            <Link class={matches ? "phoneNavButton activeNavButton" : "phoneNavButton"} href="/phone/contact">
                                Contact
                            </Link>
                        )}
                    </Match>
                </li>
                <li>
                    <Match path="/phone/favourites">
                        {({ matches }) => (
                            <Link class={matches ? "phoneNavButton activeNavButton" : "phoneNavButton"} href="/phone/favourites">
                                Favourites
                            </Link>
                        )}
                    </Match>
                </li>
                <li>
                    <Match path="/phone/project/:id">
                        {({ matches }) => (
                            <Link class={matches ? "phoneNavButton activeNavButton" : "phoneNavButton"} href={`/phone/project/${lastProjectId}`}>
                                Project
                            </Link>
                        )}
                    </Match>
                </li>
            </ul>
        </nav>
    )
}