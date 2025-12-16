import { useState, useEffect, useContext } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { supabase } from '../../lib/supabase';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import DashboardNav from '../../components/DashboardNav';
import DashboardSearch from '../../components/DashboardSearch';
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
                // Get all scans for this project
                const { data: scanData, error: scanError } = await supabase
                    .from('qr_scan_events')
                    .select('*')
                    .eq('project_id', id);
                
                if (scanError) console.error('Error fetching project scans:', scanError);

                // Get all save/unsave events for this project
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
                        <h1 className="dashboard-title">{project.name}</h1>
                        <p className="dashboard-subtitle" style={{ color: '#999', marginTop: '0.5rem' }}>
                            CCode: {project.ccode}
                        </p>
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

                    <div className="project-detail-section">
                        <h2 className="dashboard-h2">Project Details</h2>
                        <div className="project-info-box">
                            <div className="info-item">
                                <label>Description:</label>
                                <p>{project.description || 'No description available'}</p>
                            </div>
                            <div className="info-item">
                                <label>Project ID:</label>
                                <p>{project.id}</p>
                            </div>
                            <div className="info-item">
                                <label>Code:</label>
                                <p>{project.ccode}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
