import { useEffect, useRef, useState, useContext } from 'preact/hooks'
import Button from '../../components/Button';
import useKeyboardNavigation from '../../hooks/useNavigation';
import { ProjectsContext } from '../../contexts/ProjectsContext';
import useReBoot from '../../hooks/useReBoot';
import bottomCloudsMain from '../../assets/bottomCloudsMain.png'
import useGetDomains from '../../hooks/useGetDomains';
import QRCode from 'qrcode'
import useGetProjects from '../../hooks/useGetProjects';



export default function Project({id}){
    const projects = useGetProjects();
    const project = projects.find(p => String(p.id) === String(id))
    const transitiedomeinen = useGetDomains(project);

    useKeyboardNavigation({back: '/map', next: null});
    useReBoot({rebootTime: 100000});

    const qrcodeRef = useRef(null)
    const url = `${window.location.protocol}//${window.location.host}/phone/project/${id}?source=qr`
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

    
    if (!project) {
        return <div>Project not found</div>
    }


    

 
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
