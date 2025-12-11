import { Link } from 'preact-router'
import dummyImage from '../assets/dummyImage.png';

export default function PhoneCard({ project, background }) {
    return (
        <Link 
            key={project.id}
            href={`/phone/project/${project.id}`}
            style={{
                background: background,
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#333',
                transition: 'all 0.3s'
            }}
        >
            <div>
                <img src={dummyImage} alt="dummy image" />
                <h3 style={{ margin: '0 0 8px 0', color: '#2196F3' }}>
                    {project.ccode}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    {project.cdesc}
                </p>
            </div>
        </Link>
    )
}