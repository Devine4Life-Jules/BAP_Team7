import { Link } from 'preact-router'
import dummyImage from '../assets/dummyImage.png';
import useGetDomains from '../hooks/useGetDomains';
import PhoneDomainPills from './PhoneDomainPills';

const cardStyle = {
    border: "1px solid white",
    borderRadius: "10px",
    overflow: "hidden",
    color: "white",
}

const cardLabelStyle = {
    padding: '1rem 0 .1rem 1rem',
}

const cardTitleStyle = {
    fontSize: '1.2rem',
    fontFamily: 'VAGroundedstd-bold',
}

export default function PhoneCard({ project, background }) {
    const transitiedomeinen = useGetDomains(project);

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
                <div style={cardLabelStyle}>
                    <h2 style={cardTitleStyle}>
                        {project.ccode}
                    </h2>
                    <div>
                        <PhoneDomainPills domains={transitiedomeinen} />
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        {project.cdesc}
                    </p>
                </div>
            </div>
        </Link>
    )
}