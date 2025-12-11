import { useState, useEffect, useMemo, useRef, useContext, useCallback } from 'preact/hooks'
import { ProjectsContext } from '../../contexts/ProjectsContext';
import MapCanvas from '../../components/MapCanvas'
import FilterShapeSVG from '../../assets/FilterShape.svg?raw'
import useReBoot from '../../hooks/useReBoot';
import bottomCloudsMain from '../../assets/bottomCloudsMain.png'
import QRCode from 'qrcode'



export default function Map() {
    
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [fps, setFps] = useState(0)
    const [selectedProject, setSelectedProject] = useState(null)
    const [planetPosition, setPlanetPosition] = useState(null)
    const qrcodeRef = useRef(null)
    const frameCountRef = useRef(0)
    const lastTimeRef = useRef(performance.now())
    
    const url = `${window.location.protocol}//${window.location.host}/phone/contact`

    useReBoot({rebootTime: 100000});

    const { projects, loading } = useContext(ProjectsContext);


    
     if (loading) return <div class="loaderWrapper"><div class="loader"></div></div>

    

    // const TRANSITION_DOMAINS = ['gezond', 'digitaal', 'ecologisch', 'leren', 'sociaal']
    
    const filterShapes = [
        { id:"domain1", title: "gezond", bgColor: "red" },
        { id:"domain5", title: "sociaal", bgColor: "orange" },
        { id:"domain3", title: "ecologisch", bgColor: "green" },
        { id:"domain2", title: "digitaal", bgColor: "blue" },
        { id:"domain4", title: "leren", bgColor: "purple" },
    ]
    
    const PLANET_COUNT = filterShapes.length

    const selectedDomain = filterShapes[selectedIndex].title
    
    // Filter 
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            return project.transitiedomeinen.some(td => 
                td.label.toLowerCase() === selectedDomain.toLowerCase()
            )
        })
    }, [selectedDomain])
    
    // FPS counter
    useEffect(() => {
        let animationFrameId
        
        const calculateFPS = () => {
            const now = performance.now()
            frameCountRef.current++
            
            const elapsed = now - lastTimeRef.current
            
            // Update FPS every second
            if (elapsed >= 1000) {
                const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)
                setFps(currentFps)
                frameCountRef.current = 0
                lastTimeRef.current = now
            }
            
            animationFrameId = requestAnimationFrame(calculateFPS)
        }
        
        animationFrameId = requestAnimationFrame(calculateFPS)
        
        return () => cancelAnimationFrame(animationFrameId)
    }, [])
    
    // Handle filter planet selection with arrow keys
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'q') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + PLANET_COUNT) % PLANET_COUNT)
            } else if (event.key === 'e') {
                event.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % PLANET_COUNT)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [PLANET_COUNT])

    // Generate QR code when component mounts or URL changes
    useEffect(() => {
        if (qrcodeRef.current) {
            qrcodeRef.current.innerHTML = ''
            
            // Calculate viewport height based size (10vh ≈ 96px on 960px height screen)
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
    }, [url])

    // Toggle filter active layers opacity
    useEffect(() => {
        // Order must match filterShapes array: gezond, sociaal, ecologisch, digitaal, leren
        // SVG uses _x5F_ as encoded underscore
        const filterActiveIds = ['gezond_x5F_Active', 'sociaal_x5F_Active', 'ecologisch_x5F_Active', 'digitaal_x5F_Active', 'leren_x5F_Active']
        
        // Set all _Active layers to opacity 0
        filterActiveIds.forEach(id => {
            const activeLayer = document.getElementById(id)
            if (activeLayer) {
                activeLayer.style.opacity = '0'
                activeLayer.style.transition = 'opacity 0.3s ease'
            }
        })
        
        // Set the selected filter's _Active layer to opacity 100%
        const selectedActiveId = filterActiveIds[selectedIndex]
        const selectedActiveLayer = document.getElementById(selectedActiveId)
        if (selectedActiveLayer) {
            selectedActiveLayer.style.opacity = '1'
        }
    }, [selectedIndex])

    // Memoize the callback to prevent infinite render loops
    const handleSelectionChange = useCallback((projectId, position) => {
        const project = projects.find(p => p.id === projectId)
        setSelectedProject(project)
        setPlanetPosition(position)
    }, [projects])

    // Hide modal after 3 seconds of the same planet being selected
    useEffect(() => {
        if (selectedProject) {
            const timer = setTimeout(() => {
                setSelectedProject(null)
                setPlanetPosition(null)
            }, 3000) // 3 seconds

            return () => clearTimeout(timer)
        }
    }, [selectedProject])

    return(
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* MapCanvas for pannable project map */}
            <MapCanvas 
                filteredProjects={filteredProjects} 
                onSelectionChange={handleSelectionChange}
                bottomCloudsImg={bottomCloudsMain}
                selectedProject={selectedProject}
            />
            
            {/* FPS Counter */}
            <div
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#00ff00',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    zIndex: 2000,
                    pointerEvents: 'none'
                }}
            >
                FPS: {fps}
            </div>
            
            {/* QR Code overlay with message */}
            <div 
                style={{
                    position: 'absolute',
                    top: '70vh',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 1000
                }}
            >
                <div 
                    ref={qrcodeRef}
                    id="qrcode"
                    style={{
                        background: 'white',
                        width: '10vh',
                        borderRadius: '25px',
                        padding: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <p 
                    style={{
                        color: '#0A0C3C',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: "-.2rem"
                        
                    }}
                >
                    <span style={{ display:'block'}}>zet koers naar</span> <span style={{fontSize: '1.5rem'}}>samenwerking</span>
                </p>
            </div>
            
            {/* SVG Filter overlay - embed as inline SVG */}
            <div 
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    maxWidth: '90vh',
                    maxHeight: '90vh',
                    pointerEvents: 'none'
                }}
                dangerouslySetInnerHTML={{__html: FilterShapeSVG}}
            />

        </div>
    )
}