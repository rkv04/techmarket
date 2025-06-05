import React, { useState, useEffect } from "react";
import axios from "axios";
import './Home.css';
import TestCart from "../components/testcart";

const API_URL = "http://b93332pg.beget.tech/api";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
    });
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    params.append(key, value);
                }
            });

            const response = await axios.get(`${API_URL}/products?${params.toString()}`);
            setProducts(response.data.products);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    if (loading) return <div className="loading">Загрузка товаров...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;

    return(
        <div className="Main">
            <div className="mainBlock">
                {products.map(product => (
                    <TestCart 
                        key={product.id}
                        product={product} 
                    />
                ))}
            </div>
            <div className="sideBar">
                <div className="filters">
                    <h3>Фильтры</h3>
                    <input
                        type="text"
                        placeholder="Поиск..."
                        onChange={(e) => handleFilterChange({ search: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;