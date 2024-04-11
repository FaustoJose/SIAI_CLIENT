import { API_URL } from '../URL';
import axios from 'axios';

const usePost = async (endPointName, body) => {
    const endPoint = endPointName;
    const apiUrl = API_URL;
  
    try {
        
        const response = await axios.post(`${apiUrl}${endPoint}`, body);
        console.log('Respuesta:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error al cargar los datos', error);
        throw error;
    }
};

export default usePost;