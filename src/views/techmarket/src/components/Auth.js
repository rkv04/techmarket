import axios from 'axios';

const API_URL = "http://b93332pg.beget.tech/api";

export const Login = async (email, password) => {
    try{
        const response = await axios.post(`${API_URL}/auth/login`, 
        {
            email,
            password
        },
        {withCredentials: true}
        );
        if (response.data.message === 'LOGIN_SUCCESS'){
            return{
                success: true,
                data: response.data
            };
        }
        else{
            return{
                success: false,
                error: 'credentials'
            }
        }
    }
    catch(error){
        if (error.response){
            switch (error.response.status){
                case 400:
                    return{
                        success: false,
                        error: 'validation'
                    };
                case 409:
                    return{
                        success: false,
                        error: 'credentials'
                    }
                case 500:
                    return{
                        success: false,
                        error: 'server'
                    }
                default:
                    return{
                        success: false,
                        error: 'unknow'
                    }
            }
        }
        else{
            return {
                success: false,
                error: 'network'
            }
        }
    }
};