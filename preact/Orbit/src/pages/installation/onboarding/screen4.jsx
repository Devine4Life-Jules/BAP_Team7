

import Button from '../../../components/Button';
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';
import OnboardingProgressBar from '../../../components/OnboardingProgressBar';



function Screen4 () {
    useKeyboardNavigation({back: '/screen3', next: '/map'});
    useReBoot({rebootTime: 100000});
    return(
        <div className="onboarding-screen">
            <p className='onboardingInstruction'>Gebruik de joystick om te navigeren door ons universum van onderzoek en innovatie</p>
            <div style={{display: 'flex', gap: '20px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
            <OnboardingProgressBar step={3} />
        </div>
    )
}

export default Screen4;