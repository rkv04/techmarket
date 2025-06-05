import './Layout.css'
import settingsLogo from '../assets/setings.png';
import userLogo from '../assets/cartlogo.png';
import cartLogo from '../assets/userlogo.png';
import VKLogo from '../assets/vklogo.png';
import instagrammLogo from '../assets/instagrammlogo.png';
import { useState } from 'react';
import MenuSettingsPopup from '../components/menuSettingPopup';

const Header = ({onSettingsClick}) => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
      <>
        <header className='Header'>
            <h1 className='Phone'>8-800-000-00-00</h1>
            <h1>ТехноМаркет</h1>
            <nav className='Navs'>
              <button className='navbutton' onClick={onSettingsClick}>
                <img className='logos' src={settingsLogo} alt="Настройки" />
              </button>
              <a href="">
                <img className='logos' src={userLogo} alt="Пользователь" />
              </a>
              <a href="">
                <img className='logos' src={cartLogo} alt="Корзина" />
              </a>
            </nav>
        </header>
        <div className='Header2'>
            <a href="">Кухня</a>
            <a href="">Дом</a>
            <a href="">Красота</a>
            <a href="">Здоровье</a>
            <a href="">Скидки</a>
            <a href="">Новинки</a>
        </div>
      </>
    );
}

const Footer = () => {
    return(
        <footer className='Footer'>
          <h1>О нас</h1>
            <nav className='Navs2'>
              <a href="">
                <img className='logos' src={VKLogo} alt="" />
              </a>
              <a href="">
                <img className='logos' src={instagrammLogo} alt="" />
              </a>
            </nav>
        </footer>
    );
}

const Layout = ({ children }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className='Layout'>
            <Header onSettingsClick={() => setShowPopup(true)} />
            <main className='Main'>{children}</main>
            <Footer />

            <MenuSettingsPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
        </div>
    );
};

export default Layout;