import { useEffect } from "preact/hooks";
import { route } from 'preact-router';

export default function useKeyboardNavigation({back, next, backKey = "Backspace", nextKey = "Space"}) {
        useEffect(() => {
          function handleKey(e) {
            const nextKeys = Array.isArray(nextKey) ? nextKey : [nextKey];
            const backKeys = Array.isArray(backKey) ? backKey : [backKey];
            
            if (nextKeys.includes(e.code)) {
              e.preventDefault();
              route(next);
            };
            if (backKeys.includes(e.code)) {
                route(back);
            }
          }
      
          window.addEventListener('keydown', handleKey);
      
          return () => window.removeEventListener('keydown', handleKey);
        }, [back, next, backKey, nextKey]);  
}


