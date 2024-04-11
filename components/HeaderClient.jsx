"use client"
import Link from "next/link";
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaMicrophone } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import useGet from "./RestHooks/get";


const Navigation = () => {
    const [showVoz, setShowVoz] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [result,Result]=useState('');

    const endPoint = 'Preguntas/';
    const {data:datas}=useGet(endPoint);
    const data=datas

    const openModalVoz = () => {
        setShowVoz(true);
    };
     //...................................................
    const handleSpeak = () => {
        // Verifica si el navegador es compatible con la API de Web Speech
        if ('speechSynthesis' in window) {
            // Crea un nuevo objeto SpeechSynthesisUtterance
            let msg = new SpeechSynthesisUtterance();

            // Establece el texto que se convertirá en voz
            msg.text = modalData.answer;
            // Configura el idioma en español
            msg.lang = 'es-ES';
            // Selecciona una voz en español
            const voices = window.speechSynthesis.getVoices();
            const spanishVoice = voices.find(voice => voice.lang === 'es-ES');
            console.log(spanishVoice);
            if (spanishVoice) {
                msg.voice = spanishVoice;

            } else {
                console.error('No se encontró una voz en español.');
            }
             
            msg.volume = 1; // Volumen (0 a 1)
            msg.rate = 0.9;   // Velocidad de habla (0.1 a 10)
            msg.pitch = 1.3;  // Tono de voz (0 a 2)

            
            // Reproduce el texto en voz
            window.speechSynthesis.speak(msg);
            
        } else {
            // El navegador no es compatible con la API de Web Speech
            alert('El navegador no es compatible con la API de Web Speech');
        }
    };
    //......................................

    const isSpeechRecognitionSupported = () => {
        return 'webkitSpeechRecognition' in window;
    };
    //.........................................

    const startListening = async () => {
        try {
            if (!isSpeechRecognitionSupported()) {
                alert('El reconocimiento de voz no es compatible con este navegador.');
                return;
            }
    
            // Preguntar al usuario si permite el acceso al micrófono
            const permission = await window.navigator.mediaDevices.getUserMedia({ audio: true });
    
            if (permission) {
                
    
                const recognition = new window.webkitSpeechRecognition();
                recognition.lang = 'es-ES'; // Establecer el idioma del reconocimiento de voz, por ejemplo, español
    
                recognition.onresult = (event) => {
                    const speechToText = event.results[0][0].transcript;
                    setTranscript(speechToText);
                };
    
                // Iniciar el reconocimiento de voz con el flujo de audio del micrófono
                recognition.start();

                Respuesta();

            } else {
                console.log('El usuario ha denegado el acceso al micrófono.');
            }
        } catch (error) {
            console.error('Error al iniciar el reconocimiento de voz:', error);
        }
    };
    const Respuesta = ()=>{

       let result = data.filter(data => data.question.toLowerCase().includes(transcript));
       Result(result.answer);

    }
    //..................................................
  return <div>
    
      

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" href="/">Preguntas Frecuentes</Link>|
                <Link className="navbar-brand" href={'/Eventos'} >Eventos</Link>
                {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button> */}
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                
                    
                    <li className="nav-item">
                    {/* <Link className="navbar-brand" href={'/Eventos'} >Eventos</Link> */}
                    </li>
                
                </ul>
                </div>
                {/* <Form className="d-flex">
                    <Button variant="outline-success" onClick={openModalVoz}><FaMicrophone /></Button>
               </Form> */}
            </div>
        </nav>

        <Modal
                size="md"
                show={showVoz}
                onHide={() => setShowVoz(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                       Usa tu Voz
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <div><p>Texto Transcrito:  {transcript} </p></div>
               
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => setShowVoz(false)}>
                    <AiOutlineClose />
                    </Button>

                    <Form className="d-flex">
                        <Button variant="outline-success" onClick={startListening}><FaMicrophone /></Button>
                    </Form>
                    
                </Modal.Footer>
            </Modal>
  </div>;
};
export default Navigation;