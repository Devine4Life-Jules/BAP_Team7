export default function ContactIcon({ isActive }){
    const fillColor = isActive ? '#DBCBE5' : 'none';
    const strokeColor = '#DBCBE5';
    const strokeWidth = isActive ? '0' : '2';
    
    return(
        <svg width="32" height="38" viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.7414 52.9577H2.19317C0.91679 52.9577 -0.12552 51.9214 0.0121407 50.6524C0.852773 42.9036 5.99603 30.8726 21.9673 30.8726C37.9385 30.8726 43.0817 42.9036 43.9224 50.6524C44.06 51.9214 43.0177 52.9577 41.7414 52.9577Z" fill={fillColor} stroke={strokeColor} stroke-width={strokeWidth}/>
        <circle cx="22.0504" cy="13.5473" r="13.5473" fill={fillColor} stroke={strokeColor} stroke-width={strokeWidth}/>
</svg>

    )
}