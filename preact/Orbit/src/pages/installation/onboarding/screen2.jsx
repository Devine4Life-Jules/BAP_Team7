
import { useEffect } from "preact/hooks";
import { route } from 'preact-router';


function Screen2 () {
    useEffect(() => {
      function handleKey(e) {
        if (e.code === "Space") {
          route('/screen3');
        };
        if (e.code === "Backspace") {
            route('/screen1');
        }
      }
  
      window.addEventListener('keydown', handleKey);
  
      return () => window.removeEventListener('keydown', handleKey);
    },);  
    return(
        <div>
            "hello screen 2"
        </div>
    )
}

export default Screen2;