import axios from "axios";

export const API_URL = "http://b93332pg.beget.tech/api";

export const Forgot = async (email) => {
    try{
        const response = await axios.post(`${API_URL}/auth/password-forgot`,
            {
                email
            });
            if (response.data.message === "PASSWORD_RESET_LINK_SENT"){
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
                    return{
                        success: false,
                        error: 'validation'
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