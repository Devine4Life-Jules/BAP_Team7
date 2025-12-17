import { useState, useEffect, useContext } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { supabase } from '../../lib/supabase';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import DashboardNav from '../../components/DashboardNav';
import DashboardSearch from '../../components/DashboardSearch';
import './dashboard.css';

const PROJECTS_PER_PAGE = 10;

export default function DashboardList() {
    const { projects } = useContext(ProjectsContext);
    
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem('dashboardListPage');
        return savedPage ? parseInt(savedPage, 10) : 1;
    });
    const [projectStats, setProjectStats] = useState({});
    
    const [stats, setStats] = useState({
        totalScans: 0,
        totalContacts: 0,
        loading: true
    });

    const [topScanned, setTopScanned] = useState([]);
    const [topSaved, setTopSaved] = useState([]);

    useEffect(() => {
        localStorage.setItem('dashboardListPage', currentPage.toString());
    }, [currentPage]);

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

                setProjectStats({ scanCounts, saveCounts });
                
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

    const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const paginatedProjects = projects.slice(startIndex, endIndex);
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <div class="dashboard-container">
            <DashboardNav />
            <div className="dashboard-home">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">Dashboard Orbit</h1>
                    <DashboardSearch />
                </header>
                <main>


                    <div className="projects-list-section">
                        <h2 className="dashboard-h2">Alle Projecten</h2>
                        <div className="projects-list-window">
                            <div className="projects-grid">
                                <div className="projects-grid-header">
                                    <div className="grid-cell header-cell">ID</div>
                                    <div className="grid-cell header-cell">CCode</div>
                                    <div className="grid-cell header-cell">Scans</div>
                                    <div className="grid-cell header-cell">Saves</div>
                                </div>
                                
                                {paginatedProjects.map(project => (
                                    <Link href={`/dashboardDetail/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
                                        <div className="projects-grid-row">
                                            <div className="grid-cell">{project.id}</div>
                                            <div className="grid-cell">{project.ccode}</div>
                                            <div className="grid-cell">{projectStats.scanCounts?.[project.id] || 0}</div>
                                            <div className="grid-cell">{projectStats.saveCounts?.[project.id] || 0}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="pagination-controls">
                            <button 
                                className="pagination-btn" 
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <div className="pagination-pages">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => handlePageClick(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button 
                                className="pagination-btn" 
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                        <p className="pagination-info">
                            Page {currentPage} of {totalPages} (Showing {paginatedProjects.length} of {projects.length} projects)
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}