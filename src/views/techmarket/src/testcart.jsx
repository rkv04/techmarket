import { useState } from 'react';
import './testcart.css';
import chainikPNG from './assets/chainik.png';

const TestCart = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    };
    const closeOnOverlayClick = (e) => {
        if (e.target.classList.contains('TestCart-overlay')) {
            toggleExpand();
        }
    };

    return (
        <>
            <div className="TestCart" onClick={toggleExpand}>
                <div id='notOpen'>
                    <h1>Чайник</h1>
                    <img src={chainikPNG} alt="Чайник" width={180} />
                    <button>Подробнее</button>
                    <div className="hover-text">
                        Чайник прикольный и классный так то клевый!
                    </div>
                </div>
            </div>
            <div 
                className={`TestCart-overlay ${isExpanded ? 'active' : ''}`}
                onClick={closeOnOverlayClick}
            ></div>
            <div className={`TestCart-expanded ${isExpanded ? 'active' : ''}`}>
                <div id='isOpen'>
                    <h1>Чайник</h1>
                    <img src={chainikPNG} alt="Чайник" width={180} />
                    <div className="details">
                        <h3>Характеристики:</h3>
                        <ul>
                            <li>Мощность: 2200 Вт</li>
                            <li>Объем: 1.7 л</li>
                            <li>Материал: нержавеющая сталь</li>
                            <li>Автоотключение: есть</li>
                        </ul>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae eveniet nesciunt quos deserunt consectetur vero repellat voluptatem corporis dolorum quidem qui adipisci eaque iusto veritatis, hic illo. Tempore, maiores temporibus.</p>
                    </div>
                    <button onClick={toggleExpand}>Закрыть</button>
                </div>
            </div>
        </>
    );
};

export default TestCart;