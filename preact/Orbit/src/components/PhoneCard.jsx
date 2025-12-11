import { Link } from 'preact-router'

export default function PhoneCard({ project }) {
    return (
        <Link 
            key={project.id}
            href={`/phone/project/${project.id}`}
            style={{
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#333',
                border: '1px solid #ddd',
                transition: 'all 0.3s'
            }}
        >
            <h3 style={{ margin: '0 0 8px 0', color: '#2196F3' }}>
                {project.ccode}
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                {project.cdesc}
            </p>
        </Link>
    )
}