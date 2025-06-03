import './Layout.css'
import searchLogo from '../assets/searchlogo.png';
import userLogo from '../assets/cartlogo.png';
import cartLogo from '../assets/userlogo.png';
import VKLogo from '../assets/vklogo.png';
import instagrammLogo from '../assets/instagrammlogo.png';

const Header = () => {
    return (
      <>
        <header className='Header'>
            <h1 className='Phone'>8-800-000-00-00</h1>
            <h1>ТехноМаркет</h1>
            <nav className='Navs'>
              <a href="">
                <img className='logos' src={searchLogo} alt="" />
              </a>
              <a href="">
                <img className='logos' src={userLogo} alt="" />
              </a>
              <a href="">
                <img className='logos' src={cartLogo} alt="" />
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
  return (
    <div className='Layout'>
      <Header />
      <main className='Main'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;