import axios from "axios";
import { API_URL } from "./ForgotPassword";

export const ChangePassword = async (password, passwordRepeated) => {
    try {
        const response = await axios.post(`${API_URL}/auth/password-change`, {
            password,
            passwordRepeated
        });

        if (response.data.message === "PASSWORD_CHANGED") {
            return {
                success: true,
                data: response.data
            };
        }
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.error);
            switch (error.response.status) {
                case 400:
                    if (error.response.data.error === "VALIDATION_REQUIRED_FIELDS") {
                        return {
                            success: false,
                            error: 'required_fields'
                        };
                    } else if (error.response.data.error === "VALIDATION_WEAK_PASSWORD") {
                        return {
                            success: false,
                            error: 'weak_password'
                        };
                    } else if (error.response.data.error === "VALIDATION_PASSWORD_MISMATCH") {
                        return {
                            success: false,
                            error: 'password_mismatch'
                        };
                    }
                    break;
                case 500:
                    return {
                        success: false,
                        error: 'server_error'
                    };
                default:
                    return {
                        success: false,
                        error: 'unknown_error'
                    };
            }
        } else {
            return {
                success: false,
                error: 'network_error'
            };
        }
    }
};
