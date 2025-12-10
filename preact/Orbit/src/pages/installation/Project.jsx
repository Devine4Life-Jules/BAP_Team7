import { useEffect, useRef, useState, useContext } from 'preact/hooks'
import Button from '../../components/Button';
import useKeyboardNavigation from '../../hooks/useNavigation';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import useReBoot from '../../hooks/useReBoot';
import bottomCloudsMain from '../../assets/bottomCloudsMain.png'
import QRCode from 'qrcode'


export default function Project({id}){
    useReBoot({rebootTime: 100000});
    const { projects, loading } = useContext(ProjectsContext);
    
    if (loading) return <div class="loader"></div>
    const qrcodeRef = useRef(null)
    
    const url = `${window.location.protocol}//${window.location.host}/phone/project/${id}`
    
    useKeyboardNavigation({back: '/map', next: null});
    
    useEffect(() => {
        if (qrcodeRef.current) {
            qrcodeRef.current.innerHTML = ''
            
            const containerSize = window.innerHeight * 0.1
            
            QRCode.toCanvas(url, {
                width: containerSize,
                margin: 0,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'H'
            }).then(canvas => {
                canvas.style.display = 'block'
                canvas.style.width = '100%'
                canvas.style.height = '100%'
                qrcodeRef.current.appendChild(canvas)
            }).catch(err => {
                console.error('QR Code generation error:', err)
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
    
    // Extract keywords (thema category)
    const keywords = project.transitiedomeinen
        .filter(td => td.category === "Thema")
        .slice(0, 3); // Get first 3 keywords
 
    return(
        <div className="project-detail" style={{ position: 'relative' }}>
            <div 
                ref={qrcodeRef}
                id="qrcode"
                style={{
                    position: 'absolute',
                    top: '75vh',
                    width: '10vh',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white',
                    padding: '8px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                }}
            />

            


            <div className="project-info">
               


                 <h2 className="installation-ProjectTitle">{project.ccode}</h2>
                             {keywords.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '20px'  }}>
                    {keywords.map((keyword, index) => (
                        <span key={index} className="pill">
                            {keyword.label}
                        </span>
                    ))}
                </div>
                
            )}
            
                <p>
                    
                    <span className="value">{project.researchGroup}</span>
                </p>
                
                

      

                {project.cluster && project.cluster !== "Clusteroverschrijdend" && (
                    <div className="vakgebieden">
                        <div className="cluster">
                            <span className="vakgebied" >
                                {project.cluster.replace(/\s*\([^)]*\)\s*/g, '').trim().replace(/ /g, '\n')}
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

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button icon={"back"} text={"terug"} />
            </div>

            {transitiedomeinen.length > 0 && (
                <div className="transitiedomeinen">
                    <div className="domain">
                        {transitiedomeinen.map((td, index) => (
                            <span key={index} id={`domain${index}`} className={`domain ${td.label}`}>
                                {td.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <img 
                src={bottomCloudsMain}                    
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    height: 'auto',
                    zIndex: 1,
                    pointerEvents: 'none'
                }} 
                alt="" 
            />
        </div>
    )
}
