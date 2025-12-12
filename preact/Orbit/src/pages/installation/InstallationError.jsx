import { Link } from "preact-router";
import useKeyboardNavigation from "../../hooks/useNavigation";

export default function InstallationError() {            
    useKeyboardNavigation({back: '/map', next: '/map'});
    return (

        <div className="installationError">
            <h1>Oops</h1>
            <p>your page was not found, press any button to go back to map</p>
        </div>
    );
}