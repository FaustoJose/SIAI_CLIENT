"use client"
import React, { useState, useEffect, useRef } from 'react';
import useGetById from '@/components/RestHooks/getById';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const ListadoPage = ({params}) => {
  const [names, setNames] = useState([]);
  const [time02, setTime02] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isRunning, setIsRunning] = useState(true);
  const [name, setName] = useState([]);
  const endPoint = 'ParticipantesEvento/Event/';
  const { data: datas } = useGetById(endPoint, params.id);

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
    voz.pitch = 10.9;
    voz.rate = 1;
    const timer=setInterval(()=>{
        const voices=speechSynthesis.getVoices();
        if(voices.length!=0){
            voz.voice=voices[0];
            voz.voiceURI=voices[0].voiceURI;
            clearInterval(timer)
        }
         //console.log(voices)
    },1000)

    if(name!=''){
        voz.text = name;
        window.speechSynthesis.speak(voz)
    }
   
  }
  





  const handleSegundosChange = event => {
    setTime02(parseInt(event.target.value));
    console.log('tiempo',event.target.value)
  };
  

  const toggleDisplayingNames = () => {
    setIsRunning(false);
    setName([]);

    names.forEach((name1, index) => {
      setTimeout(() => {
        setCurrentIndex(index);
        setName(prevName => [...prevName, name1.participant_name]);
        decir(name1.participant_name);
        if (names.length - 1 === index) {
          setIsRunning(true);
        }
      }, (index + 1) * time02 * 1000);
    });
  };

  const cancelar = () => {
    
    window.location.reload();
  };

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

  return (
    <div className='container card' style={{ border: '0px solid black', height: '20rem' }}>
      <div className='col-12 card' style={{ border: '0px solid black', marginBottom: '2rem',backgroundColor:'#D6DBDF' }}>
        <h1>Evento:</h1>
      </div>
      <div className='col-12'>
        <div className='row'>
          <div className='col-8 card' style={{ border: '0px solid black', minHeight: '10rem' }}>
            <div className='card' style={{ border: '0px solid black', height: '4rem', width: '100%',backgroundColor:'#F8F9F9',textAlign: 'center' }}>
              <h2>Precentacion  de Participantes</h2>
            </div>
            <div className='container row' style={{ border: '0px solid black', minHeight: '10rem', width: '100%' }}>
              <div className='card col-6'  style={{ border: '0px solid black'}}>
                <div className='card' style={{ border: '0px solid black',  textAlign: 'center', lineHeight: '2rem',backgroundColor:'#F8F9F9' }}>
                  <p style={{ marginTop: '-0.1rem',color:'#000' }}>Listado de Participantes</p>
                </div>
                {names.map((name, index) => {
                  return (
                    <div key={index} className='card' style={{border: '0px solid black',   textAlign: 'center', lineHeight: '2rem' }}>
                      <p style={{ marginTop: '-0.1rem' }}>{name.participant_name}</p>
                    </div>
                  );
                })}
              </div>
              <div className='col-1 card' style={{ border: '0px solid black'}}></div>
              <div className='col-5 card' style={{ minHeight: '10rem',border: '0px solid black' }}>
                <div className='card'>
                  <label>Tiempo de LLamada en segundos:</label>
                  <Form.Control
                    type="number"
                    style={{ height: '40px' }}
                    onChange={handleSegundosChange}
                    value={time02}
                  />
                </div>
                <div className='card'>
                  <label>Iniciar Precentacion:</label>
                  <Button onClick={isRunning ? toggleDisplayingNames : cancelar}>{!isRunning ? 'Detener' : 'Iniciar'}</Button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-4 card' style={{ border: '0px solid black', minHeight: '100%' }}>
            <div className='card' style={{ border: '0px solid black', width: '100%' }}>
              <img src='https://acadmedia.itsc.edu.do/logos/logo_login.png' />
            </div>
            <div className="col-12 card" style={{ border: '0px solid black', height: '2rem', textAlign: 'center', lineHeight: '2rem',backgroundColor:'#D6DBDF' }}>
              <p style={{ marginTop: '-1.1rem' }}>{names[currentIndex]?.participant_name}</p>
              
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
