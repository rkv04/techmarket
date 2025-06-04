import axios from "axios";

const API_URL = "http://b93332pg.beget.tech/api";

export const Register = async (name, email, password, repeatedPassword) => {
    try{
        const response = await axios.post(`${API_URL}/auth/register`,
            {
                name,
                email,
                password,
                repeatedPassword
            });
            if (response.data.message === 'REGISTER_SUCCESS'){
                return{
                    success: true,
                    data: response.data
                }
            }
    }
    catch(error){
        if (error.response){
            switch(error.response.status){
                case 400:
                    if(error.response.data.error === "VALIDATION_REQUIRED_FIELDS"){
                        return{
                            success: false,
                            error: 'required_fields'
                        }
                    }
                    if(error.response.data.error === "VALIDATION_INVALID_EMAIL"){
                        return{
                            success: false,
                            error: 'invalid_email'
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
                case 409:
                    return{
                        success: false,
                        error: 'email_exists'
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