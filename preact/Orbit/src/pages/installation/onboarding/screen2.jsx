import Button from '../../../components/Button';
import logoHowestResearch from '../../../assets/logo_howestResearch.png'
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';

function Screen2 () {
    useKeyboardNavigation({back: '/', next: '/screen3'});
    useReBoot({rebootTime: 100000});
    return(
        <div className="onboarding-screen screen2">
            <div class="screen2Logo">
              <img src={logoHowestResearch} alt="Howest Research Logo" />
            </div>
            <p style={{fontSize: "20px", maxWidth:"75%", fontWeight: "lighter"}}>Missiegedreven onderzoek dat jouw bedrijf lanceert naar nieuwe hoogtes</p>
            <div style={{display: 'flex', gap: '20px', marginBottom: '100px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
        </div>
    )
}

export default Screen2;