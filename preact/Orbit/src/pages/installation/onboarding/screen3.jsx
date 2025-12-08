import Button from '../../../components/Button';
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';



function Screen3 () {
    useKeyboardNavigation({back: '/screen2', next: '/screen4'});
    useReBoot({rebootTime: 100000});
    return(
        <div className="onboarding-screen">
            <p>Gebruik de draaiknop om te Filteren tussen de verschillende vakgebieden</p>
            <div style={{display: 'flex', gap: '20px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
        </div>
    )
}

export default Screen3;