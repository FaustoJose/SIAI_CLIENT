import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
//import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import usePost from '@/components/RestHooks/post';
import useGet from '@/components/RestHooks/get';
import usePut from '@/components/RestHooks/put';


function DiscursoComponent({show,setShow,setInicio,Event_id}) {
   
   
    let data = {
        Id :0,
        event_id:Number(Event_id),
        Titulo :'INICIO DE PRESENTACIÓN',
        Text :'',
        TipoDiscurso:'INICIO'
        }
    
  const [Data, setData] = useState(data);
  const [Datas, setDatas] = useState([]);
  const [validated, setValidated] = useState(false);

  const endPoint = 'Mensaje/';
  const { data: datas } = useGet(endPoint); 
 
  useEffect(() => {
    if (datas) {
      setDatas(datas); 
    }
  }, [datas]);

  const datoFilter = Datas.filter(item => item.event_id === Number(Event_id) && item.TipoDiscurso === 'INICIO');
  //console.log('datos de dataupdate',datoUpdate);
  
  const _datas = datoFilter[0];
  
  useEffect(() => {
    if (_datas) {
      setData(_datas); 
    }
  }, [_datas]);

  useEffect(() => {
    if (_datas) {
      setInicio(_datas); 
    }
  }, [_datas]);

   let Id = 0;
   Id = _datas != undefined ? _datas.Id:0;
  console.log('datos de datas',_datas,Id);
  
  

  const handleClose = () => setShow(false);


  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _Data = { ...Data };

    _Data[`${name}`] = val;

    setData(_Data);
  };
  
  const handleSubmit = async(event)=>{
    //const form = event.currentTarget;
    if (Data.Text === '') {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        return;
    }
         
    let _Datas = [...Datas];
    let _Data = { ...Data };

         if(Id != 0 && data.event_id === Number(Event_id) && data.TipoDiscurso === 'INICIO'){
            try{
                const datos =  await usePut(endPoint,Id,Data)
                console.log('Datos actualizados correctamente:', datos);
                    const index = _Datas.findIndex(item => item.Id === datos.Id);
                    if (index !== -1) {
                        _Datas[index] = { ..._Data };
                    }
            }catch (error) {
                console.error('Error al enviar los datos:', error);
            }
        }
        else{

            try{
                console.log('datos de Data',Data)
                const datos =  await usePost(endPoint,Data)
                _Datas = [..._Datas, datos ];
                
            }catch (error) {
                console.error('Error al enviar los datos:', error);
            }
        }
        setDatas(_Datas);
        handleClose();
  }

  return (
    <div>
      

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>INICIO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} >
            <Row>
            <Form.Group className="mb-3" controlId="Form.ControlInput1">
              <Form.Label>TITULO</Form.Label>
              <Form.Control
                type="text"
                placeholder="INICIO DE PRESENTACIÓN"
                value={Data.Titulo}
                onChange={(e)=>onInputChange(e,'Titulo')}
                disabled
              />
            </Form.Group>

            <Form.Group
              as={Col}
              className="mb-3"
              controlId="Form.ControlTextarea1"
            >
              <Form.Label>MENSAJE</Form.Label>
              <Form.Control 
              as="textarea" 
              rows={5} 
              value={Data.Text}
              onChange={(e)=>onInputChange(e,'Text')}
              required
              />
            <Form.Control.Feedback type="invalid">
                    El campo MENSAJE es requerido.
            </Form.Control.Feedback>
            </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DiscursoComponent;

