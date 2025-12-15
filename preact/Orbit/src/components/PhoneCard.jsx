import { Link } from 'preact-router'
import dummyImage from '../assets/dummyImage.png';
import useGetDomains from '../hooks/useGetDomains';
import PhoneDomainPills from './PhoneDomainPills';
import useGetKeywords from '../hooks/useGetKeywords';
import PhoneKeywordPills from '../components/KeyWordsPills';



export default function PhoneCard({ project, background, textColor }) {

        const keywords = useGetKeywords(project);

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
                <div style={{position: 'relative', height: '150px', width: '100%', overflow: 'hidden'}}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage:`url(${project.image || dummyImage})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        filter: "brightness(0.8)",
                        zIndex: 0
                    }}></div>
                    <div style={{position: 'relative', zIndex: 1}}>
                        <PhoneKeywordPills keywords={keywords} pillClassName="keyword-pill-card" wrapperClassName="keyword-wrapper-card" />
                    </div>
                </div>
                <div style={cardLabelStyle}>
                <div>
                    <h2 style={cardTitleStyle}>
                        {project.ccode}
                    </h2>
                    <div>
                        <PhoneDomainPills  pillClassName='phonedomain cardPill'domains={transitiedomeinen} />
                    </div>
                </div>

                </div>
            </div>
        </Link>
    )
}