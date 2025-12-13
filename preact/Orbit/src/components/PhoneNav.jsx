import { Link, Match } from "preact-router/match";
import ProjectIcon from "./ProjectIcon";
import SaveIcon from "./SaveIcon";
import ContactIcon from "./ContactIcon";

export default function PhoneNav(){
    const lastProjectId = localStorage.getItem('lastVisitedProject') || '835'; 

    return(
        <nav>
            <ul>
                <li>
                    <Match path="/phone/contact">
                        {({ matches }) => (
                            <Link class={matches ? "phoneNavButton activeNavButton" : "phoneNavButton"} href="/phone/contact">
                                <div className="nav-icon" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                    <ContactIcon isActive={matches} />
                                    <span style={{ color: '#DBCBE5' }}>Contact</span>
                                </div>
                            </Link>
                        )}
                    </Match>
                </li>
                <li>
                    <Match path="/phone/favourites">
                        {({ matches }) => (
                            <Link class={matches ? "phoneNavButton activeNavButton" : "phoneNavButton"} href="/phone/favourites">
                                <div className="nav-icon" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                    <SaveIcon 
                                        isSaved={matches}
                                        fillColor={matches ? '#DBCBE5' : '#332E84'}
                                        strokeColor={matches ? '#DBCBE5' : '#DBCBE5'}
                                    />
                                    <span style={{ color: '#DBCBE5' }}>Saved</span>
                                </div>
                            </Link>
                        )}
                    </Match>
                </li>
                <li>
                    <Match path="/phone/project/:id">
                        {({ matches }) => (
                            <Link class={matches ? "phoneNavButton activeNavButton" : "phoneNavButton"} href={`/phone/project/${lastProjectId}`}>
                                <div className="nav-icon" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                    <ProjectIcon isActive={matches} />
                                    <span style={{ color: '#DBCBE5' }}>Project</span>
                                </div>
                            </Link>
                        )}
                    </Match>
                </li>
            </ul>
        </nav>
    )
}