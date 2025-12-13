

import Button from '../../../components/Button';
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';
import OnboardingProgressBar from '../../../components/OnboardingProgressBar';
import Planet from '../../../components/Planet';


function Screen4 () {
    useKeyboardNavigation({back: '/screen3', next: '/map'});
    useReBoot({rebootTime: 100000});
    return(
        <div className="onboarding-screen">
            <style>
                {`
                .planets-row {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .planet-wrapper {
                    position: relative;
                    width: 100px;
                    height: 100px;
                }

                .planet-wrapper::before {
                    content: '';
                    position: absolute;
                    inset: -10px;
                    border: 3px solid white;
                    border-radius: 50%;
                    opacity: 0;
                }

                .planet-wrapper:nth-child(1)::before {
                    animation: highlightLeft 4s step-end infinite;
                }

                .planet-wrapper:nth-child(2)::before {
                    animation: highlightCenter 4s step-end infinite;
                }

                .planet-wrapper:nth-child(3)::before {
                    animation: highlightRight 4s step-end infinite;
                }

                @keyframes highlightLeft {
                    0%, 23% {
                        opacity: 0;
                    }
                    24%, 30% {
                        opacity: 1;
                    }
                    31%, 100% {
                        opacity: 0;
                    }
                }

                @keyframes highlightCenter {
                    0%, 5% {
                        opacity: 1;
                    }
                    6%, 44% {
                        opacity: 0;
                    }
                    45%, 55% {
                        opacity: 1;
                    }
                    56%, 94% {
                        opacity: 0;
                    }
                    95%, 100% {
                        opacity: 1;
                    }
                }

                @keyframes highlightRight {
                    0%, 73% {
                        opacity: 0;
                    }
                    74%, 80% {
                        opacity: 1;
                    }
                    81%, 100% {
                        opacity: 0;
                    }
                }

                .joystick-container {
                    position: relative;
                    width: 8rem;
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
                    0% {
                        transform: translate(0, 0);
                    }
                    25% {
                        transform: translate(-50%, 0);
                    }
                    50% {
                        transform: translate(0, 0);
                    }
                    75% {
                        transform: translate(50%, 0);
                    }
                    100% {
                        transform: translate(0, 0);
                    }
                }

                `}
                      
            </style>
            <div className="planets-row">
                <div className="planet-wrapper"><Planet title="Exergame"/></div>
                <div className="planet-wrapper"><Planet title="SAIAR"/></div>
                <div className="planet-wrapper"><Planet title="Brugge Beweegt"/></div>
            </div>
            <div className='joystick-container'>
                <div className='joystick-blur'></div>
                <div className='joystick-outer'>
                    <div className='joystick-inner'>

                    </div>
                </div>
            </div>
            <p className='onboardingInstruction'>Gebruik de joystick om te navigeren door ons universum van onderzoek en innovatie</p>
            <div style={{display: 'flex', gap: '20px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
            <OnboardingProgressBar step={3} />
        </div>
    )
}

export default Screen4;