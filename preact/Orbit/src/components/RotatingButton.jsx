import encoderImg from '../assets/encoder.png';



export default function RotatingButton(){
    return(
        <div style={{width: '45vh'}}>
                        <style>
                {`

                    
                    /* Encoder rotation animation - 72 degrees per step (360/5) */
                    .encoder-rotating {
                        animation: encoderRotate 2.5s infinite step-end;
                    }
                    
                    @keyframes encoderRotate {
                        0%, 20% {
                            transform: rotate(0deg);
                        }
                        20%, 40% {
                            transform: rotate(45deg);
                        }
                        40%, 60% {
                            transform: rotate(90deg);
                        }
                        60%, 80% {
                            transform: rotate(135deg);
                        }
                        80%, 100% {
                            transform: rotate(180deg);
                        }
                    }
                `}
            </style>
            <img className="encoder-rotating" style={{width: '40%'}} src={encoderImg} alt="encoder image" />
        </div>
    )
} 