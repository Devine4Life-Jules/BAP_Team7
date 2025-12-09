import Button from '../../../components/Button';
import useKeyboardNavigation from "../../../hooks/useNavigation";
import useReBoot from '../../../hooks/useReBoot';
import FilterShapeSVG from '../../../assets/FilterShape.svg?raw';



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
                `}
            </style>
            
            <p>Gebruik de draaiknop om te Filteren tussen de verschillende vakgebieden</p>
            
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
            
            <div style={{display: 'flex', gap: '20px'}}>
              <Button icon="back" text="back"></Button>
              <Button icon="check" text="Next"></Button>
            </div>
        </div>
    )
}

export default Screen3;