import { API_URL } from '../URL';
import axios from 'axios';

const useDelete = async (endPointName,id) => {
    const endPoint = endPointName;
    const apiUrl = API_URL;
  
    try {
       
        const response = await axios.delete(`${apiUrl}${endPoint}${id}`);
        console.log('Respuesta:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error al actulizar los datos', error);
        throw error;
    }
};

export default useDelete;