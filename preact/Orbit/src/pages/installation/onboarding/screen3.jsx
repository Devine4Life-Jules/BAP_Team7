import Button from '../../../components/Button';
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';
import FilterShapeSVG from '../../../assets/FilterShape.svg?raw';
import encoderImg from '../../../assets/encoder.png';
import OnboardingProgressBar from '../../../components/OnboardingProgressBar';



function Screen3 () {
    useKeyboardNavigation({back: '/screen2', next: '/screen4'});
    useReBoot({rebootTime: 100000});
    
    return(
        <div className="onboarding-screen">
            <style>
                {`
                    /* CSS Animation for cycling through filter active states */
                    #gezond_x5F_Active {
                        animation: filterCycle 2.5s infinite;
                        animation-delay: 0s;
                    }
                    #sociaal_x5F_Active {
                        animation: filterCycle 2.5s infinite;
                        animation-delay: 0.5s;
                    }
                    #ecologisch_x5F_Active {
                        animation: filterCycle 2.5s infinite;
                        animation-delay: 1s;
                    }
                    #digitaal_x5F_Active {
                        animation: filterCycle 2.5s infinite;
                        animation-delay: 1.5s;
                    }
                    #leren_x5F_Active {
                        animation: filterCycle 2.5s infinite;
                        animation-delay: 2s;
                    }
                    
                    @keyframes filterCycle {
                        0%, 20% {
                            opacity: 1;
                        }
                        20.01%, 100% {
                            opacity: 0;
                        }
                    }
                    
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
            
            
            <div 
                style={{
                    width: '100%',
                    height: '60vh',
                    maxWidth: '90vh',
                    maxHeight: '80vh',
                    top: '0',
                    position: 'absolute'
                }}
                dangerouslySetInnerHTML={{__html: FilterShapeSVG}}
            />
            <div style={{width: '45vh'}}>
                <img className="encoder-rotating" style={{width: '100%'}} src={encoderImg} alt="" />
            </div>
            <p className='onboardingInstruction'>Gebruik de draaiknop om te Filteren tussen de verschillende vakgebieden</p>
 
            
            <div style={{display: 'flex', gap: '20px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
            <OnboardingProgressBar step={2} />
        </div>
    )
}

export default Screen3;