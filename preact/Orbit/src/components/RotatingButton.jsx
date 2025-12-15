import encoderImg from '../assets/encoder.png';

export default function RotatingButton({ width = '16vh' }) {
    return (
        <div style={{ width: width, height: width, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <img className="encoder-rotating" style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={encoderImg} alt="encoder image" />
        </div>
    );
}