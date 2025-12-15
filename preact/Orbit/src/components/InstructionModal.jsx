import Joystick from "./Joystick";
import RotatingButton from "./RotatingButton";

export default function InstructionModal({onClose}) {
    return(
        <div>
            <style>
                {`
                .instruction-modal {
                    border-radius: 50px;
                    border: 5px solid #FFF;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    background: rgba(0, 0, 50, 0.3);
                    backdrop-filter: blur(150px);
                }
                `}
            </style>
            <div 
                className="instruction-modal"
                style={{
                    width: '70vh',
                    height: '40vh',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: 0,
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                }}
            >
                <div
                    style={{
                        flex: 1,
                        maxWidth: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        boxSizing: 'border-box',
                        padding: '1.5vh',
                        minWidth: 0,
                        overflow: 'hidden'
                    }}
                >
                    <RotatingButton width="16vh" />
                    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.8vh', wordBreak: 'break-word' }}>
                        Gebruik de draaiknop om te Filteren tussen de verschillende vakgebieden
                    </p>
                </div>
                <div
                    style={{
                        flex: 1,
                        maxWidth: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        boxSizing: 'border-box',
                        padding: '1.5vh',
                        minWidth: 0,
                        overflow: 'hidden'
                    }}
                >
                    <Joystick width="16vh" />
                    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.8vh', wordBreak: 'break-word' }}>
                        Gebruik de joystick om te navigeren door ons universum van onderzoek en innovatie
                    </p>
                </div>
            </div>
        </div>
    );
}