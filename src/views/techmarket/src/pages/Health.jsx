import { useState, useEffect } from "react";
import axios from "axios";
import './Home.css';
import TestCart from "../components/testcart";
import { Pagination } from "../components/Pagination";

const API_URL = "http://b93332pg.beget.tech/api";

const Health = () => {
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState({
        products: true,
        filters: true
    });
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        page: 1,
        search: "",
        category: "4",
        subcategory: "",
        manufacturer: "",
        price_min: "",
        price_max: "",
        available: false,
        discount: false,
        new: false,
        sort: "",
        order: ""
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    const fetchProducts = async () => {
        try {
            setLoading(prev => ({ ...prev, products: true }));
            const params = new URLSearchParams();
            params.append("page", filters.page);
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== "" && value !== false) {
                    params.append(key, value);
                }
            });

            const response = await axios.get(`${API_URL}/products?category=4/?${params.toString()}`);
            setProducts(response.data.products || []);
            setPagination({
                currentPage: filters.page,
                totalPages: response.data.info?.total_pages || 1,
                totalItems: response.data.info?.total_items || 0
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(prev => ({ ...prev, products: false }));
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/products/categories/4/subcategories`);
            setSubcategories(response.data);
        } catch (err) {
            console.error("Ошибка при загрузке категорий:", err);
            setSubcategories([]);
        }
    };

    const fetchManufacturers = async () => {
        try {
            const response = await axios.get(`${API_URL}/products/manufacturers`);
            setManufacturers(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Ошибка при загрузке производителей:", err);
            setManufacturers([]);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([fetchCategories(), fetchManufacturers()]);
                setLoading(prev => ({ ...prev, filters: false }));
            } catch (err) {
                setError(err.message);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleFilterChange = (updatedFilters) => {
        setFilters(prev => ({
            ...prev,
            ...updatedFilters,
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <div className="Main">
            <div className="mainBlock">
                <div className="productGrid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <TestCart key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="noProducts"><h1>Товары не найдены</h1></div>
                    )}
                </div>
                {pagination.totalPages > 1 && (
                    <div className="Pagination">
                        <Pagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
            <div className="sideBar">
                <div className="filters">
                    <h3>Фильтры</h3>
                    <input
                        type="text"
                        placeholder="Поиск..."
                        onChange={(e) => handleFilterChange({ search: e.target.value })}
                    />
                    <select 
                        value={filters.subcategory}
                        onChange={(e) => handleFilterChange({ subcategory: e.target.value })}
                    >
                        <option value="">Категория</option>
                        {subcategories?.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select 
                        value={filters.manufacturer}
                        onChange={(e) => handleFilterChange({ manufacturer: e.target.value })}
                    >
                        <option value="">Производитель</option>
                        {manufacturers?.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Цена от"
                        onChange={(e) => handleFilterChange({ price_min: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Цена до"
                        onChange={(e) => handleFilterChange({ price_max: e.target.value })}
                    />
                    <div className="labels">
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => handleFilterChange({ available: e.target.checked })}
                            /> В наличии
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => handleFilterChange({ discount: e.target.checked })}
                            /> Со скидкой
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => handleFilterChange({ new: e.target.checked })}
                            /> Новинки
                        </label>
                    </div>
                    <select onChange={(e) => handleFilterChange({ sort: e.target.value })}>
                        <option value="">Сортировка</option>
                        <option value="price">Цена</option>
                        <option value="newness">Новизна</option>
                    </select>
                    <select onChange={(e) => handleFilterChange({ order: e.target.value })}>
                        <option value="">Порядок</option>
                        <option value="asc">По возрастанию</option>
                        <option value="desc">По убыванию</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Health;