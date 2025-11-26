import checkIcon from '../assets/check_Icon.png'
import backIcon from '../assets/back_Icon.png'

export default function Button ({icon, text}) {

    const chooseIcon = icon === 'back' ? backIcon : checkIcon;

    return (
        <div className="button">
            <div className="button-icon"><img src={chooseIcon} alt="button Icon" /></div>
            <span className="button-text">{text}</span>
        </div>
    )
}