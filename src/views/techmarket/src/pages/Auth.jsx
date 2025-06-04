import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from '../components/Auth';
import '../pages/Auth.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Валидация полей
        if (!email || !password) {
            setError('Все поля обязательны для заполнения');
            return;
        }

        try {
            const result = await Login(email, password);
            if (result.success) {
                navigate('/products');
            } else {
                handleLoginError(result.error);
            }
        } catch (err) {
            setError('Произошла ошибка при подключении к серверу');
        }
    };

    const handleLoginError = (errorType) => {
        switch(errorType) {
            case 'validation':
                setError('Пожалуйста, введите корректные данные');
                break;
            case 'credentials':
                setError('Неверный email или пароль');
                break;
            case 'server':
                setError('Ошибка сервера. Попробуйте позже');
                break;
            default:
                setError('Произошла неизвестная ошибка');
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return(
        <div className="login-container">
            <h2>Вход в систему</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button>Забыли пароль?</button>
                <button type="submit">Войти</button>
                <button 
                    type="button"
                    onClick={handleRegisterClick}
                    className="register-btn"
                >
                    Зарегистрироваться
                </button>
            </form>
        </div>
    )
};

export default LoginForm;