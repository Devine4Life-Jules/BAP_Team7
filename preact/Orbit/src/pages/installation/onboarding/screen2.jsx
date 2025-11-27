
import { useEffect } from "preact/hooks";
import { route } from 'preact-router';
import Button from '../../../components/Button';

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
            <h2>Wie is Howest Research?</h2>
            <Button icon="back" text="back"></Button>
            <Button icon="check" text="Next"></Button>
        </div>
    )
}

export default Screen2;