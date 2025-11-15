
import { useEffect } from "preact/hooks";
import { route } from 'preact-router';


function Screen3 () {
    useEffect(() => {
      function handleKey(e) {
        if (e.code === "Space") {
          route('/map');
        };
        if (e.code === "Backspace") {
            route('/screen2');
        }
      }
  
      window.addEventListener('keydown', handleKey);
  
      return () => window.removeEventListener('keydown', handleKey);
    },);  
    return(
        <div>
            "hello screen 3"
        </div>
    )
}

export default Screen3;