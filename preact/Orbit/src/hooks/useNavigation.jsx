import { useEffect } from "preact/hooks";
import { route } from 'preact-router';

export default function useKeyboardNavigation({back, next, backKey = "Backspace", nextKey = "Space"}) {
        useEffect(() => {
          function handleKey(e) {
            const nextKeys = Array.isArray(nextKey) ? nextKey : [nextKey];
            const backKeys = Array.isArray(backKey) ? backKey : [backKey];
            
            // Check both e.code (physical key) and e.key (character) for better keyboard layout support
            if (nextKeys.includes(e.code) || nextKeys.includes(e.key)) {
              e.preventDefault();
              route(next);
            };
            if (backKeys.includes(e.code) || backKeys.includes(e.key)) {
                route(back);
            }
          }
      
          window.addEventListener('keydown', handleKey);
      
          return () => window.removeEventListener('keydown', handleKey);
        }, [back, next, backKey, nextKey]);  
}


