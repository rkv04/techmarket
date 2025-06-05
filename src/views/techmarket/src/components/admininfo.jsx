import { useState } from 'react';
import './userinfo.css';
import AddProductPopup from '../pages/addproduct';
import UploadXML from '../pages/uploadxml';

const Admininfo = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
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
            <h1>Личный кабинет</h1>
            <div className="userinfo-container">
                <div className="userinfo-form">
                    <h2>Изменить данные</h2>
                    <div className="userinfo-form-group">
                        <label className="label">ФИО</label>
                        <div className="input-button-wrapper">
                            <input type="text"/>
                            <button>Изменить ФИО</button>
                        </div>
                    </div>
                    <div className="userinfo-form-group">
                        <label className="label">Email</label>
                        <div className="input-button-wrapper">
                            <input type="email"/>
                            <button>Изменить Email</button>
                        </div>
                    </div>
                    <div className="userinfo-form-group">
                        <label className="label">Пароль</label>
                        <div className="input-button-wrapper">
                            <input type="password"/>
                            <button>Изменить пароль</button>
                        </div>
                    </div>
                    <div className="userinfo-form-group">
                        <label className="label">Подтверждение пароля</label>
                        <div className="input-button-wrapper">
                            <input type="password" placeholder="Заполняется при изменении пароля"/>
                            <button>Подтверждение пароля</button>
                        </div>
                    </div>
                    <div className="userinfo-form-group">
                        <label className="label">Дата рождения</label>
                        <div className="input-button-wrapper">
                            <input type="date"/>
                            <button>Изменить дату рождения</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-button">
                <button>Выйти из аккаунта</button>
                <AddProductPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
                <UploadXML isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
            </div>
        </>
    );
};

export default Admininfo;
