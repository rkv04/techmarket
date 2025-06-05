import { useUserMenu } from './useUserMenu';
import './menuSettingPopup.css';
import { useState } from 'react';

const MenuSettingsPopup = ({ isOpen, onClose, onSave }) => {
    const { error, menuItems, toggleVisibility, saveMenuChanges, refreshMenu } = useUserMenu();

    const handleSave = async () => {
        const success = await saveMenuChanges();
        if (success) {
            onClose();
            if (onSave) onSave();
        }
    };

    if (!isOpen) return null;
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h3>Настройки меню</h3>
                {error && <p className="error">{error}</p>}
                {(
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.id} className="menu-item">
                                <span>{item.category.name}</span>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={item.isHidden === 0}
                                        onChange={() => toggleVisibility(item.id)}
                                    />
                                    Отображать
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={onClose}>Отмена</button>
            </div>
        </div>
    );
};

export default MenuSettingsPopup;