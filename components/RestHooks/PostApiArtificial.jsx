import axios from 'axios';
import { API_URL } from '../URL';
const usePostArt = async (body) => {
    //const endPoint = endPointName;
    const apiUrl = `${API_URL}chatGPT/`;
  
    try {
        
        const response = await axios.post(apiUrl, body);
        console.log('Respuesta:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error al cargar los datos', error);
        throw error;
    }
};

export default usePostArt;