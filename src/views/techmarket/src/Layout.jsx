import './Layout.css'
import userlogo from './assets/userlogo.png'

const Header = () => {
    return (
      <>
        <header className='Header'>
            <h1>ТехноМаркет</h1>
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

export default Layout