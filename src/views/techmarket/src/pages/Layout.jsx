import './Layout.css';
import settingsLogo from '../assets/setings.png';
import userLogo from '../assets/cartlogo.png';
import cartLogo from '../assets/userlogo.png';
import VKLogo from '../assets/vklogo.png';
import instagrammLogo from '../assets/instagrammlogo.png';
import { useState } from 'react';
import MenuSettingsPopup from '../components/menuSettingPopup';
import { useUserMenu } from '../components/useUserMenu';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = ({ onSettingsClick, menuItems }) => {
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
                {menuItems
                    .filter(item => !item.isHidden)
                    .map(item => (
                        <Link 
                            key={item.id} 
                            to={`/products${item.url}`}
                            className="nav-link"
                        >
                            {item.category?.name || 'Без названия'}
                        </Link>
                    ))}
            </div>
        </>
    );
};

const Footer = () => {
    return (
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
};

const Layout = () => {
    const [showPopup, setShowPopup] = useState(false);
    const { menuItems, saveMenuChanges } = useUserMenu();

    const handleSave = async () => {
        const success = await saveMenuChanges();
        if (success) {
            setShowPopup(false);
        }
    };

    return (
        <div className='Layout'>
            <Header
                onSettingsClick={() => setShowPopup(true)}
                menuItems={menuItems}
            />
            <main className='Main'>
                <Outlet />
            </main>
            <Footer />
            <MenuSettingsPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                onSave={handleSave}
            />
        </div>
    );
};

export default Layout;