
import { useEffect } from "preact/hooks";
import { route } from 'preact-router';
import Button from '../../../components/Button';
import logoHowestResearch from '../../../assets/logo_howestResearch.png'


function Screen2 () {
    useEffect(() => {
      function handleKey(e) {
        if (e.code === "Space") {
          e.preventDefault();
          route('/screen3');
        };
        if (e.code === "Backspace") {
            route('/');
        }
      }
  
      window.addEventListener('keydown', handleKey);
  
      return () => window.removeEventListener('keydown', handleKey);
    },);  
    return(
        <div className="onboarding-screen">
            <h2>Wie is Howest</h2>
            <div style={{width: "50%"}}>
              <img src={logoHowestResearch} alt="Howest Research Logo" />
            </div>
            <p>Innovatief en missiegedreven onderzoek met impact in vijf domeinen</p>
            <Button icon="back" text="back"></Button>
            <Button icon="check" text="Next"></Button>
        </div>
    )
}

export default Screen2;