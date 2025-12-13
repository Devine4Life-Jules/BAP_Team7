import { Link } from 'preact-router'
import dummyImage from '../assets/dummyImage.png';
import useGetDomains from '../hooks/useGetDomains';
import PhoneDomainPills from './PhoneDomainPills';



export default function PhoneCard({ project, background, textColor }) {

            const cardStyle = {
            border: `1px solid ${textColor || '#ccc'}`,
            borderRadius: "10px",
            overflow: "hidden",
            color: textColor || '#ccc',
        }

        const cardLabelStyle = {
            padding: '.5rem 1rem 1rem .5rem',
        }

        const cardTitleStyle = {
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
            fontFamily: 'Nunito',
            fontWeight: '700',
            textAlign: 'left',
            paddingTop: '.5rem',
        }



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
                <div>
                    <h2 style={cardTitleStyle}>
                        {project.ccode}
                    </h2>
                    <div>
                        <PhoneDomainPills domains={transitiedomeinen} />
                    </div>
                </div>

                </div>
            </div>
        </Link>
    )
}