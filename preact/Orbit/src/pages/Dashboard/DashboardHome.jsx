import { useState, useEffect, useContext } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { supabase } from '../../lib/supabase';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import DashboardNav from '../../components/DashboardNav';
import DashboardSearch from '../../components/DashboardSearch';
import mockGraph from '../../assets/mockGraph.png';
import './dashboard.css';

export default function DashboardHome() {
    const { projects } = useContext(ProjectsContext);
    
    const [stats, setStats] = useState({
        totalScans: 0,
        savedProjects: 0,
        unsavedProjects: 0,
        totalContacts: 0,
        loading: true
    });

    const [topScanned, setTopScanned] = useState([]);
    const [topSaved, setTopSaved] = useState([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                const { data: scanData, error: scanError } = await supabase
                    .from('qr_scan_events')
                    .select('*');
                
                console.log('QR Scans result:', { data: scanData, error: scanError });
                if (scanError) console.error('Error fetching scans:', scanError);

                const { data: savedData, error: savedError } = await supabase
                    .from('saved_project_events')
                    .select('action, project_id');
                
                if (savedError) console.error('Error fetching saved events:', savedError);

                const saves = savedData?.filter(event => event.action === 'save').length || 0;
                const unsaves = savedData?.filter(event => event.action === 'unsave').length || 0;

                // Calculate top 5 scanned projects
                const scanCounts = {};
                scanData?.forEach(scan => {
                    const pid = scan.project_id;
                    scanCounts[pid] = (scanCounts[pid] || 0) + 1;
                });
                
                const top5Scanned = Object.entries(scanCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([projectId, count]) => {
                        const project = projects.find(p => p.id === parseInt(projectId));
                        return {
                            id: projectId,
                            ccode: project?.ccode || `Project ${projectId}`,
                            count
                        };
                    });
                
                setTopScanned(top5Scanned);

                // Calculate top 5 saved projects (net saves)
                const saveCounts = {};
                savedData?.forEach(event => {
                    const pid = event.project_id;
                    if (!saveCounts[pid]) saveCounts[pid] = 0;
                    
                    if (event.action === 'save') {
                        saveCounts[pid]++;
                    } else if (event.action === 'unsave') {
                        saveCounts[pid]--;
                    }
                });
                
                const top5Saved = Object.entries(saveCounts)
                    .filter(([_, count]) => count > 0)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([projectId, count]) => {
                        const project = projects.find(p => p.id === parseInt(projectId));
                        return {
                            id: projectId,
                            ccode: project?.ccode || `Project ${projectId}`,
                            count
                        };
                    });
                
                setTopSaved(top5Saved);


                const { data: contactData, error: contactError } = await supabase
                    .from('contacts')
                    .select('id, companyName, contactName, email, message');
                

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
    }, [projects]);

    return (
        <div class="dashboard-container">
            <DashboardNav />
            <div className="dashboard-home">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">Dashboard Orbit</h1>
                    <DashboardSearch />
                </header>
                <main>
                    <div class="stats-row1">
                        <section>
                            <h2 className="dashboard-h2">Artikels Gescanned</h2>
                            <p className="statsNumber">{stats.loading ? '...' : stats.totalScans}</p>
                        </section>
                        <section>
                            <h2 className="dashboard-h2">Artikels Opgeslagen</h2>
                            <p className="statsNumber">{stats.loading ? '...' : stats.savedProjects}</p>
                         </section>
                        <section>
                            <h2 className="dashboard-h2">ContactGegevens Opgeslagen</h2>
                            <p className="statsNumber">{stats.loading ? '...' : stats.totalContacts}</p>
                        </section>
                    </div>
                    <div class="stats-row2">
                        <div class="mock-graph-section">
                            <img src={mockGraph} alt="Mock Graph" />
                        </div>
                        <section>
                            <h2 className="detailStatsH2" style={{marginBottom:'.5rem'}}>top gescanned</h2>
                            <ol>
                                {stats.loading ? (
                                    <li>Loading...</li>
                                ) : topScanned.length > 0 ? (
                                    topScanned.map(item => (
                                        <li key={item.id}>
                                            <Link href={`/dashboardDetail/${item.id}`} className="top-list-link" style={{ display: 'contents' }}>
                                                <span>{item.ccode}</span>
                                            </Link>
                                            ({item.count}x)
                                        </li>
                                    ))
                                ) : (
                                    <li>No data</li>
                                )}
                            </ol>
                        </section>
                        <section>
                            <h2 className="detailStatsH2" style={{marginBottom:'.5rem'}}>top opgeslagen</h2>
                            <ol>
                                {stats.loading ? (
                                    <li>Loading...</li>
                                ) : topSaved.length > 0 ? (
                                    topSaved.map(item => (
                                        <li key={item.id}>
                                            <Link href={`/dashboardDetail/${item.id}`} className="top-list-link" style={{ display: 'contents' }}>
                                                <span>{item.ccode}</span>
                                            </Link>
                                            ({item.count}x)
                                        </li>
                                    ))
                                ) : (
                                    <li>No data</li>
                                )}
                            </ol>
                        </section>

                    </div>
                    <div class="stats-row1">
                        <section>
                            <h2 className="dashboard-h2">Meest gescanned</h2>
                            <p className="statsNumber">17u30</p>
                        </section>
                        <section>
                            <h2 className="dashboard-h2">Meest opgeslagen</h2>
                            <p className="statsNumber">16u45</p>
                         </section>
                        <section>
                            <h2 className="dashboard-h2"> Meest Contactgegevens opgeslagen</h2>
                            <p className="statsNumber">20u</p>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}