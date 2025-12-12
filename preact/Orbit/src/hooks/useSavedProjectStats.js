import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';

/**
 * Hook to get save statistics for a project
 * Returns the net save count (saves - unsaves) and loading state
 */
export default function useSavedProjectStats(projectId) {
    const [saveCount, setSaveCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            if (!projectId) return;
            
            const { data, error } = await supabase
                .from('saved_project_events')
                .select('action')
                .eq('project_id', parseInt(projectId));
            
            if (!error && data) {
                // Calculate net saves (saves - unsaves)
                const saves = data.filter(event => event.action === 'save').length;
                const unsaves = data.filter(event => event.action === 'unsave').length;
                setSaveCount(Math.max(0, saves - unsaves)); // Don't go below 0
            }
            
            setLoading(false);
        }
        
        fetchStats();
    }, [projectId]);

    return { saveCount, loading };
}
