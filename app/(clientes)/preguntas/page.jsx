"use client"
//import { useState } from 'react';
//import Button from 'react-bootstrap/Button';
//import Modal from 'react-bootstrap/Modal';
import useGet from '@/components/RestHooks/get';
import Pregunta from '@/components/peguntas/pregunta';
//import FAQPage from '@/components/Buscador/FAQP';
function PreguntasPage() {
 
  const endPoint = 'Preguntas/';
  const { data: datas } = useGet(endPoint); 
  const data = datas;
 console.log('los datos de useGet',data)
  return (
    <>
      {/* <FAQPage/> */}
      <Pregunta Datas={data}/>
      
    </>
  );
}

export default PreguntasPage;