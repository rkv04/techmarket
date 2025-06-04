import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register } from '../components/Register';
import './Register.css';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const result = await Register(name, email, password, repeatedPassword);
        if (result.success){
            navigate('/login');
        }
        else{
            console.log(result.error);
            switch(result.error){
                case 'required_fields':
                    setError('Ошибка валидации! Проверьте поля');
                    break;
                case 'invalid_email':
                    setError('Ошибка валидации! Проверьте Email');
                    break;
                case 'weak_password':
                    setError('Ошибка валидации! Проверьте Пароль');
                    break;
                case 'password_mismatch':
                    setError('Ошибка валидации! Пароли не совпадают');
                    break;
                case 'email_exists':
                    setError('Ошибка валидации! Email уже используется');
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
            {error && <div className="error-message">{ error }</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Имя:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label>Повторите пароль:</label>
                    <input
                        type="password"
                        value={repeatedPassword}
                        onChange={(e) => setRepeatedPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    )
};

export default RegisterForm;