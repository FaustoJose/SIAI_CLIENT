"use client";
//import { useRouter } from "next/navigation";
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
//import useSimilitud from '../NaturalNLP/Similitud';
import useGet from '../RestHooks/get';

const Pregunta = ({Datas}) => {


    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState({ question: '', answer: '' });
    const [radioValue, setRadioValue] = useState('1');
//..........................................................
const endPoint = 'Category/';
const { data: datas } = useGet(endPoint); 

    //const [isSpeaking, setIsSpeaking] = useState(true);
   
    //const [similitud, setSimilitud] = useState('');

    //const Simulitud = useSimilitud(Datas,transcript);

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

            if(name!=''){
                voz.text=name;
                window.speechSynthesis.speak(voz)
            }

        } else {
            // El navegador no es compatible con la API de Web Speech
            alert('El navegador no es compatible con la API de Web Speech');
        }
      }

    //......................................
    const handleSpeak = () => {
        decir(modalData.answer)
    };
    //......................................
   
    
    
     
    //......................................
  return( 
        <div className='container'>
            <div className='card' style={{ border: '0px solid black',minWidth:'100%', height:'1rem' }}>
                <div className='row'  style={{minWidth:'10rem', height:'1rem'}}>
                <br />
                        {/* <ButtonGroup>
                            {datas.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                                name="radio"
                                value={radio.category_id.toString()}
                                checked={radioValue === radio.category_id.toString()}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}
                            >
                                {radio.description}
                            </ToggleButton>
                            ))}
                        </ButtonGroup> */}

                </div>
            </div>
            <ul className="list-group">
                {
                    
                        Datas.map((Data)=>(

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
                        
                        ))
                
                }
            </ul>
            <div>
           
            </div>
            <Modal
                size="xl"
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                       {modalData.question}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>
                        {modalData.answer} 
                </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" 
                     onClick={() => { handleSpeak()}}
                    >
                    Leer
                    </Button>
                </Modal.Footer>
            </Modal>

           
        </div>
  )
};
export default Pregunta;