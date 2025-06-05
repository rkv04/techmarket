import axios from "axios";
import { API_URL } from "./ForgotPassword";

export const Addproduct = async (name, shortDescription, fullDescription, subcategoryId, price, oldPrice, isDiscount, quantity, manufacturerId) => {
    try{
        const formData = new FormData();
        formData.append("name", name);
        formData.append("shortDescription", shortDescription);
        formData.append("fullDescription", fullDescription);
        formData.append("subcategoryId", subcategoryId);
        formData.append("price", price);
        formData.append("oldPrice", oldPrice);
        formData.append("isDiscount", isDiscount);
        formData.append("quantity", quantity);
        formData.append("manufacturerId", manufacturerId);
        if (imageFile) {
            formData.append("image", imageFile);
        } 
        else {
            return {
                success: false,
                error: "not_image",
            };
        }
        const response = await axios.post(`${API_URL}/products`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.message === "ADDED_SUCCESS"){
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
                    if(error.response.data.error === "VALIDATION_IMAGE_REQUIRED"){
                        return{
                            success: false,
                            error: 'not_image'
                        }
                    }
                    if(error.response.data.error === "VALIDATION_REQUIRED_FIELDS"){
                        return{
                            success: false,
                            error: 'not_all_fields_filled'
                        }
                    }
                    if(error.response.data.error === "INVALID_ID"){
                        return{
                            success: false,
                            error: 'invalid_id'
                        }
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