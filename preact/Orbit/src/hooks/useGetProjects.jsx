import { useContext } from "preact/hooks";
import { ProjectsContext } from '../contexts/ProjectsContext';



export default function useGetProjects(){
    const { projects, loading } = useContext(ProjectsContext);
    if (loading) return <div class="loader"></div>
    return projects;
}