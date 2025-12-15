import Joystick from "./Joystick";
import RotatingButton from "./RotatingButton";

export default function InstructionModal({onClose}) {
    return(
        <div>
            <style>
                {
                `
                .instruction-modal {
                border-radius: 50px;
                border: 5px solid #FFF;
                display: flex;
                flex-direction: row;
                justify-content: space-around;

                background: rgba(0, 0, 50, 0.3);

                backdrop-filter: blur(150px);
                
                }
                `}
            </style>
            <div className="instruction-modal">
                <div>
                    <div style={{width:"30%"}}>
                        <RotatingButton></RotatingButton>
                    </div>
                    <p>Gebruik de draaiknop om te Filteren tussen de verschillende vakgebieden</p>
                </div>
                <div>
                    <Joystick></Joystick>
                    <p>Gebruik de joystick om te navigeren door ons universum van onderzoek en innovatie</p>
                </div>
            </div>
        </div>
    )
}