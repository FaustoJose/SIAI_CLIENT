"use client"
import Link from "next/link";
import Form from 'react-bootstrap/Form';
import { useState,useEffect,useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Toast } from 'primereact/toast';
//...........................................
import VideoCanvas from "./canvasVideo/canvas";
//...........................................
import { FaMicrophone } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { CiSaveUp2 } from "react-icons/ci";
//import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { CiSettings } from "react-icons/ci";
//..........................................
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';
//..........................................
//import useGet from "./RestHooks/get";
import usePostArt from "./RestHooks/PostApiArtificial";
import usePost from './RestHooks/post';
import AudioPlayer from './RestHooks/AudioPlayer';

let datosMess={
    participant:'',
    messages:''
}
let datosMessAI={
    participant:'',
    messages:''
}

// let chat={
//     partticipant:'',
//     text:''
// }

//let bodyArt={contents:[{parts:[{text:""}]}]}

let bodyArt={content:''}

const Navigation = () => {

    const [showVoz, setShowVoz] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    const [messages, setMessages] = useState(datosMess);
    const [response,setResponse]=useState([])
    const [dataRes,setDataRes]=useState(datosMessAI)
    const [Res,setRes]=useState(bodyArt)
    const [hablando, setHablando] = useState(false);
    const [precentacion, setPrecentacion] = useState(false);
    

   
    const toast = useRef(null);
   
    const chatRef = useRef(null);
    const audioRef = useRef(null);
//...................................
const endPoint02 = 'textToSpeech/'
//....................................
const endPointName ='hablar/'
const {fetchAudio} = AudioPlayer({audioRef,endPointName});
//....................................
    const openModalVoz = async () => {
      
        setShowVoz(true);
        
         decir('¡Puedes preguntarme lo que quieras!...');
         
    };

    


    useEffect(() => {
        // Desplazar hacia abajo al agregar nuevos elementos
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, [response]);

      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          addNewMessage();
        }
      };

      useEffect(() => {
        if (isRunning) { 
          audioRef.current.pause();
        }
      }, [isRunning]);
//...............................
const handlePlay02 = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });
    }
  };
  //...............................

//console.log('como llamar la api de gemini',bodyArt.contents[0].parts[0].text);
     //...................................................
     const decir = async (text)=>{
        const text01={
            text:text
         }
        const audio = await usePost(endPoint02, text01);
        // if ('speechSynthesis' in window) {

        //     const voz = new SpeechSynthesisUtterance();
        //     voz.lang="es-US";
        //     voz.volume=10;
        //     voz.pitch = 1;
        //     voz.rate = 1;
        //     const timer=setInterval(()=>{
        //         const voices=speechSynthesis.getVoices();
        //         if(voices.length!=0){
        //             voz.voice=voices[0];
        //             voz.voiceURI=voices[0].voiceURI;
        //             clearInterval(timer)
        //         }
        //          //console.log(voices)
                 
        //     },1000)

        //     voz.onend = () => {
        //         // Establecer el estado de hablando a false cuando la síntesis de voz ha terminado
        //         setHablando(false);
        //         setPrecentacion(false);
        //       };
                if (text =='¡Puedes preguntarme lo que quieras!...'){
                    setPrecentacion(true);
                }
                if(text !=='' && audio=='Audio file saved at Audios/output.mp3'){
                    await fetchAudio();
                    handlePlay02();
                    //audioRef.current.play()
                    setHablando(true);
                
                }
        //       if (name !== '') {
        //         // Eliminar los asteriscos del texto usando una expresión regular
        //         const textoSinAsteriscos = name.replace(/\*/g, '');
        //         voz.text = textoSinAsteriscos;
        //         window.speechSynthesis.speak(voz);
        //     }

        // } else {
        //     // El navegador no es compatible con la API de Web Speech
        //     alert('El navegador no es compatible con la API de Web Speech');
        // }
      };
    //......................................
    const handlePlay = () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
        setIsRunning(true);
        setHablando(true);
      };
    
      const handlePause = () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };

     
    //.................................................
        const handleAudioEnded = () => {

            setIsRunning(false)
            setHablando(false);
            handlePause()
            setPrecentacion(false);
            
        };
    
    //......................................
    const handleSpeak = () => {
        setIsRunning(true);
        decir(modalData.answer);
        
    };
    //......................................
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

                const beepSound = new Audio('/sonido/703380__sonically_sound__short-notification.wav');
                beepSound.play();



                const recognition = new window.webkitSpeechRecognition();
                recognition.lang = 'es-ES'; // Establecer el idioma del reconocimiento de voz, por ejemplo, español
    

                recognition.onresult = (event) => {
                    const speechToText = event.results[0][0].transcript;
                    //setTranscript(speechToText);
                    const cleanText = speechToText.replace(/\?/g, ''); // Elimina todos los caracteres que no son palabras ni espacios
                    setResponse(prevMessages => [...prevMessages, {participant:'Tu', messages: cleanText }]);
                    bodyArt.content = cleanText; // Utiliza el texto limpio
                    setRes(bodyArt);
                    pasarDatos();
                    setIsRunning(true);
                    setMessages(datosMess);
                    // Crear un objeto de audio y reproducir el sonido
                
                };
    
                // Iniciar el reconocimiento de voz con el flujo de audio del micrófono
                recognition.start();
               
               

            } else {
                console.log('El usuario ha denegado el acceso al micrófono.');
            }
        } catch (error) {
            console.error('Error al iniciar el reconocimiento de voz:', error);
        }
    };
   
    //..................................................

    const pasarDatos= async()=>{
 console.log('pregunta a la AI',Res)
        const Datos = await usePostArt(Res);
        //const data=Datos.candidates[0].content.parts[0].text;
        const data = Datos;
        
        const dataModificada = data.replace(/chatGPT/g,"SIAI");
        const dataModificada02 = dataModificada.replace(/OpenAI/g,"Programadores Informáticos");
        let _dataRes = { ...dataRes };

        _dataRes[`participant`] = 'SIAI';
        _dataRes[`messages`] = dataModificada02;
        
        //setDataRes(_dataRes)
        
        setResponse(prev=>[...prev,_dataRes]);

        decir(dataModificada02);
        //setHablando(true);
        //console.log('valor de data',Datos)
    }

//console.log('este es un mensaje nuevo',dataRes)

     const addNewMessage = () => {
        messages.participant='Tu';
        setResponse(prevMessages => [...prevMessages, messages]);
        setMessages(datosMess);
        bodyArt.content = messages.messages;
        setRes(bodyArt);
        pasarDatos();
        setIsRunning(true)
     }
//..................................................................
const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _messages = { ...messages };

    _messages[`${name}`] = val;

    setMessages(_messages);
};
//..................................................................
const detener = () => {
    window.speechSynthesis.cancel(); 
    setIsRunning(false)
    setHablando(false);
    handlePause()
  };
//..................................................................
 const info = () => {
    toast.current.show({ severity: 'info', summary: 'Info', detail: 'La inteligencia artificial aún está en vía de desarrollo, por lo que puede cometer algunos errores.', life: 10000 });

 };
//..................................................................
  return <div>

            <div 
            style={{display: 'none'}}
            >
                    <audio ref={audioRef} controls onEnded={handleAudioEnded}>
                    </audio>
               
            </div>
            
            <Toast ref={toast} position="top-center"/>

    <style>
        {`
            .scroll-container {
                height: 34rem;
                
                overflow-y: auto;
                border: 1px solid #ccc;
                border-radius: 5px;
                scroll-behavior:smooth;
            }
            .card {
                font-family: Arial, sans-serif;
                font-size: 16px;
                color: #333;
              }
              /* Espaciado y márgenes */

        `}
    </style>
      

        <nav className="navbar navbar-expand-lg navbar-white  bg-white" >
            <div className="container">
                <Link className="navbar-brand" href="/">Inicio</Link>
                <Link className="navbar-brand" href={'/Eventos'} >Eventos</Link>
                <Link className="navbar-brand" href={'/PreguntasFrecuentes'} target="_blank" >
                <Form className="d-flex">
                    <Button variant="outline-success" >Administrador<CiSettings /></Button>
               </Form>
               </Link>
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
                <Form className="d-flex">
                    <Button variant="outline-success" onClick={openModalVoz}>Habla Conmigo <RxAvatar /></Button>
               </Form>
            </div>
        </nav>

        <Modal
                size="xl"
                show={showVoz}
                fullscreen={true}
                onHide={() => {setShowVoz(false);detener()}}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                   
                       SIAI
                    
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="row">
                    <div className='col-sm-6 col-md-6 col-lg-6  card text-center' style={{height:"28rem"}} >
                            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                <VideoCanvas  Hablando={hablando} precentacion={precentacion} />  
                            </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6">

                            <div className="scroll-container card" ref={chatRef} >
                                

                                {/* Renderizamos tus propios mensajes */}
                                {response.map((res, index) => (
                                    <div key={index} className="card" style={{ marginBottom: '0.5rem', width: '100%' }}>
                                        <label>{res.participant}</label>
                                        <div style={{ display: 'block', width: '100%' }}>{`${res.messages}`}</div>
                                    </div>
                                ))}
                            </div>
                       
                    
                        
                        <div style={{height: '1rem'}}></div>
                        
                            <div className="col-sm-12 col-md-12 col-lg-12">
                                <Form.Control  size="lg" type="text" placeholder="Mensaje para SIAI" value={messages.messages} onChange={(e)=>onInputChange(e,'messages')} onKeyPress={handleKeyPress}  />
                            </div>
                            <div style={{height: '1rem'}}></div>
                        <div className="row text-center"> 

                            <div className="col-sm-2 col-md-2 col-lg-2">
                                <Button  variant="outline-primary" size="lg" onClick={() => addNewMessage()}>
                                    <CiSaveUp2 />
                                </Button>
                            </div>
                            
                            <div className="col-sm-2 col-md-2 col-lg-2">
                                <Button  variant="outline-success" size="lg" onClick={() => startListening()}>
                                    <FaMicrophone />
                                </Button>
                            </div>

                            <div className='col-sm-2 col-md-2 col-lg-2'>
                            <Button variant="outline-primary" size="lg" disabled={!isRunning} onClick={()=>detener()}><FaPause /></Button>
                            </div>

                            <div className='col-sm-2 col-md-2 col-lg-2'>
                            <Button variant="outline-primary" size="lg"  onClick={()=>info()}><FaInfoCircle /></Button>
                            </div>
                        </div>
                    </div>
                   
                    </div>
                </Modal.Body>
                <Modal.Footer>
                   

                    
                    
                </Modal.Footer>
            </Modal>
  </div>;
};
export default Navigation;