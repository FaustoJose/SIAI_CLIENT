import { useEffect, useState } from 'react';
import { API_URL } from '../URL';
import axios from 'axios';

const useGetById = (endPointName,id) => {
    const [data, setData] = useState([]);
    const [mounted, setMounted] = useState(true); 

    const endPoint = endPointName;
    const apiUrl = API_URL;

    useEffect(() => {
        setMounted(true); 
         axios.get(`${apiUrl}${endPoint}${id}`)
            .then(response => {
                console.log('Respuesta:', response.data);
                if (mounted) { 
                    setData(response.data);
                }
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });

        return () => {
            setMounted(false);
        };
    }, [endPoint, apiUrl]);

    return { data };
};

export default useGetById;