import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Addproduct } from "../components/AddProduct";
import './addproduct.css';

const AddProductPopup = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [name, setName] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [fullDescription, setFullDescription] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [isDiscount, setIsDiscount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [manufacturerId, setManufacturerId] = useState('');
    const [imageFile, setImage] = useState(null); 
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const result = await Addproduct(name, shortDescription, fullDescription, subcategoryId, price, oldPrice, isDiscount, quantity, manufacturerId);
        if (result.success){
            navigate('/admin');
        }
        else{
            switch(result.error){
                case 'not_image':
                    setError('Ошибка валидации! Не загружена фотография');
                    break;
                case 'not_all_fields_filled':
                    setError('Ошибка валидации! Не все обязательные поля заполнены');
                    break;
                case 'invalid_id':
                    setError('Ошибка валидации! Неверно указан ID');
                    break;
                case 'server':
                    setError('Ошибка сервера!');
                    break;
                case 'unknow':
                    setError('Неизвестная ошибка!');
                    break;
            }
        }
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    };

    const closeOnOverlayClick = (e) => {
        if (e.target.classList.contains('TestCart-overlay')) {
            toggleExpand();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <div onClick={toggleExpand}>
                <div id='notOpen'>
                    <button>Добавить товар</button>
                </div>
            </div>
            <div 
                className={`TestCart-overlay ${isExpanded ? 'active' : ''}`}
                onClick={closeOnOverlayClick}
            ></div>
            <div className={`TestCart-expanded ${isExpanded ? 'active' : ''}`}>
                <div id='isOpen'>
                    <h1>Добавление товара</h1>
                    {error && <div className="error-message">{ error }</div>}
                    <form onSubmit={handleSubmit}>
                    <div className="details">
                        <h3>Заполните поля</h3>
                        <label>Название товара</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required></input>
                        <label>Короткое описание</label>
                        <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required></input>
                        <label>Описание</label>
                        <input type="text" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} required></input>
                        <label>Категория</label>
                        <input type="text" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} required></input>
                        <label>Цена</label>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required></input>
                        <label>Старая цена(необязательное поле)</label>
                        <input type="text" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)}></input>
                        <label>Есть скидка(необязательное поле)</label>
                        <input type="text" value={isDiscount} onChange={(e) => setIsDiscount(e.target.value)}></input>
                        <label>Количество</label>
                        <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required></input>
                        <label>Производитель</label>
                        <input type="text" value={manufacturerId} onChange={(e) => setManufacturerId(e.target.value)} required></input>
                        <label>Загрузить изображение</label>
                        <input type="file" name="image" onChange={handleImageChange} />
                        {imageFile && <img src={imageFile} alt="Предварительный просмотр" style={{ width: '100px', height: '100px' }} />}
                    </div>
                    <button type="submit">Добавить товар</button>
                    </form>
                    <button onClick={toggleExpand}>Закрыть</button>
                </div>
            </div>
        </>
    );
};

export default AddProductPopup;