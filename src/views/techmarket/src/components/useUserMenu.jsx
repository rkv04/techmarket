import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API_URL = "http://b93332pg.beget.tech/api";

export const useUserMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const abortControllerRef = useRef(null);

    const fetchMenu = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        const controller = new AbortController();
        abortControllerRef.current = controller;
        
        try {
            const response = await axios.get(`${API_URL}/user/menu`, {
                withCredentials: true,
                signal: controller.signal
            });
            setMenuItems(response.data?.map(item => ({
                ...item,
                originalIsHidden: item.isHidden
            })) || []);
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err.message || 'Ошибка загрузки меню');
            }
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    }, []);

    const toggleVisibility = useCallback((id) => {
        setMenuItems(prev => prev.map(item => 
            item.id === id ? { 
                ...item, 
                isHidden: item.isHidden === 1 ? 0 : 1 
            } : item
        ));
    }, []);

    const saveMenuChanges = useCallback(async () => {
        if (isSaving) return false;
        
        setIsSaving(true);
        const controller = new AbortController();
        abortControllerRef.current = controller;
        
        try {
            // Фильтруем только изменённые элементы
            const changedItems = menuItems.filter(
                item => item.isHidden !== item.originalIsHidden
            );
            
            if (changedItems.length === 0) return true;
            
            const payload = changedItems.map(({ id, isHidden }) => ({ id, isHidden }));
            const response = await axios.put(
                `${API_URL}/user/menu`,
                payload,
                { 
                    withCredentials: true,
                    signal: controller.signal
                }
            );
            setMenuItems(prev => prev.map(item => {
                const updatedItem = response.data?.find(i => i.id === item.id);
                return updatedItem ? { 
                    ...updatedItem,
                    originalIsHidden: updatedItem.isHidden
                } : item;
            }));
            
            return true;
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err.message || 'Ошибка сохранения меню');
            }
            return false;
        } finally {
            setIsSaving(false);
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    }, [menuItems, isSaving]);

    useEffect(() => {
        fetchMenu();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchMenu]);

    return { 
        menuItems, 
        error, 
        isSaving,
        toggleVisibility, 
        saveMenuChanges,
        refreshMenu: fetchMenu
    };
};