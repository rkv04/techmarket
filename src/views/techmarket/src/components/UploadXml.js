import axios from "axios";
import { API_URL } from "./ForgotPassword";

export const UploadXml = async (xmlFile) => {
    try {
        const formData = new FormData();
        formData.append("xml", xmlFile);

        const response = await axios.post(`${API_URL}/products/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.message === "IMPORT_SUCCESS") {
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
                    if (error.response.data.message === "VALIDATION_XML_REQUIRED") {
                        return {
                            success: false,
                            error: 'not_xml'
                        };
                    }
                    break;
                case 500:
                    return {
                        success: false,
                        error: 'server'
                    };
                default:
                    return {
                        success: false,
                        error: 'unknown'
                    };
            }
        } else {
            return {
                success: false,
                error: 'network'
            };
        }
    }
};
