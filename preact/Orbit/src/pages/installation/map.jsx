import { useState, useEffect, useMemo, useRef, useContext, useCallback } from 'preact/hooks'
import { ProjectsContext } from '../../contexts/ProjectsContext';
import MapCanvas from '../../components/MapCanvas'
import FilterShapeSVG from '../../assets/FilterShape.svg?raw'
import useReBoot from '../../hooks/useReBoot';
import bottomCloudsMain from '../../assets/bottomCloudsMain.png'
import QRCode from 'qrcode'
import InstructionModal from '../../components/InstructionModal';

export default function Map() {
    const [fps, setFps] = useState(0)
    const [selectedProject, setSelectedProject] = useState(null)
    const [showInstructionModal, setShowInstructionModal] = useState(false)
    const qrcodeRef = useRef(null)
    const frameCountRef = useRef(0)
    const lastTimeRef = useRef(performance.now())
    
    const url = `${window.location.protocol}//${window.location.host}/phone/contact`

    useReBoot({rebootTime: 100000});

    const { projects, loading, selectedFilterIndex, setSelectedFilterIndex } = useContext(ProjectsContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('fromOnboarding') === 'true') {
            setShowInstructionModal(true);
            window.history.replaceState({}, '', '/map');
        }
    }, []);

    if (loading) return <div class="loaderWrapper"><div class="loader"></div></div>

    const filterShapes = [
        { id:"domain1", title: "gezond" },
        { id:"domain5", title: "sociaal" },
        { id:"domain3", title: "ecologisch" },
        { id:"domain2", title: "digitaal" },
        { id:"domain4", title: "leren" },
    ]

    const filteredProjects = useMemo(() => {
        const selectedDomain = filterShapes[selectedFilterIndex].title
        return projects.filter(project => 
            project.transitiedomeinen.some(td => 
                td.label.toLowerCase() === selectedDomain.toLowerCase()
            )
        )
    }, [projects, selectedFilterIndex])
    useEffect(() => {
        let animationFrameId
        const calculateFPS = () => {
            const now = performance.now()
            frameCountRef.current++
            const elapsed = now - lastTimeRef.current
            
            if (elapsed >= 1000) {
                setFps(Math.round((frameCountRef.current * 1000) / elapsed))
                frameCountRef.current = 0
                lastTimeRef.current = now
            }
            animationFrameId = requestAnimationFrame(calculateFPS)
        }
        animationFrameId = requestAnimationFrame(calculateFPS)
        return () => cancelAnimationFrame(animationFrameId)
    }, [])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (showInstructionModal) {
                const closingKeys = ['Spacebar', 'q', 'e', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace']
                const closingCodes = ['Space']
                if (closingKeys.includes(event.key) || closingCodes.includes(event.code)) {
                    event.preventDefault()
                    setShowInstructionModal(false)
                }
                return
            }
            if (event.key === 'q') {
                event.preventDefault()
                setSelectedFilterIndex((prev) => (prev - 1 + 5) % 5)
            } else if (event.key === 'e') {
                event.preventDefault()
                setSelectedFilterIndex((prev) => (prev + 1) % 5)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [showInstructionModal])

    useEffect(() => {
        if (qrcodeRef.current) {
            qrcodeRef.current.innerHTML = ''
            const containerSize = window.innerHeight * 0.1
            QRCode.toCanvas(url, {
                width: containerSize,
                margin: 0,
                color: { dark: '#000000', light: '#ffffff' },
                errorCorrectionLevel: 'H'
            }).then(canvas => {
                canvas.style.display = 'block'
                canvas.style.width = '100%'
                canvas.style.height = '100%'
                qrcodeRef.current.appendChild(canvas)
            })
        }
    }, [url])

    const handleSelectionChange = useCallback((projectId) => {
        setSelectedProject(projects.find(p => p.id === projectId))
    }, [projects])



    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <MapCanvas 
                filteredProjects={filteredProjects} 
                onSelectionChange={showInstructionModal ? undefined : handleSelectionChange}
                bottomCloudsImg={bottomCloudsMain}
                selectedProject={selectedProject}
                instructionModalOpen={showInstructionModal}
            />
            
            {showInstructionModal && (
                <>
                    <div style={{ zIndex: "9998" }} onClick={() => setShowInstructionModal(false)} />
                    <div style={{ 
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '90vh', height: '90vh', maxWidth: '90vw', maxHeight: '90vw', pointerEvents: 'auto'
                    }}>
                        <InstructionModal onClose={() => setShowInstructionModal(false)} />
                    </div>
                </>
            )}
            
            <div style={{
                position: 'absolute', top: '10px', right: '10px', background: 'rgba(0, 0, 0, 0.7)',
                color: '#00ff00', padding: '8px 12px', borderRadius: '4px', fontFamily: 'monospace',
                fontSize: '16px', fontWeight: 'bold', zIndex: 2000, pointerEvents: 'none'
            }}>
                FPS: {fps}
            </div>
            
            <div style={{
                position: 'absolute', top: '70vh', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 1000
            }}>
                <div ref={qrcodeRef} className="qrcode-container" />
                <p style={{
                    color: '#white', fontSize: '1rem', fontWeight: 'bold', 
                    textAlign: 'center', marginTop: "-.2rem"
                }}>
                    <span style={{ display:'block'}}>Lanceer een</span> 
                    <span style={{fontSize: '1.5rem'}}>samenwerking</span>
                </p>
            </div>
            
            <div 
                style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '100%', height: '100%', maxWidth: '90vh', maxHeight: '90vh', pointerEvents: 'none'
                }} 
                className={`filter-svg filter-index-${selectedFilterIndex}`}
                dangerouslySetInnerHTML={{__html: FilterShapeSVG}} 
            />
        </div>
    )
}