import { useUserMenu } from './useUserMenu';
import './menuSettingPopup.css';

const MenuSettingsPopup = ({ isOpen, onClose }) => {
    const { menuItems, loading, error, toggleVisibility, saveMenuChanges } = useUserMenu();

    const handleSave = async () => {
        const success = await saveMenuChanges();
        if (success) {
            onClose();
        }
    };

    if (!isOpen) return null;
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h3>Настройки меню</h3>
                {error && <p className="error">{error}</p>}
                {!loading && (
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