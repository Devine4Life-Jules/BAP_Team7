import { useEffect, useRef } from 'preact/hooks'
import projects from '../../data/projects.json'
import Button from '../../components/Button';
import useKeyboardNavigation from '../../hooks/useNavigation';

export default function Project({id}){
    const qrcodeRef = useRef(null)
    
    const url = `${window.location.protocol}//${window.location.host}/phone/project/${id}`
    
    useKeyboardNavigation({back: '/map', next: `/project/${id}/details`});
    
    useEffect(() => {
        if (typeof window.QRCode !== 'undefined' && qrcodeRef.current) {
            qrcodeRef.current.innerHTML = ''
            
            new window.QRCode(qrcodeRef.current, {
                text: url,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: window.QRCode.CorrectLevel.H
            })
        }
    }, [url]);

    const project = projects.find(p => String(p.id) === String(id))
    
    if (!project) {
        return <div>Project not found</div>
    }

    // Extract transitiedomein items (the ones with category "Transitiedomein")
    const transitiedomeinen = project.transitiedomeinen
        .filter(td => td.category === "Transitiedomein");
 
    return(
        <div className="project-detail" style={{ position: 'relative' }}>
            {/* QR Code overlay */}
            <div 
                ref={qrcodeRef}
                id="qrcode"
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white',
                    padding: '15px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                }}
            />
            
            <h2>{project.ccode}</h2>
            
            <div className="project-info">
                <p>
                    <span className="label">Research Group:</span>
                    <span className="value">{project.researchGroup}</span>
                </p>
                

                {transitiedomeinen.length > 0 && (
                    <div className="transitiedomeinen">
                        <div className="pills">
                            {transitiedomeinen.map((td, index) => (
                                <span key={index} className={`pill ${td.label}`}>
                                    {td.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {project.cluster && project.cluster !== "Clusteroverschrijdend" && (
                    <div className="vakgebieden">
                        <div className="pills">
                            <span className="pill vakgebied">
                                {project.cluster}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {project.teaserAbstract && (
                <div className="teaser-abstract">
                    <div dangerouslySetInnerHTML={{__html: project.teaserAbstract}} />
                </div>
            )}

            <Button icon={"check"} text={"Read More"}/>
        </div>
    )
}
