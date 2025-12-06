import { useState, useEffect, useMemo, useRef, useContext } from 'preact/hooks'
import { ProjectsContext } from '../../contexts/ProjectsContext';
import MapCanvas from '../../components/MapCanvas'
import FilterShapeSVG from '../../assets/FilterShape.svg?raw'
import useReBoot from '../../hooks/useReBoot';



export default function Map() {
    
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [fps, setFps] = useState(0)
    const qrcodeRef = useRef(null)
    const frameCountRef = useRef(0)
    const lastTimeRef = useRef(performance.now())
    
    const url = `${window.location.protocol}//${window.location.host}/phone/contact`



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
    }, [url])

    // borderFilter
    useEffect(() => {
        const svgFilterIds = ['Filter_x5F_Gezond', 'Filter_x5F_Social', 'Filtere_x5F_Ecologisch', 'Filter_x5F_Digitaal', 'Filter_x5F_Leren']
        
        svgFilterIds.forEach(id => {
            const element = document.getElementById(id)
            if (element) {
                const paths = element.querySelectorAll('path')
                paths.forEach(path => {
                    path.style.stroke = '#fff'
                    path.style.transition = 'stroke 0.2s ease'
                })
            }
        })
        
        const activeFilterId = svgFilterIds[selectedIndex]
        const activeElement = document.getElementById(activeFilterId)
        if (activeElement) {
            const paths = activeElement.querySelectorAll('path')
            paths.forEach(path => {
                path.style.stroke = '#ff9500'
                path.style.strokeWidth = '3'
            })
        }
    }, [selectedIndex])

    return(
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* MapCanvas for pannable project map */}
            <MapCanvas filteredProjects={filteredProjects} />
            
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
            
            {/* QR Code overlay */}
            <div 
                ref={qrcodeRef}
                id="qrcode"
                style={{
                    position: 'absolute',
                    top: '75vh',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white',
                    width: '10vh',
                    padding: '10px',
                    borderRadius: '25px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                }}
            />
            
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