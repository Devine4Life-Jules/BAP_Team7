import Button from '../../../components/Button';
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';
import FilterShapeSVG from '../../../assets/FilterShape.svg?raw';
import OnboardingProgressBar from '../../../components/OnboardingProgressBar';
import RotatingButton from '../../../components/RotatingButton';
import logo_howestResearch from '../../../assets/logo_howestResearch.png'


function Screen3 () {
    useKeyboardNavigation({back: '/screen2', next: '/map?fromOnboarding=true'});
    useReBoot({rebootTime: 100000});
    
    return(
        <div className="onboarding-screen screen3">            
            <p style={{fontSize:'3rem', marginTop:'20rem', fontWeight:'100'}}>Wie is</p>
            <div style={{width: '45vh'}}><img src={logo_howestResearch} alt="" /></div>
            <p style={{fontSize:'2rem', maxWidth:'70%', margin:'1.5rem auto',}}>Innovatief en missiegedreven onderzoek met impact in vijf domeinen</p>
            <div style={{display: 'flex', gap: '20px', margin:"1.5rem auto"}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
            <OnboardingProgressBar step={2} style={{alignSelf:"flex-end"}} />
        </div>
    )
}

export default Screen3;