import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../URL';
const AudioPlayer = ({audioRef,endPointName}) => {
  //const audioRef = useRef(null);
  //const [audioUrl, setAudioUrl] = useState('');

     const endPoint = endPointName;
    const apiUrl = API_URL;
  // Función para obtener el audio
  const fetchAudio = async () => {
    try {
      const response = await axios.get(`${apiUrl}${endPoint}`, {
        responseType: 'blob', // Importante para manejar archivos binarios
      });

      // Crear un objeto URL a partir del Blob
      const url = URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }));
      //setAudioUrl(url);

      //Cargar el nuevo audio
      
   
         if (audioRef.current) {
            audioRef.current.src = url; 
            audioRef.current.load(); 
           // audioRef.current.play();
         }

      
    } catch (error) {
      console.error('Error fetching the audio file:', error);
    }
  };

  // Efecto para cargar el audio cuando se monta el componente
  useEffect(() => {
    fetchAudio();
  }, []);

  return {
    //audioUrl,
    fetchAudio
  }
  //   <div>
  //     {audioUrl ? (
  //       <audio ref={audioRef} controls>
  //         <source src={audioUrl} type="audio/mpeg" />
  //         Your browser does not support the audio element.
  //       </audio>
  //     ) : (
  //       <p>Loading audio...</p>
  //     )}
  //     <button onClick={fetchAudio}>Reload Audio</button>
  //   </div>
  // );
};

export default AudioPlayer;
