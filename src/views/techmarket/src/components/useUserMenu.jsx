import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://b93332pg.beget.tech/api";

export const useUserMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState('');

    const fetchMenu = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/menu`, {
                withCredentials: true
            });
            setMenuItems(response.data);
        } catch (err) {
            setError(err.message || 'Ошибка загрузки меню');
        }
    };

    const toggleVisibility = (id) => {
        setMenuItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isHidden: item.isHidden ? 0 : 1 } : item
            )
        );
    };

    const saveMenuChanges = async () => {
        try {
            const payload = menuItems.map(({ id, isHidden }) => ({ id, isHidden }));
            const response = await axios.put(
                `${API_URL}/menu/user`,
                payload,
                { withCredentials: true }
            );
            setMenuItems(response.data);
            return true;
        } catch (err) {
            setError(err.message || 'Ошибка сохранения меню');
            return false;
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    return { menuItems, error, toggleVisibility, saveMenuChanges };
};