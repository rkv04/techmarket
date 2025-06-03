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

        const result = await Login(email, password);
        console.log(result, email, password);
        if (result.success){
            navigate('/products');
        }
        else{
            switch(result.error){
                case 'validation':
                    setError('Ошибка валидации! Проверьте поля');
                    break;
                case 'credentials':
                    setError('Неверные данные! Проверьте поля');
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
            <button type="submit">
                Войти
            </button>
        </form>
        </div>
    )
}

export default LoginForm;