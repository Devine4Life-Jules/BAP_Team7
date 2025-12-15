import { createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';

export const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (!error) setProjects(data);
      setLoading(false);
    }
    
    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, loading, selectedFilterIndex, setSelectedFilterIndex }}>
      {children}
    </ProjectsContext.Provider>
  );
}