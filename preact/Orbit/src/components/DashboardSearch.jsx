import { useState, useContext } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { ProjectsContext } from '../contexts/ProjectsContext';

export default function DashboardSearch() {
    const { projects } = useContext(ProjectsContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.length > 0) {
            const filtered = projects
                .filter(project => 
                    (project.name && project.name.toLowerCase().includes(query)) || 
                    (project.ccode && project.ccode.toLowerCase().includes(query))
                )
                .slice(0, 4);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = () => {
        setSearchQuery('');
        setSuggestions([]);
    };

    return (
        <div className="search-container">
            <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onInput={handleSearchChange}
                className="search-input"
            />
            {suggestions.length > 0 && (
                <div className="search-suggestions">
                    {suggestions.map(project => (
                        <Link 
                            key={project.id} 
                            href={`/dashboardDetail/${project.id}`}
                            className="suggestion-item"
                            onClick={handleSuggestionClick}
                        >
                            <div className="suggestion-name">{project.name}</div>
                            <div className="suggestion-ccode">{project.ccode}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
