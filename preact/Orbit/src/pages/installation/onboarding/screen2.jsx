import Button from '../../../components/Button';
import logoHowestResearch from '../../../assets/logo_howestResearch.png'
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';
import OnboardingProgressBar from '../../../components/OnboardingProgressBar';
import Joystick from '../../../components/Joystick';

function Screen2 () {
    useKeyboardNavigation({back: '/', next: '/screen3'});
    useReBoot({rebootTime: 100000});
    return(
        <div className="onboarding-screen screen2">
          <h1 className="screen2Title"><span style={{fontWeight: "100"}}>Wat is</span> ORBIT ?</h1>
            <p style={{fontSize: "20px", maxWidth:"75%", fontWeight: "lighter"}}>Orbit is een installatie die laat zien hoe Howest Research jou kan ondersteunen en inspireren.</p>
            <div style={{display: 'flex', gap: '20px', marginBottom: '100px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
            <OnboardingProgressBar step={1} />
        </div>
    )
}

export default Screen2;