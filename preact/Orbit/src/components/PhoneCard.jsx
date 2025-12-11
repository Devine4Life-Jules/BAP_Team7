import { Link } from 'preact-router'
import dummyImage from '../assets/dummyImage.png';

const cardStyle = {
    border: "1px solid white",
    borderRadius: "10px",
    overflow: "hidden",
    color: "white",
}

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
            <div style={cardStyle} >
                <img src={dummyImage} alt="dummy image" />
                <h3>
                    {project.ccode}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    {project.cdesc}
                </p>
            </div>
        </Link>
    )
}