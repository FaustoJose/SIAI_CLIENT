"use client"
import React, { useState, useEffect, useRef } from 'react';
import useGetById from '@/components/RestHooks/getById';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Contador from '@/components/contador/contador';

import { ScrollPanel } from 'primereact/scrollpanel';
//..........................................
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
//..........................................

const ListadoPage = ({params}) => {
  const [names, setNames] = useState([]);
  const [contador, setContador] = useState(3);
    let [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // Cambiado a false inicialmente
  const [name, setName] = useState([]);
  const [lanzamiento, setLanzamiento] = useState(null); 


  const endPoint = 'ParticipantesEvento/Event/';
  const { data: datas } = useGetById(endPoint, params.id);
  const endPoint02 = 'RegistroEventos/';
  const { data: Evento } = useGetById(endPoint02, params.id); 

  const canvasRef = useRef(null);

  useEffect(() => {
    if (datas) {
      setNames(datas);
    }
  }, [datas]);


   
  const decir=(name)=>{

    const voz = new SpeechSynthesisUtterance();
    voz.lang="es-US";
    voz.volume = 5;
    voz.pitch = 0.9;
    voz.rate = 1;
    const timer=setInterval(()=>{
        const voices=speechSynthesis.getVoices();
        if(voices.length!=0){
            voz.voice=voices[0];
            voz.voiceURI=voices[0].voiceURI;
            clearInterval(timer)
        }
         //console.log(voices)
    },2000)

    if(name!=''){
        voz.text = name;
        window.speechSynthesis.speak(voz)
    }
   
  }
  






  
//....................................
let intervalId;
const datos = () => {
  console.log('pausa', currentIndex);
  const name1 = names[currentIndex];
  console.log('datos de name1', name1);
  setCurrentIndex(currentIndex++); // Incrementar currentIndex
  //setName((prevName) => [...prevName, name1.participant_name]);
  decir(name1.participant_name);

  if (names.length - 1 === currentIndex) {
    setIsRunning(false); // Si llegamos al final, detener el intervalo
  }
  console.log('valor de names y currentIndex',names.length,currentIndex)
  if (names.length <= currentIndex) {
    setCurrentIndex(0)
    clearInterval(intervalId);
    
  }
};

const DisplayNames = (shouldStart) => {
  if (shouldStart) {
    setIsRunning(true);
   
     intervalId = setInterval(datos,contador * 1000); // Iniciar el intervalo
    setLanzamiento(intervalId); // Almacenar el intervalo en el estado
  } else {
    setIsRunning(false);
    clearInterval(lanzamiento); // Detener el intervalo
  }
};

const cancelar = () => {
  setIsRunning(false);
  clearInterval(lanzamiento);
  setCurrentIndex(currentIndex+1)
};

const detener = () => {
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

  return (
    <div className='container card' style={{ border: '0px solid black', height: '20rem' }}>
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
                      <div style={{ marginTop: '-0.1rem', fontWeight: name.participant_name === names[currentIndex]?.participant_name ? 'bold' : 'normal' }}>{name.participant_name}</div>
                    </div>
                  );
                })}
                </ScrollPanel>
              </div>
              <div className='col-1 card' style={{ border: '0px solid black'}}></div>
              <div className='col-5 card' style={{ minHeight: '10rem',border: '0px solid black' }}>
                <div className='card'>
                  <label className='card text-center'>TIEMPO</label>
                  <Contador contador={contador} setContador={setContador}/>
                </div>
                <div className='card'>
                  <label className='card text-center'>CONTROL</label>
                   <div className='row'>
                      <div className='col-4 text-center'>
                      <Button variant="outline-primary" disabled={isRunning} onClick={DisplayNames}><FaPlay /></Button>
                      </div>
                      <div className='col-4 text-center'>
                      <Button variant="outline-primary" disabled={!isRunning} onClick={cancelar}><FaPause /></Button>
                      </div>
                      <div className='col-4 text-center'>
                      <Button variant="outline-primary" onClick={detener}><FaStop /></Button>
                      </div>
                   </div>
                  
                 
                </div>
              </div>
            </div>
          </div>
          <div className='col-4 card' style={{ border: '0px solid black', minHeight: '100%' }}>
            <div className='card' style={{ border: '0px solid black', width: '100%' }}>
              <img src='https://acadmedia.itsc.edu.do/logos/logo_login.png' />
            </div>
            <div className="col-12 card" style={{ border: '0px solid black', height: '2rem', textAlign: 'center', lineHeight: '2rem',backgroundColor:'#D6DBDF' }}>
              <div style={{ marginTop: '-1.1rem' }}>{names[currentIndex]?.participant_name}</div>
              
            </div>
            <div className="col-12 card">
              <canvas  ref={canvasRef}></canvas>
              
            </div>
            <div className="col-12 card">
             
            <Form.Group controlId="formFile" className="mb-0">
              <Form.Control type="file" onChange={onChange} />
            </Form.Group>
             
            </div>
            <div className="col-12 card">
             
              <audio style={{width:'100%'}} controls></audio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoPage;
