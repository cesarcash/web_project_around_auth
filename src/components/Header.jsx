import '../blocks/header.css';
import logo from '../images/logo__white.png';

function Header(){

    return (
        <header className="header">
            <img src={logo} alt="Alrededor del mundo" className="header__logo" />
        </header>
    );

}

export default Header;