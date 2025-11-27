
import { useEffect } from "preact/hooks";
import { route } from 'preact-router';


function Screen4 () {
    useEffect(() => {
      function handleKey(e) {
        if (e.code === "Space") {
          e.preventDefault();
          route('/map');
        };
        if (e.code === "Backspace") {
            route('/screen3');
        }
      }
  
      window.addEventListener('keydown', handleKey);
  
      return () => window.removeEventListener('keydown', handleKey);
    },);  
    return(
        <div className="onboarding-screen">
            <p>Gebruik de joystick om te navigeren door ons universum van onderzoek en innovatie</p>
        </div>
    )
}

export default Screen4;