import Button from '../../../components/Button';
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';
import OnboardingProgressBar from '../../../components/OnboardingProgressBar';
import noTouchIcon from '../../../assets/noTouchIcon.png'

function Screen2 () {
    useKeyboardNavigation({back: '/', next: '/screen3'});
    useReBoot({rebootTime: 100000});
    return(
        <div className="onboarding-screen screen2">
          <h1 className="screen2Title"><span style={{fontWeight: "100"}}>Wat is</span> <span style={{fontWeight:"900"}}>ORBIT ?</span></h1>
            <p style={{fontSize: "30px",margin:"1rem auto 2rem auto", maxWidth:"70%", fontWeight: "lighter"}}>Orbit is een installatie die laat zien hoe Howest Research jou kan ondersteunen en inspireren.</p>
            <p style={{fontSize: "30px",margin:"1rem auto 2rem auto", maxWidth:"70%", fontWeight: "400"}}>Bedien Orbit met de knoppen onderaan</p>
            <div style={{width:"7rem", margin: "1rem"}}><img src={noTouchIcon} alt="" /></div>
            <div style={{display: 'flex', gap: '20px', marginBottom: '100px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
            <OnboardingProgressBar step={1} style={{alignSelf:"flex-end"}}/>
        </div>
    )
}

export default Screen2;