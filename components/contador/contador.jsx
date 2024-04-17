
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
//import Form from 'react-bootstrap/Form';
import { FaChevronRight,FaChevronLeft } from "react-icons/fa";

const Contador = ({contador,setContador}) => {

    //const [contador, setContador] = useState(3);

const Sumar =()=>{
    setContador(contador+1);
}
   
const Restar=()=>{
    setContador(contador-1);
}

  return <div className='card'>
           
           
            
            <div className='row '>
                
                    <div className='col-4 text-center'>
                    <Button variant="outline-primary" onClick={Restar}><FaChevronLeft /></Button>
                    </div>
                    <div className='col-4'> <h4 className='text-center'  >{contador}</h4></div>
                    <div className='col-4 text-center'>
                    <Button variant="outline-primary" onClick={Sumar}><FaChevronRight /></Button>
                    </div>
                </div>
            
         </div>;
};
export default Contador;