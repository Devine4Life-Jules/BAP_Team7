import { Link } from 'preact-router'
import useGetDomains from '../hooks/useGetDomains';
import PhoneDomainPills from './PhoneDomainPills';
import useGetKeywords from '../hooks/useGetKeywords';
import PhoneKeywordPills from '../components/KeyWordsPills';
import useDummyImage from '../hooks/useDummyImage';



export default function PhoneCard({ project, background, textColor }) {
        const keywords = useGetKeywords(project);
        const dummyImage = useDummyImage(project.id);

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
                <div style={{
                    display: 'grid',
                    height: '150px', 
                    width: '100%', 
                    overflow: 'hidden'
                }}>
                    <div style={{
                        gridArea: '1 / 1',
                        backgroundImage:`url(${project.image || dummyImage})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        filter: "brightness(0.8)",
                        zIndex: 0
                    }}></div>
                    <div style={{
                        gridArea: '1 / 1',
                        zIndex: 1,
                        alignSelf: 'end',
                    }}>
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