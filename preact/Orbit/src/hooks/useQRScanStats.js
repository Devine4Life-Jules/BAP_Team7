import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';

/**
 * Hook to get QR scan count for a project
 * Returns the total number of QR scans and loading state
 */
export default function useQRScanStats(projectId) {
    const [scanCount, setScanCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScanCount() {
            if (!projectId) return;
            
            const { data, error, count } = await supabase
                .from('qr_scan_events')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', parseInt(projectId));
            
            if (!error) {
                setScanCount(count || 0);
            }
            
            setLoading(false);
        }
        
        fetchScanCount();
    }, [projectId]);

    return { scanCount, loading };
}
