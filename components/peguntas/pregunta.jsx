"use client";
import { useState,useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import VideoCanvas from '../canvasVideo/canvas';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
//..............................................
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import useGet from '../RestHooks/get';
//..............................................

const Pregunta = ({Datas}) => {

    const [hablando, setHablando] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState({ question: '', answer: '' });
    const [uniqueCategory, setUniqueCategory] = useState([]);
    const [radioValue, setRadioValue] = useState('1');
    


    const endPoint = 'Category/';
    const {data:category}=useGet(endPoint);
//..........................................................
useEffect(() => {
    if (category) {
        setUniqueCategory(category); 
    }
  }, [category]);

//..........................................................
console.log('valor de categoria',category)
    const openModal = (question, answer) => {
        setModalData({ question, answer });
        setShow(true);
        
    };
    

    
    const decir=(name)=>{
        if ('speechSynthesis' in window) {

            const voz = new SpeechSynthesisUtterance();
            voz.lang="es-US";
            voz.volume=1;
            voz.pitch = 1;
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

            voz.onend = () => {
                // Establecer el estado de hablando a false cuando la síntesis de voz ha terminado
                setHablando(false);
                setIsRunning(false);
                setShow(false);
              };

            if(name !==''){
                voz.text=name;
                setHablando(true);
                window.speechSynthesis.speak(voz)
            }

        } else {
            // El navegador no es compatible con la API de Web Speech
            alert('El navegador no es compatible con la API de Web Speech');
        }
      }


      
      const detener = () => {
        window.speechSynthesis.cancel(); 
        setIsRunning(false)
        setHablando(false);
      };
    //......................................
    const handleSpeak = () => {
        setIsRunning(true);
        decir(modalData.answer);
        
    };
    //......................................
   
    const forCategory=(value)=>{
        
        const Bycategory = category.filter((item)=>(item.category_id==value))
        console.log('valor de las categorias',Bycategory);
        setUniqueCategory(Bycategory);
    }

    //......................................
  return( 
        <div className='container'>
            <div className='col-12  card' style={{  height:'auto' }}>
                       
                    <ButtonGroup>
                        {category.map((radio,idx) => (
                        <ToggleButton
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                            name="radio"
                            value={radio.category_id.toString()}
                            checked={radioValue === radio.category_id.toString()}
                            onChange={(e) => setRadioValue(e.currentTarget.value.toString())}
                            onClick={()=>forCategory(radio.category_id)}
                        >
                            {radio.description}
                        </ToggleButton>
                        ))}
                    </ButtonGroup>
            </div>
            <div className=''>
                    
                    
                    {
                        uniqueCategory.map((cat)=>(
                                <div key={cat.category_id} className='col-12 card'>

                                    <div className='text-center card display-2 bg-light text-secondary mt-3'><h2>{cat.description}</h2></div>
                                         <ul className="list-group">
                                       

                                        {Datas.map((Data)=>{
                                        if(Data.category_id==cat.category_id){  

                                            return(
                                                        <li key={Data.faq_id} style={{height:'100px'}}
                                                        className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                                                        onClick={() => openModal(Data.question, Data.answer)}
                                                        >  
                                                                <div>
                                                                    <div>
                                                                    <h5> {Data.question}</h5>
                                                                    </div>
                                                                    
                                                                </div> 
                                                        </li>
                                                        
                                        )}})}
                                        
                                        </ul>
                                </div>
                        ))


                    }
                       
                    
            </div>
            <Modal
                size="xl"
                show={show}
                onHide={() => {setShow(false);detener();}}
                onShow={() => handleSpeak()}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                centered
            >

                <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                       {modalData.question}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p className='card'>
                            {modalData.answer} 
                    </p>
                    
                    <div className='col-12 card text-center' style={{height:"25rem"}} >
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                            <VideoCanvas Hablando={hablando} precentacion={false}/>  
                        </div>
                    </div>

                </Modal.Body>

                <Modal.Footer>

                    <div className=' text-center'>
                      <Button variant="outline-primary" disabled={!isRunning} onClick={()=>detener()}><FaPause /></Button>
                    </div>
                    <div className='text-center'>
                      <Button variant="outline-primary" disabled={isRunning} onClick={()=>handleSpeak()}><FaPlay /></Button>
                    </div>

                </Modal.Footer>

            </Modal>

        </div>
  )
};
export default Pregunta;