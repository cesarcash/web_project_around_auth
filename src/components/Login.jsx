import { NavLink } from 'react-router-dom';
import '../blocks/login.css'
import Header from './Header';
import Footer from './Footer';

function Login() {
    return(
        <>
            <div className="page">
                <div className="page__container">
                    <Header>
                        <ul className='header__nav'>
                            <li className='header__item'>
                                <NavLink to="/signup" className="header__item_link">
                                    Registrate
                                </NavLink>
                            </li>
                        </ul>
                    </Header>
                    <main className="login">
                        <section className="login__container">
                            <h2 className="login__title">Inicia sesión</h2>
                            <form id="" className="login__form">
                                <input type="text" className="login__input" name="email" id="name-email" required placeholder="Correo electrónico" minLength="2" maxLength="40" />
                                <input type="password" className="login__input" name="password" id="name-password" required placeholder="Contraseña" minLength="2" maxLength="40" />
                                <button type="submit" className="login__button" aria-label="Inicia sesión">Inicia sesión</button>
                            </form>
                            <p className="login__paragraph">¿Aún no eres miembro? Regístrate <NavLink to="/signup" className="login__paragraph_link">aquí</NavLink></p>
                        </section>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default Login;