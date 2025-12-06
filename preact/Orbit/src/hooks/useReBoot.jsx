import { useEffect } from "preact/hooks";
import { route } from 'preact-router';

export default function useReBoot({rebootTime}) {

  useEffect(() => {
    let timer;
    
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        route('/'); 
      }, rebootTime || 2000);
    };

    resetTimer();

    window.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [rebootTime]);     

}