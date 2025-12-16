import { useContext } from 'preact/hooks';
import Button from '../../../components/Button';
import logoHowestResearch from '../../../assets/Logo_Howest_Research.png'
import useKeyboardNavigation from "../../../hooks/useNavigation";
import { ProjectsContext } from '../../../contexts/ProjectsContext';
export default function Screen1() {
  useKeyboardNavigation({next: '/screen2', back: null, nextKey: ["Space", "Backspace","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","q", "e"]});
  const { projects, loading } = useContext(ProjectsContext);
  console.log('Projects: ', projects);

  return (
    <div className='onboarding-screen screen1' >
      <h1 class="mainTitle">ORBIT</h1>
      <p style={{fontSize: '1.5rem', fontWeight:'100'}}>Lanceer je bedrijf naar de sterren</p>
      <p className='onboardingInstruction' style={{marginTop: '33rem'}}>Druk een Knop om verder te gaan</p>
      <div className="bottomLogo" style={{marginTop: 'auto'}}>
        <img src={logoHowestResearch} alt="Howest Research Logo" style={{marginBottom:'2.5rem', marginTop:'3rem'}}/>
      </div>
    </div>
  );
}
