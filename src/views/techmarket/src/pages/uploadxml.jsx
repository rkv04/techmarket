import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UploadXml } from "../components/UploadXml";
import './addproduct.css';

const UploadXML = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState('');
    const [xmlFile, setXmlFile] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!xmlFile) {
            setError('Пожалуйста, выберите файл XML для загрузки.');
            return;
        }

        const result = await UploadXml(xmlFile);
        if (result.success) {
            navigate('/admin');
        } else {
            switch (result.error) {
                case 'not_xml':
                    setError('Ошибка валидации! Не загружен файл XML');
                    break;
                case 'server':
                    setError('Ошибка сервера!');
                    break;
                case 'unknown':
                    setError('Неизвестная ошибка!');
                    break;
                default:
                    setError('Произошла ошибка!');
                    break;
            }
        }
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    };

    const closeOnOverlayClick = (e) => {
        if (e.target.classList.contains('TestCart-overlay')) {
            toggleExpand();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setXmlFile(file);
            console.log("Файл загружен:", file.name);
        }
    };

    return (
        <>
            <div onClick={toggleExpand}>
                <div id='notOpen'>
                    <button>Загрузить XML</button>
                </div>
            </div>
            <div 
                className={`TestCart-overlay ${isExpanded ? 'active' : ''}`}
                onClick={closeOnOverlayClick}
            ></div>
            <div className={`TestCart-expanded ${isExpanded ? 'active' : ''}`}>
                <div id='isOpen'>
                    <h1>Загрузить XML</h1>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="details">
                            <h3>Загрузите файл формата XML</h3>
                            <label>Загрузить файл</label>
                            <input type="file" name="xml" onChange={handleFileChange} />
                        </div>
                        <button type="submit">Загрузить XML</button>
                    </form>
                    <button onClick={toggleExpand}>Закрыть</button>
                </div>
            </div>
        </>
    );
};

export default UploadXML;
