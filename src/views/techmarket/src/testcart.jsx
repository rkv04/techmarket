import './testcart.css';
import chainikPNG from './assets/chainik.png';

const TestCart = () => {
    return(
        <div className="TestCart">
            <h1>Товар</h1>
            <img src={chainikPNG} alt="" width={200}/>
            <button>Добавить</button>
        </div>
    );
}

export default TestCart;