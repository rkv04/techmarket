import { useState } from 'react';
import './testcart.css';

const TestCart = ({ product }) => {
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
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    };
    return (
        <>
            <div className="TestCart" onClick={toggleExpand}>
                <div id='notOpen'>
                    <h1>{product.name}</h1>
                    {product.images?.length > 0 && (
                        <img 
                            src={`http://b93332pg.beget.tech/${product.images[0].thumbnail_path}`} 
                            alt={product.name} 
                            width={180} 
                        />
                    )}
                    <div className="price-container">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                            <span className="old-price">{formatPrice(product.oldPrice)}</span>
                        )}
                    </div>
                    <button>Подробнее</button>
                    <div className="hover-text">
                        {product.shortDescription}
                    </div>
                </div>
            </div>
            
            <div 
                className={`TestCart-overlay ${isExpanded ? 'active' : ''}`}
                onClick={closeOnOverlayClick}
            ></div>
            
            <div className={`TestCart-expanded ${isExpanded ? 'active' : ''}`}>
                <div id='isOpen'>
                    <h1>{product.name}</h1>
                    {product.images?.length > 0 && (
                        <img 
                            src={`http://b93332pg.beget.tech/${product.images[0].image_path}`} 
                            alt={product.name} 
                            width={350} 
                        />
                    )}
                    <div className="details">
                        <h3>Характеристики:</h3>
                        <ul>
                            <li>Категория: {product.category.name}</li>
                            <li>Производитель: {product.manufacturer.name}</li>
                            <li>Страна: {product.country.name}</li>
                            <li>В наличии: {product.quantity} шт.</li>
                        </ul>
                        <p>{product.fullDescription}</p>
                    </div>
                    <button onClick={toggleExpand}>Закрыть</button>
                </div>
            </div>
        </>
    );
};

export default TestCart;