import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import Button from '../../../components/Button';
import logoHowestResearch from '../../../assets/logo_howestResearch.png'

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
      <p>Lanceer je bedrijf naar de sterren</p>
      <div style={{width: "50%"}}>
        <img src={logoHowestResearch} alt="Howest Research Logo" />
      </div>
      <Button type="check" text="Start"></Button>

    </div>
  );
}
