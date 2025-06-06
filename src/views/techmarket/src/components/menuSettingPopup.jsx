import { useUserMenu } from './useUserMenu';
import './menuSettingPopup.css';

const MenuSettingsPopup = ({ isOpen, onClose, onSave }) => {
    const { 
        menuItems, 
        error, 
        isSaving,
        toggleVisibility, 
        saveMenuChanges 
    } = useUserMenu();

    const handleSave = async () => {
        const success = await saveMenuChanges();
        if (success) {
            onClose?.();
            onSave?.();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={!isSaving ? onClose : undefined}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h3>Настройки меню</h3>
                {error && <div className="error-message">{error}</div>}
                
                <ul className="menu-items-list">
                    {menuItems.map((item) => (
                        <li key={item.id} className="menu-item">
                            <span className="menu-item-name">
                                {item.category?.name || `Элемент ${item.id}`}
                            </span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={item.isHidden === 0}
                                    onChange={() => toggleVisibility(item.id)}
                                    disabled={isSaving}
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-text">
                                    {item.isHidden === 0 ? 'Видимый' : 'Скрытый'}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
                
                <div className="popup-actions">
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="save-button"
                    >
                        {isSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button 
                        onClick={onClose} 
                        disabled={isSaving}
                        className="cancel-button"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuSettingsPopup;