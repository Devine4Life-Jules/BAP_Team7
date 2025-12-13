import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../../lib/supabase';

export default function DashboardHome() {
    const [stats, setStats] = useState({
        totalScans: 0,
        savedProjects: 0,
        unsavedProjects: 0,
        totalContacts: 0,
        loading: true
    });

    useEffect(() => {
        async function fetchStats() {
            console.log('Starting to fetch dashboard stats...');
            try {
                // Fetch total QR scans
                console.log('Fetching QR scans...');
                const { data: scanData, error: scanError } = await supabase
                    .from('qr_scan_events')
                    .select('*');
                
                console.log('QR Scans result:', { data: scanData, error: scanError });
                if (scanError) console.error('Error fetching scans:', scanError);

                // Fetch saved/unsaved project events
                console.log('Fetching saved project events...');
                const { data: savedData, error: savedError } = await supabase
                    .from('saved_project_events')
                    .select('action');
                
                console.log('Saved events result:', { data: savedData, error: savedError });
                if (savedError) console.error('Error fetching saved events:', savedError);

                // Calculate saves and unsaves
                const saves = savedData?.filter(event => event.action === 'save').length || 0;
                const unsaves = savedData?.filter(event => event.action === 'unsave').length || 0;

                // Fetch total contacts - get all data and count length
                console.log('Fetching contacts...');
                const { data: contactData, error: contactError } = await supabase
                    .from('contacts')
                    .select('id, companyName, contactName, email, message');
                
                console.log('Contacts result:', { 
                    data: contactData, 
                    error: contactError,
                    length: contactData?.length,
                    firstItem: contactData?.[0]
                });
                if (contactError) {
                    console.error('Error fetching contacts:', contactError);
                    console.error('Full error details:', JSON.stringify(contactError, null, 2));
                }
                
                const finalStats = {
                    scans: scanData?.length || 0,
                    saves,
                    unsaves,
                    contacts: contactData?.length || 0
                };
                
                console.log('Final Dashboard Stats:', finalStats);

                setStats({
                    totalScans: scanData?.length || 0,
                    savedProjects: saves,
                    unsavedProjects: unsaves,
                    totalContacts: contactData?.length || 0,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        }

        fetchStats();
    }, []);

    return (
        <div>
            <div className="dashboard-nav">
                <ul>
                    <li>home</li>
                    <li>overview</li>
                </ul>
            </div>
            <div className="dashboard-home">
                <header className="dashboard-header">
                    <h1>Dashboard Orbit</h1>
                    <input type="text" placeholder="Search..." />
                </header>
                <main>
                    <div>
                        <section>
                            <h2>Artikels Gescanned</h2>
                            <p>{stats.loading ? '...' : stats.totalScans}</p>
                        </section>
                        <section>
                            <h2>Artikels Opgeslagen</h2>
                            <p>{stats.loading ? '...' : stats.savedProjects}</p>
                         </section>
                        <section>
                            <h2>Artikels Verwijderd</h2>
                            <p>{stats.loading ? '...' : stats.unsavedProjects}</p>
                        </section>
                        <section>
                            <h2>ContactGegevens Opgeslagen</h2>
                            <p>{stats.loading ? '...' : stats.totalContacts}</p>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}