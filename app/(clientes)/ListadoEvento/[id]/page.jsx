"use client"
import React, { useState, useEffect, useRef } from 'react';
import useGetById from '@/components/RestHooks/getById';
import useGet from '@/components/RestHooks/get';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Contador from '@/components/contador/contador';
import Modal from 'react-bootstrap/Modal';
import ImageComponent from '@/components/ImgComponent/ImageComponent01';
import DiscursoComponent from '@/components/Discurso/DiscursoInicio';
import DiscursoComponent02 from '@/components/Discurso/DiscursoFinal';
//...........................................
import VideoCanvas from "@/components/canvasVideo/canvas";
//...........................................
import { ScrollPanel } from 'primereact/scrollpanel';
//..........................................
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
//..........................................
import AudioPlayer from '@/components/RestHooks/AudioPlayer';
//..........................................
import usePost from '@/components/RestHooks/post';
//..........................................
const ListadoPage =({params}) => {




  const [names, setNames] = useState([]);
  const [contador, setContador] = useState(5);
    let [currentIndex, setCurrentIndex] = useState(0);
    const [profecion, setProfecion] = useState([]);
  //................................................
  const [isRunning, setIsRunning] = useState(false); // Cambiado a false inicialmente
  const [isRunning02, setIsRunning02] = useState(false);
  const [isRunning03, setIsRunning03] = useState(false);
  //..................................................
  //const [name, setName] = useState([]);
  const [imgData, setImgData] = useState([]);
  const [lanzamiento, setLanzamiento] = useState(null); 

//............................................................
  const [showVoz, setShowVoz] = useState(false);
  const [hablando, setHablando] = useState(false);
  const [precentacion, setPrecentacion] = useState(false);
//............................................................
const [show, setShow] = useState(false);
const [show02, setShow02] = useState(false);
//............................................................
const [inicio,setInicio]=useState(null);
const [fin,setFin]=useState(null);
//............................................................
const [isButtonActive, setIsButtonActive] = useState(false);
//............................................................
  const endPoint = 'ParticipantesEvento/Event/';
  const { data: datas } = useGetById(endPoint, params.id);
  const endPoint02 = 'RegistroEventos/';
  const { data: Evento } = useGetById(endPoint02, params.id); 
  // Cargar los datos de la imagen solo si `names` tiene datos
  const endPoint03 = 'ImgParticipante/';
  const { data: Img } = useGet(endPoint03); 
  const endPoint04 = 'UploadImg/';


  const canvasRef = useRef(null);
//...................................
  const audioRef = useRef(null);
//...................................
  const endPoint05 = 'textToSpeech/'

//....................................

const endPointName ='hablar/'
const {fetchAudio} = AudioPlayer({audioRef,endPointName});
//...................................
const endPointProfecion = 'Profesion/';
const { data: Profecion } = useGet(endPointProfecion); 
//...................................
useEffect(() => {
  if (Profecion) {
    setProfecion(Profecion);;
  }
}, [Profecion]);
//...................................
  useEffect(() => {
    if (datas) {
      setNames(datas);;
    }
  }, [datas]);
//....................................
  useEffect(() => {
    if (Img) {
      setImgData(Img);
    }
  }, [Img]);
//.....................................
// useEffect(() => {
//   if (audioUrl && !isRunning && !isRunning02 &&! isRunning03) { 
//     audioRef.current.pause();
//   }
// }, [audioUrl]);
//.........................................
 
const idimagen = (imgData) => {
  let data = [];
  let result={};
  let name1=0;
  try {
    // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
    //if(currentIndex<=names.length)
    name1 = names[currentIndex];

    data = imgData.filter((item)=>(item.Img_id === name1.Img_id))
    console.log('datos de imagen',data)
    result = data[0].Img_name;
   
} catch (error) {
    console.error('Error al cargar los datos:', error);
}

  return  <ImageComponent endPointName={endPoint04} imgName={result} /> 
};
   
//...............................
const handlePlay = () => {
  if (audioRef.current) {
    audioRef.current.play().catch((error) => {
      console.error("Error al reproducir el audio:", error);
    });
  }
};
//...............................



  const decir = async(text) => {

    const text01={
      text:text
   }

   const audio = await usePost(endPoint05, text01);
    

    if (text =='Continuemos con la precentacion de los graduandos'){
      setPrecentacion(true);
    }

    if(text !=='' && audio=='Audio file saved at Audios/output.mp3'){
      await fetchAudio();
      handlePlay();
     
     
     
        setHablando(true);
    
    }

  }

  const handleAudioEnded = () => {

    setIsRunning02(false);
    setIsRunning03(false);
     setHablando(false);
    // handlePause()
     setPrecentacion(false);
    
  };
//....................................
  const openModalVoz = () => {
        
    setShowVoz(true);
    //setPrecentacion(true)
    //decir('Continuemos con la precentacion de los graduandos')
  };
//....................................
let intervalId;
const datos = () => {
  
    const ultimo = names.length-1;
  
    const name1 = names[currentIndex];
    const nam=name1.participant_name;
    const namBeforeAt = nam.split("_")[0];
    decir(`...¡${namBeforeAt}!...`);
    
    
    if (ultimo  === currentIndex) {
      setIsRunning(false);
      setCurrentIndex(ultimo)
      clearInterval(intervalId);
      
    }
   
      setCurrentIndex(currentIndex++);
    
};

const DisplayNames = (shouldStart) => {
  if (shouldStart) {
    setIsRunning(true);
    datos();
     intervalId = setInterval(datos,contador * 1000); // Iniciar el intervalo
    setLanzamiento(intervalId); // Almacenar el intervalo en el estado
  } else {
    setIsRunning(false);
    clearInterval(lanzamiento); // Detener el intervalo
  }
};

//..................................

//...................................
const Inicio = ()=>{
  setIsRunning02(true);
  decir(inicio.Text)
}
//...................................
const Fin = () =>{
  setIsRunning03(true);
  decir(fin.Text)
}
//...................................
const PauseInicio = () => {
  setIsRunning02(false);
  setHablando(false);
  if (audioRef.current) {
    audioRef.current.pause();
  }
};
//....................................
const PauseFin = () => {
  setHablando(false);
  setIsRunning03(false);
  if (audioRef.current) {
    audioRef.current.pause();
  }
};
//..............................
const handlePause = () => {
  setHablando(false);
  if (audioRef.current) {
    audioRef.current.pause();
  }
};
//....................................
const Pausar = () => {
  setIsRunning(false);
  clearInterval(lanzamiento);
  handlePause();
  //setCurrentIndex(currentIndex+1)
};
const adelante =()=>{
  if(currentIndex < names.length-1)
  setCurrentIndex(currentIndex+1)
}
const atras =()=>{
  if(currentIndex != 0)
  setCurrentIndex(currentIndex-1)
}
const detener = () => {
   handlePause();
  clearInterval(lanzamiento);
  setCurrentIndex(0)
  setIsRunning(false)
 
};

  
//.....................................
  const onChange = async (event) => {
    const audioFile = event.target.files[0];
    const url = URL.createObjectURL(audioFile);
    const audio = document.querySelector("audio");
    audio.src = url;
    const analyser = await initAnalyser(audio);
    audio.play();
    drawAudio(analyser);
  };

  const drawAudio = (analyser) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 500;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    requestAnimationFrame(() => drawAudio(analyser));
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = WIDTH / bufferLength;
    let x = 0;
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    dataArray.forEach((decibel, index) => {
      const c = index / bufferLength;
      const r = decibel + 25 * c;
      const g = 250 * c;
      const b = 250;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, HEIGHT - decibel, barWidth, decibel);
      x += barWidth + 1;
    });
  };

  const initAnalyser = async (audio) => {
    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
    return analyser;
  };
  //.................................................
    const handleShow = () => setShow(true);
    const handleShow02 = () => setShow02(true);
  //.................................................
  const handleButtonClick = () => {
    setIsButtonActive(!isButtonActive);
  };
  //.................................................
 
  
  return (
  <div  style={{
    border: '0px solid black',
    height: '100%',
    backgroundImage: `url('/ITSC.jpg')`, // Cambia por la URL de tu imagen
    backgroundSize: 'cover', // Ajusta para que la imagen cubra el área
    backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
    opacity: 0.8, // Ajusta la transparencia; 1 es opaco, menos de 1 es transparente
  }}>
    <div className='container card' style={{
      border: '0px solid black',
     
      
    }}>

            <div 
            style={{display: 'none'}}
            >
                    <audio ref={audioRef} onEnded={handleAudioEnded}>
                    </audio>
            </div>

      <div className='col-12 card' style={{ border: '0px solid black', marginBottom: '1rem',backgroundColor:'#D6DBDF' }}>
        <h1 >Evento: {Evento.event_name}</h1>
      </div>
      <div className='col-12'>
        <div className='row'>
          <div className='col-8 card' style={{ border: '0px solid black', minHeight: '10rem' }}>
            <div className='card' style={{ border: '0px solid black', height: '4rem', width: '100%',backgroundColor:'#F8F9F9',textAlign: 'center' }}>
              <h2>Presentación de Participantes</h2>
            </div>
            <div className='container row' style={{ border: '0px solid black', minHeight: '10rem', width: '100%' }}>
              <div className='card col-6'  style={{ border: '0px solid black'}}>
                <div className='card' style={{ border: '0px solid black',  textAlign: 'center', lineHeight: '2rem',backgroundColor:'#F8F9F9' }}>
                  <p style={{ marginTop: '-0.1rem',color:'#000' }}>Listado de Participantes</p>
                </div>
                <ScrollPanel style={{ width: '100%', height: '30rem' }}>
                {names.map((name, index) => {
                  return (
                    <div key={index} className='card' style={{border: '0px solid black',   textAlign: 'center', lineHeight: '2rem' }}>
                      <div style={{ marginTop: '-0.1rem', fontWeight: name.participant_name.split("_")[0] === names[currentIndex]?.participant_name.split("_")[0] ? 'bold' : 'normal' }}>{name.participant_name.split("_")[0]}</div>
                    </div>
                  );
                })}
                </ScrollPanel>
              </div>
              <div className='col-1 card' style={{ border: '0px solid black'}}></div>
              <div className='col-5 card' style={{ minHeight: '10rem',border: '0px solid black' }}>
                <div className='card'>
                  <label className='card text-center'>SEGUNDOS</label>
                  <Contador contador={contador} setContador={setContador}/>
                </div>

                <div className='card'>
                  <label className='card text-center'>CONTROL</label>
                  <div className='card'>
                          <div className=' row'>

                              <div className='col-4 text-center'>
                              <Button variant="outline-primary"  onClick={atras}><FaChevronLeft /></Button>
                              </div>

                              <div className='col-4 text-center'>
                              <Button variant="outline-primary"  onClick={!isRunning ? DisplayNames:Pausar}>{ !isRunning ? <FaPlay />:<FaPause />}</Button>
                              </div>
                              
                              <div className='col-4 text-center'>
                              <Button variant="outline-primary" onClick={adelante}><FaAngleRight /></Button>
                              </div>
                          </div> 
                  </div>
                  <div className='card'>
                          
                              <div className='col-12 text-center'>
                              <Button variant="outline-primary" onClick={detener}><FaStop /></Button>
                              </div>
                        
                  </div>
                </div>
               

                <div className='card'>
                  <Button variant="outline-primary"  onClick={openModalVoz}>PRESENTACIÓN</Button>
                  
                </div>

              </div>
            </div>
          </div>
          <div className='col-4 card' style={{ border: '0px solid black', minHeight: '100%' }}>
            <div className='card' style={{ border: '0px solid black', width: '100%' }}>
              <img src='https://acadmedia.itsc.edu.do/logos/logo_login.png' />
            </div>
            <div className="col-12 card" style={{ border: '0px solid black', height: '2rem', textAlign: 'center', lineHeight: '2rem',backgroundColor:'#D6DBDF' }}>
              <div style={{ marginTop: '-1.1rem' }}>{names[currentIndex]?.participant_name.split("_")[0]}</div>
            </div>

            <div className="card" style={{ border: '0px solid black', width: '100%' }}>
                {idimagen(imgData)}
            </div>

           {/* <div className="col-12 card">
              <canvas  ref={canvasRef}></canvas>
              
            </div>
            {<div className="col-12 card">
             
            <Form.Group controlId="formFile" className="mb-0">
              <Form.Control type="file" onChange={onChange} />
            </Form.Group>
             
            </div>
            <div className="col-12 card">
             
              <audio style={{width:'100%'}} controls></audio>
            </div>} */}
          </div>
        </div>
        <div className='col-12 '>
          <div className='card'>
            <div className='row'>

            

            <div className='col-4' >
              <div className='card' >
                <label className='card text-center'>INICIO DE PRESENTACIÓN</label>
              
                <div className='card'>
                          <div className=' row'>

                              <div className='col-4 text-center'>
                              <Button variant="outline-primary"  onClick={!isRunning02 ? Inicio:PauseInicio}>{ !isRunning02 ? <FaPlay />:<FaPause />}</Button>
                              </div>

                              <div className='col-4 text-center'>
                              
                              </div>
                              
                              <div className='col-4 text-center'>
                              <Button variant="outline-primary" onClick={handleShow}><FaPenToSquare /></Button>
                              </div>
                          </div> 
                  </div>
              </div>
            </div>



              <div className='col-4'style={{height: '8rem'}}>
                
              </div>

              <div className='col-4' >
              <div className='card' >
                <label className='card text-center'>FINAL DE PRESENTACIÓN</label>
                
                <div className='card '>
                          <div className=' row'>

                              <div className='col-4 text-center'>
                              <Button variant="outline-primary"  onClick={!isRunning03 ? Fin:PauseFin}>{ !isRunning03 ? <FaPlay />:<FaPause />}</Button>
                              </div>

                              <div className='col-4 text-center'>
                             
                              </div>
                              
                              <div className='col-4 text-center'>
                              <Button variant="outline-primary" onClick={handleShow02}> <FaPenToSquare /></Button>
                              </div>
                          </div> 
                  </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div style={{height: '3rem'}}></div>
      </div>


      <Modal
                size="xl"
                show={showVoz}
                fullscreen={true}
                onHide={() => setShowVoz(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                centered
            >
                <Modal.Header closeButton>
                    {/* <Modal.Title className='text-center' id="example-custom-modal-styling-title">
                      
                        Presentación de graduandos
                        
                    </Modal.Title> */}
                </Modal.Header>


                <Modal.Body>
                  <div style={{
                                border: '0px solid black',
                                height: '100%',
                                backgroundImage: `url('/ITSC.jpg')`, // Cambia por la URL de tu imagen
                                backgroundSize: 'cover', // Ajusta para que la imagen cubra el área
                                backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
                                opacity: 0.8, // Ajusta la transparencia; 1 es opaco, menos de 1 es transparente
                              }}>
                        <div className='container card text-center'>
                        <div className="row">
                        <div className='col-sm-1 col-md-1 col-lg-1 ' style={{height:"100%"}}>

                        </div>
                            <div className ='col-sm-5 col-md-5 col-lg-5   text-center' style={{height:"100%"}} >
                              
                                     
                                          
                                        <div className="text-start">
                                        <Button  variant="outline-primary"  onClick={handleButtonClick}><GiHamburgerMenu/></Button>
                                        </div> 

                                        <div  style={{height:".5rem"}}></div>
                              {isButtonActive ? (  
                                <div>
                                    <div className='card'>
                                            <div className=' row'>
                                                
                                                <div className='col-5 text-center'>
                                                <Button className='text-center' variant="outline-primary"  onClick={!isRunning02 ? Inicio:PauseInicio}> INICIO DE PRESENTACIÓN |{ !isRunning02 ? <FaPlay />:<FaPause />}</Button>
                                                </div>

                                                <div className='col-2 text-center'>
                                                {/* <Button variant="outline-primary"  onClick={!isRunning ? DisplayNames:Pausar}>{ !isRunning ? <FaPlay />:<FaPause />}</Button> */}
                                                </div>
                                                
                                                <div className='col-5 text-center'>
                                                <Button variant="outline-primary"  onClick={!isRunning03 ? Fin:PauseFin}> FINAL DE PRESENTACIÓN |{ !isRunning03 ? <FaPlay />:<FaPause />}</Button>
                                                </div>
                                            </div> 
                                    </div>
                                    <div className='card'>
                                            <div className=' row'>

                                                <div className='col-4 text-center'>
                                                <Button variant="outline-primary"  onClick={atras}><FaChevronLeft /></Button>
                                                </div>

                                                <div className='col-4 text-center'>
                                                <Button variant="outline-primary"  onClick={!isRunning ? DisplayNames:Pausar}>{ !isRunning ? <FaPlay />:<FaPause />}</Button>
                                                </div>
                                                
                                                <div className='col-4 text-center'>
                                                <Button variant="outline-primary" onClick={adelante}><FaAngleRight /></Button>
                                                </div>
                                            </div> 
                                    </div>
                                    </div>):(<div  style={{height:"9rem"}}></div>)}
                                    <div className='' style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                        <VideoCanvas  Hablando={hablando} precentacion={precentacion} />  
                                    </div>
                                    
                            </div>
                            <div className='col-sm-1 col-md-1 col-lg-1 ' style={{height:"100%"}}>

                            </div>
                            <div className ='col-sm-4 col-md-4 col-lg-4  card text-center' style={{height:"100%"}} >
                                     <div className='card text-center' style={{  width: '100%'}}>
                                        <img src='https://acadmedia.itsc.edu.do/logos/logo_login.png' />
                                     </div>
                                    <div className='mt-5' style={{  width: '100%', height:"100%" }}>
                                        {idimagen(imgData)}
                                    </div>

                                    <div className='card mt-5' style={{  width: '100%', height:"100%" }}>
                                      
                                    <div className='card'>
                                        <div className='row'>
                                          <h5 className='col-4 text-start' style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>NOMBRE:</h5>
                                          <div className='col-8 text-start' style={{ fontWeight: 'bold', fontSize: '1rem' }}>{names[currentIndex]?.participant_name.split("_")[0]}</div>
                                        </div>
                                        {names[currentIndex]?.academic_degree!='None'&&
                                        (<div className='row'>
                                            <h5 className='col-4 text-start' style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>HONOR:</h5>
                                            <div className='col-8 text-start' style={{ fontWeight: 'bold', fontSize: '1rem' }}>{names[currentIndex]?.academic_degree}</div>
                                        </div>)}
                                    </div>
                                    <div>
                                      <h5 className='col-12 ' style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>PROFESIÓN TÉCNICO SUPERIOR:</h5>
                                        {profecion.map((item,index)=>{
                                          if(names[currentIndex]?.profetion_id === item.profetion_id){
                                           return (<div className='col-12' key={index} style={{ fontWeight: 'bold', fontSize: '1rem' }}>{item.description}</div>)
                                          }
                                        })}
                                    </div>
                                    </div>

                            </div>
                            <div className='col-sm-1 col-md-1 col-lg-1 ' style={{height:"100%"}}>

                            </div>
                        </div>
                        </div>
                        </div>
                </Modal.Body>

                <Modal.Footer>
                   

                    
                    
                </Modal.Footer>

      </Modal>
      
      <DiscursoComponent show={show} setShow={setShow} setInicio={setInicio} Event_id={params.id}/>
      <DiscursoComponent02 show02={show02} setShow02={setShow02} setFin={setFin} Event_id={params.id}/>
    </div>
    </div>
  );
};

export default ListadoPage;
