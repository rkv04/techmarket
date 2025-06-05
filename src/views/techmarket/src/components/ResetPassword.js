import axios from "axios";
import { API_URL } from "./ForgotPassword";

export const Reset = async (token, password, passwordRepeated) => {
    try{
        const response = await axios.post(`${API_URL}/auth/password-reset`, 
        {
            token,
            password,
            passwordRepeated
        });
        if (response.data.message === "PASSWORD_CHANGED"){
            return{
                success: true,
                data: response.data
            }
        }
    }
    catch(error){
        if (error.response){
            console.log(error.response.data.error);
            switch(error.response.status){
                case 400:
                    if(error.response.data.error === "VALIDATION_REQUIRED_FIELDS"){
                        return{
                            success: false,
                            error: 'required_fields'
                        }
                    }
                    if(error.response.data.error === "VALIDATION_WEAK_PASSWORD"){
                        return{
                            success: false,
                            error: 'weak_password'
                        }
                    }
                    if(error.response.data.error === "VALIDATION_PASSWORD_MISMATCH"){
                        return{
                            success: false,
                            error: 'password_mismatch'
                        }
                    }
                case 410:
                    return{
                        success: false,
                        error: 'invalid_token'
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
            return{
                success: false,
                error: 'network'
            }
        }
    }
};