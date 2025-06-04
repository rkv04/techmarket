import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Forgot } from '../components/ForgotPassword';
import '../pages/forgotPassword.css';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await Forgot(email);
        if (result.success){
            console.log(result, email);
        }
        else{
            switch(result.error){
                case 'validation':
                    setError('Ошибка валидации Email!');
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
            <h2>Восстановление пароля</h2>
            {error && <div className="error-message">{error}</div>}
            <p>Введите адрес электронной почты - туда придет токен для восстановления пароля!</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    )

};  

export default ForgotPasswordForm;