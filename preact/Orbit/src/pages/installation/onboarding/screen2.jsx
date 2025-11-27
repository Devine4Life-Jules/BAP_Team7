
import { useEffect } from "preact/hooks";
import { route } from 'preact-router';
import Button from '../../../components/Button';
import logoHowestResearch from '../../../assets/logo_howestResearch.png'
import useKeyboardNavigation from "../../../hooks/useNavigation";


function Screen2 () {
    useKeyboardNavigation({back: '/screen1', next: '/screen3'});
    return(
        <div className="onboarding-screen">
            <h2>Wie is Howest</h2>
            <div style={{width: "50%"}}>
              <img src={logoHowestResearch} alt="Howest Research Logo" />
            </div>
            <p>Innovatief en missiegedreven onderzoek met impact in vijf domeinen</p>
            <div style={{display: 'flex', gap: '20px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
        </div>
    )
}

export default Screen2;