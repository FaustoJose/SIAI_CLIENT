import { API_URL } from '../URL';
import axios from 'axios';

const usePut = async (endPointName,id,body) => {
    const endPoint = endPointName;
    const apiUrl = API_URL;
  
    try {
       
        const response = await axios.put(`${apiUrl}${endPoint}${id}`, body);
        console.log('Respuesta:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error al actulizar los datos', error);
        throw error;
    }
};

export default usePut;