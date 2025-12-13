export default function ProjectIcon({ isActive }){
    const fillColor = isActive ? '#731ACA' : '#DBCBE5';
    const strokeColor = '#332E84';
    
    return (
        <svg width="55" height="54" viewBox="0 0 55 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.5 0.611328C42.3633 0.611328 54.3886 12.3888 54.3887 26.8887C54.3887 41.3886 42.3633 53.167 27.5 53.167C12.6367 53.167 0.611328 41.3886 0.611328 26.8887C0.611336 25.9494 0.662463 25.0219 0.760742 24.1084C6.42301 18.3323 9.26739 15.4322 10.6953 13.9756C11.4154 13.241 11.775 12.8731 11.9551 12.6895C12.045 12.5977 12.0908 12.5522 12.1133 12.5293C12.1244 12.5179 12.13 12.5116 12.1328 12.5088L12.1357 12.5059L12.1377 12.5029C12.1405 12.5001 12.1469 12.4949 12.1582 12.4834C12.1807 12.4604 12.2255 12.414 12.3154 12.3223C12.4955 12.1385 12.8562 11.7716 13.5762 11.0371C15.0045 9.58011 17.8478 6.67726 23.5127 0.898438C24.8134 0.709509 26.1448 0.611328 27.5 0.611328Z" fill={fillColor} stroke={strokeColor} stroke-width="1.22222"/>
<path d="M20.7778 20.7778L40.3334 20.7778" stroke={strokeColor} stroke-width="2.44444" stroke-linecap="round"/>
<path d="M17.1111 26.8889L36.6666 26.8889" stroke={strokeColor} stroke-width="2.44444" stroke-linecap="round"/>
<path d="M17.1111 39.1111L36.6666 39.1111" stroke={strokeColor} stroke-width="2.44444" stroke-linecap="round"/>
<path d="M17.1111 33H41.5555" stroke={strokeColor} stroke-width="2.44444" stroke-linecap="round"/>
<path d="M1.22217 24.4444H11.611C18.3612 24.4444 23.8333 18.9723 23.8333 12.2222V1.22217" stroke={strokeColor} stroke-width="2.44444"/>
</svg>

    )
}