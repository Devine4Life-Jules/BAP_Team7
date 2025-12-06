import { useContext } from 'preact/hooks';
import Button from '../../../components/Button';
import logoHowestResearch from '../../../assets/logo_howestResearch.png'
import useKeyboardNavigation from "../../../hooks/useNavigation";
import { ProjectsContext } from '../../../contexts/ProjectsContext';
export default function Screen1() {
  useKeyboardNavigation({next: '/screen2', back: null});
  const { projects, loading } = useContext(ProjectsContext);
  console.log('Projects: ', projects);

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
