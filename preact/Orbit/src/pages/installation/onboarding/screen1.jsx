import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import Button from '../../../components/Button';

export default function Screen1() {
  useEffect(() => {
    function handleKey(e) {
      if (e.code === "Space") {
        e.preventDefault(); 
        route('/screen2');
      };
    }

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  },);

  return (
    <div className='onboarding-screen' >
      <h1>ORBIT</h1>
      <p>Lanceer je bedrijf naar de sterren met Howest Research</p>
      <Button type="check" text="Start"></Button>
    </div>
  );
}
