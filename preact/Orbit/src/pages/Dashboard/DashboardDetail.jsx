import { useState, useEffect, useContext } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { supabase } from '../../lib/supabase';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import DashboardNav from '../../components/DashboardNav';
import DashboardSearch from '../../components/DashboardSearch';
import mockGraph from '../../assets/mockGraph.png';
import './dashboard.css';

export default function DashboardDetail({ id }) {
    const { projects } = useContext(ProjectsContext);
    const project = projects.find(p => p.id === parseInt(id));

    const [stats, setStats] = useState({
        projectScans: 0,
        projectSaves: 0,
        projectUnsaves: 0,
        loading: true
    });

    useEffect(() => {
        async function fetchProjectStats() {
            try {
                const { data: scanData, error: scanError } = await supabase
                    .from('qr_scan_events')
                    .select('*')
                    .eq('project_id', id);
                
                if (scanError) console.error('Error fetching project scans:', scanError);

                const { data: savedData, error: savedError } = await supabase
                    .from('saved_project_events')
                    .select('action')
                    .eq('project_id', id);
                
                if (savedError) console.error('Error fetching project saves:', savedError);

                const projectSaves = savedData?.filter(event => event.action === 'save').length || 0;
                const projectUnsaves = savedData?.filter(event => event.action === 'unsave').length || 0;

                setStats({
                    projectScans: scanData?.length || 0,
                    projectSaves,
                    projectUnsaves,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching project stats:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        }

        if (id) {
            fetchProjectStats();
        }
    }, [id]);

    if (!project) {
        return (
            <div class="dashboard-container">
                <div className="dashboard-nav">
                    <ul>
                        <li><Link href="/dashboardList">Back</Link></li>
                    </ul>
                </div>
                <div className="dashboard-home">
                    <p>Project not found</p>
                </div>
            </div>
        );
    }

    return (
        <div class="dashboard-container">
            <DashboardNav />
            <div className="dashboard-home">
                <header className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">{project.ccode}</h1>

                    </div>
                    <DashboardSearch />
                </header>
                <main>
                    <div class="stats-row1">
                        <section>
                            <h2 className="dashboard-h2">Gescanned</h2>
                            <p className="statsNumber">{stats.loading ? '...' : stats.projectScans}</p>
                        </section>
                        <section>
                            <h2 className="dashboard-h2">Opgeslagen</h2>
                            <p className="statsNumber">{stats.loading ? '...' : stats.projectSaves}</p>
                        </section>
                        <section>
                            <h2 className="dashboard-h2">Verwijderd</h2>
                            <p className="statsNumber">{stats.loading ? '...' : stats.projectUnsaves}</p>
                        </section>
                    </div>

                    <div className="stats-row2">
                       <div className='mock-graph-section'><img src={mockGraph} alt="" /></div>
                        <div className='detailPage-stats'>
                           
                                <div>
                                    <h2 className='detailStatsH2'>Wanneer Gescanned</h2>
                                    <h3 className='detailStatsH3'>Meest Gescanned</h3>
                                    <p>2026-05-15 (12x)</p>
                                    <h3 className='detailStatsH3'>Laatst Gescanned</h3>
                                    <p>2026-06-01 (2x)</p>
                                </div>
                                 <div>
                                    <h2 className='detailStatsH2'>Wanneer Opgeslagen</h2>
                                    <h3 className='detailStatsH3'>Meest Opgeslagen</h3>
                                    <p>2026-04-12 (18x)</p>
                                    <h3 className='detailStatsH3'>Laatst Opgeslagen</h3>
                                    <p>2025-12-3 (5x)</p>
                                </div>
                           
                        </div>
                    </div>
                    <div class="stats-row1">
                        <section>
                            <h2 className="dashboard-h2">Meest Gescanned</h2>
                            <p className="statsNumber">14u45</p>
                        </section>
                        <section>
                            <h2 className="dashboard-h2">Opgeslagen</h2>
                            <p className="statsNumber">18u30</p>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
