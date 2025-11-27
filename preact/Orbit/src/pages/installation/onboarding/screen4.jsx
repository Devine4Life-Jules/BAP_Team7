
import { useEffect } from "preact/hooks";
import { route } from 'preact-router';
import Button from '../../../components/Button';
import useKeyboardNavigation from "../../../hooks/useNavigation";



function Screen4 () {
    useKeyboardNavigation({back: '/screen3', next: '/map'});
    return(
        <div className="onboarding-screen">
            <p>Gebruik de joystick om te navigeren door ons universum van onderzoek en innovatie</p>
            <div style={{display: 'flex', gap: '20px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
        </div>
    )
}

export default Screen4;