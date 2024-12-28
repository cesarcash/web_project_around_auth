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
import * as auth from '../utils/auth';

function App() {

    const [isEditProfilePopupOpen, setEditProfile] = useState(false);
    const [isAddPlacePopupOpen, setAddPlace] = useState(false);
    const [isEditAvatarPopupOpen, setEditAvatar] = useState(false);
    const [isInfoTooltipOpen, setInfoTooltip] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [cards, setCards] = useState([]);
    const [userData, setUserData] = useState({email: '', password: ''});
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const navigate = useNavigate();

    useEffect( ()=> {

        const fetchInitialCards = async () => {
            
            try {
        
                const cardsData = await api.getInitialCards();
                setCards(cardsData)
        
            }catch(error){
                alert('Error:',error)
            }
    
        }
    
        const fetchUserInfo = async () => {
            
            try {
                const userInfo = await api.getInfoUser();
                setCurrentUser(userInfo);
            } catch(error) {
                alert(`Error ${error}`);
            }
    
        }

        fetchUserInfo()
        fetchInitialCards()
        
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
            alert('Error: ',error)
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
            alert(`Error: ${error}`);
        }

    }

    const handleUpdateAvatar = async (data) => {
        
        try{

            const avatar = await api.editImgUser(data)
            setCurrentUser(avatar);
            closeAllPopups();

        }catch(error){
            alert(`Error: ${error}`);
        }

    }

    const handleAddPlaceSubmit = async (data) => {

        try{

            const newCard = await api.setNewCard(data)
            setCards([newCard, ...cards])
            closeAllPopups();

        }catch(error){
            alert(`Error: ${error}`);
        }        

    }

    const handleRegistration = ({email, passowrd}) => {
        auth.signup(email,passowrd)
        .then(() => {
            navigate('/signin')
        })
        .catch(err => {
            console.error(err)
        })
    }

    const handleLogin = ({email, password}) => {

        if(!email || !password) return false;

        auth.signin(email, password)
        .then((data) => {
            
            if(data.jwt){
                setUserData(data.user);
                setIsLoggedIn(true);
                navigate('/');
            }

        })
        .catch(err => {
            console.error(err);
        })

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
                                                <NavLink to="/signin" className="header__item-link header__item-link--secondary">
                                                    Cerrar sesión
                                                </NavLink>
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

                            {isInfoTooltipOpen && (<InfoTooltip name="tooltip" isOpen={isInfoTooltipOpen} onClose={closeAllPopups}><p>Contenido</p></InfoTooltip>) }

                            {selectedCard && (<ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>)}

                        </ProtectedRoute>

                    ) : ''

                } />                

            </Routes>

        </CurrentUserContext.Provider>

    );

}

export default App;