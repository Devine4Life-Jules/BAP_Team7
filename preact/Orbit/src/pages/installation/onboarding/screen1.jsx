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
      <p>Lanceer je bedrijf naar de sterren</p>
      <div className="bottomLogo">
        <img src={logoHowestResearch} alt="Howest Research Logo" />
      </div>
      

    </div>
  );
}
