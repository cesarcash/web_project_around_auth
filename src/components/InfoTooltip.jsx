import '../blocks/popup.css';
import icon__close from '../images/icon__close.svg';

const InfoTooltip = (props) => {

    const isOpen = props.isOpen ? 'popup_opened' : '';

    return (
        <div className={`popup popup_type_${props.name} ${isOpen}`}>
            <div className="popup__form">
                <button className="button button_action_close" aria-label="Cerrar ventana" onClick={props.onClose}>
                    <img src={icon__close} className="button__close-image" alt="Cerrar ventana" />
                </button>
                <div className="popup__content" >
                    {props.children}
                </div>
            </div>
        </div>
    );

}

export default InfoTooltip;