import axios from 'axios';

const usePostArt = async (body) => {
    //const endPoint = endPointName;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAsDlRKZxcgkejtHSFqzbdx3je6uEep5Zc`;
  
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