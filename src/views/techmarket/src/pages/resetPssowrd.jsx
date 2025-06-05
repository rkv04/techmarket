import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reset } from "../components/ResetPassword";
import '../pages/forgotPassword.css';

const ResetPasswordForm = () => {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log("Отправляемые данные:", { 
            token, 
            password, 
            repeatedPassword 
        });
        const result = await Reset(token, password, repeatedPassword);
        console.log(token, password, repeatedPassword);
        if (result.success){
            navigate('/login');
        }
        else{
            switch(result.error){
                case 'required_fields':
                    setError('Заполните все поля!');
                    break;
                case 'weak_password':
                    setError('Ошибка валидации пароля!');
                    break;
                case 'password_mismatch':
                    setError('Пароли не совпадают!');
                    break;
                case 'invalid_token':
                    setError('Токен не совпадает!');
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
            <h2>Сброс пароля</h2>
            {error && <div className="error-message">{error}</div>}
            <p>Подтвердите токен из письма и задайте новый пароль!</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Token:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required/>
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                </div>
                <div className="form-group">
                    <label>Повторите пароль:</label>
                    <input
                        type="password"
                        value={repeatedPassword}
                        onChange={(e) => setRepeatedPassword(e.target.value)}
                        required/>
                </div>
                <button type="submit">Сбросить пароль</button>
            </form>
        </div>
    )
};  

export default ResetPasswordForm;