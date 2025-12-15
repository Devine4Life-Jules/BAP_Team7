export default function Joystick({ width = '16vh' }) {
    return (
        <div style={{ width: width, height: width, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <style>
            {`
                .joystick-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    aspect-ratio: 1/1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .joystick-blur {
                    position: absolute;
                    inset: 0;
                    border: 2px solid white;
                    border-radius: 50%;
                    filter: blur(5px);
                }
                .joystick-outer {
                    position: relative;
                    width: 50%;
                    aspect-ratio: 1/1;
                    border: 2px solid white;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .joystick-inner {
                    width: 80%;
                    aspect-ratio: 1/1;
                    background-color: white;
                    border-radius: 50%;
                    animation: joystickMove 4s ease-in-out infinite;
                }
                @keyframes joystickMove {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(-50%, 0); }
                    50% { transform: translate(0, 0); }
                    75% { transform: translate(50%, 0); }
                    100% { transform: translate(0, 0); }
                }
            `}
            </style>
            <div className='joystick-container'>
                <div className='joystick-outer'>
                    <div className='joystick-inner'></div>
                </div>
            </div>
        </div>
    );
}