import { useEffect } from "preact/hooks";
import { route } from 'preact-router';

export default function useKeyboardNavigation({back, next}) {
        useEffect(() => {
          function handleKey(e) {
            if (e.code === "Space") {
              e.preventDefault();
              route(next);
            };
            if (e.code === "Backspace") {
                route(back);
            }
          }
      
          window.addEventListener('keydown', handleKey);
      
          return () => window.removeEventListener('keydown', handleKey);
        },);  
}


