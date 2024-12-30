import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, NavLink} from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import ProtectedRoute from './ProtectedRoute';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import auth from '../utils/auth';
import { getToken, setToken, removeToken } from '../utils/token';
import icon__success from '../images/icon__success.svg';
import icon__error from '../images/icon__error.svg';

// import { BASE_URL } from '../utils/constants';

function App() {

    const [isEditProfilePopupOpen, setEditProfile] = useState(false);
    const [isAddPlacePopupOpen, setAddPlace] = useState(false);
    const [isEditAvatarPopupOpen, setEditAvatar] = useState(false);
    const [isInfoTooltipOpen, setInfoTooltip] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [cards, setCards] = useState([]);
    const [userData, setUserData] = useState({email: '', password: ''});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    
    useEffect( ()=> {

        const fetchInitialCards = async () => {
            
            try {
        
                const cardsData = await api.getInitialCards();
                setCards(cardsData)
        
            }catch(error){
                console.error('Error:',error)
            }
    
        }
    
        const fetchUserInfo = async () => {
            
            try {
                const userInfo = await api.getInfoUser();
                setCurrentUser(userInfo);
            } catch(error) {
                console.error(`Error ${error}`);
            }
    
        }

        const fetchLoginUser = async () => {

            try {

                const user = await auth.getUserInfo();
                console.log("🚀 ~ fetchLoginUser ~ user:", user)
                setIsLoggedIn(true)
                setUserData({email: user.data.email})
                navigate('/');

            }catch(error) {
                console.error(`Error ${error}`);
            }

        }

        fetchUserInfo()
        fetchInitialCards()
        fetchLoginUser()

        // const jwt = getToken();
        // if(!jwt) return;

        // const getUserInfo = (jwt) => {
        
        //     return fetch(`${BASE_URL}/users/me`, {
        //         method: 'GET',
        //         headers: {
        //             "Accept": "application/json",
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${jwt}`
        //         },
        //     })
        //     .then((res) => {
        //         return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
        //     })
        
        // }

        // getUserInfo(jwt)
        // .then((res) => {
        //     console.log("🚀 ~ .then ~ res:", res)
        //     setIsLoggedIn(true)
        //     setUserData({email: res.data.email})
        //     navigate('/');
        // })
        // .catch(console.error)
        
    },[])
    

    function handleCardLike(card){

        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
        .then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        });

    }

    async function handleCardDelete(card){

        try {
            await api.deleteCard(card._id)
        }catch(error){
            console.error('Error: ',error)
        }

        setCards(cards.filter(itemCard => itemCard._id !== card._id ))

    }

    function handleCardClick(card){
        setSelectedCard(card)
    }
    
    function handleEditAvatarClick(){
        setEditAvatar(true)
    }
    
    function handleEditProfileClick(){
        setEditProfile(true)
    }

    function handleAddPlaceClick(){
        setAddPlace(true)
    }
    
    function closeAllPopups(){
        
        setEditAvatar(false)
        setEditProfile(false)
        setAddPlace(false)
        setSelectedCard(null)
        setInfoTooltip(false)

    }

    const handleUpdateUser = async (data) => {
        
        try{

            const user = await api.setUserInfo(data) 
            setCurrentUser(user)
            closeAllPopups();

        }catch(error){
            console.error(`Error: ${error}`);
        }

    }

    const handleUpdateAvatar = async (data) => {
        
        try{

            const avatar = await api.editImgUser(data)
            setCurrentUser(avatar);
            closeAllPopups();

        }catch(error){
            console.error(`Error: ${error}`);
        }

    }

    const handleAddPlaceSubmit = async (data) => {

        try{

            const newCard = await api.setNewCard(data)
            setCards([newCard, ...cards])
            closeAllPopups();

        }catch(error){
            console.error(`Error: ${error}`);
        }        

    }

    const handleRegistration = ({email, password}) => {
        
        auth.signup({email,password})
        .then(() => {
            console.log('Registro exitoso');

            setInfoTooltip(true)
            navigate('/signin')
        })
        .catch((err) => {
            setInfoTooltip(false)
            console.error(err)
        })

    }

    const handleLogin = ({email, password}) => {

        if(!email || !password) return false;

        auth.signin({email, password})
        .then((data) => {
            
            if(data.token){
                setToken(data.token);
                setUserData({email});
                setIsLoggedIn(true);
                navigate('/');
            }

        })
        .catch(err => {
            console.error(err);
        })

    }

    const htmlInfoTooltip = (response) => {
        const message = response
          ? '¡Correcto! Ya estás registrado.'
          : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.';
        const icon = response ? <img src={icon__success} alt="Exito" className="popup__image-status"  /> : <img src={icon__error} alt="Error" className="popup__image-status" />;
    
        return (
          <div className="popup__tooltip" >
            {icon}
            <p className="popup__text-status">{message}</p>
          </div>
        );
    };

    const signOut = () => {

        removeToken();
        setIsLoggedIn(false);
        navigate('/signin');

    }

    return (        

        <CurrentUserContext.Provider value={currentUser}>

            <Routes>

                <Route path="/signin" element={<Login handleLogin={handleLogin}/>} />

                <Route path="/signup" element={<Register handleRegistration={handleRegistration} />} />

                <Route path="/" element={
                    
                    currentUser ? (

                        <ProtectedRoute isLoggedIn={isLoggedIn}>

                            <div className="page">
                                <div className="page__container">
                                    <Header>
                                        <ul className='header__nav'>
                                            <li className='header__item'>{userData.email ? userData.email : ''}</li>
                                            <li className='header__item'>
                                                <button onClick={signOut} className="header__item-button header__item-button--secondary">
                                                    Cerrar sesión
                                                </button>
                                            </li>
                                        </ul>
                                    </Header>

                                    <Main
                                        onEditProfileClick={handleEditProfileClick} 
                                        onAddPlaceClick={handleAddPlaceClick} 
                                        onEditAvatarClick={handleEditAvatarClick} 
                                        onCardClick={handleCardClick} 
                                        cards={cards}
                                        onCardLike={handleCardLike}
                                        onCardDelete={handleCardDelete}
                                    />
                                    <Footer />
                                </div>
                            </div>

                            {isEditAvatarPopupOpen && (<EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}></EditAvatarPopup>)}

                            {isEditProfilePopupOpen && (<EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}></EditProfilePopup>)}

                            {isAddPlacePopupOpen && (<AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlaceSubmit={handleAddPlaceSubmit}></AddPlacePopup>)}

                            {isInfoTooltipOpen && (
                                <InfoTooltip name="tooltip" isOpen={isInfoTooltipOpen} onClose={closeAllPopups}>
                                    {htmlInfoTooltip(isInfoTooltipOpen)}
                                </InfoTooltip>
                            )}

                            {selectedCard && (<ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>)}

                        </ProtectedRoute>

                    ) : ''

                } />                

            </Routes>

        </CurrentUserContext.Provider>

    );

}

export default App;