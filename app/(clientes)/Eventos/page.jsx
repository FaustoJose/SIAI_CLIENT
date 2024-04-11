"use client";
import useGet from "@/components/RestHooks/get";
import { useRouter } from "next/navigation";
import { Tag } from 'primereact/tag';

const EventPage = () => {
    const endPoint = 'RegistroEventos/';
    const { data: data } = useGet(endPoint);

  const router = useRouter();


  const fechaBodyTemplate = (rowData) => {
    const fecha = new Date(rowData); // Crear un objeto Date con la fecha deseada

    const año = fecha.getFullYear(); // Obtener el año de la fecha
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes de la fecha (añadiendo 1 ya que los meses van de 0 a 11)
    const día = String(fecha.getDate()).padStart(2, '0'); // Obtener el día de la fecha

    const fechaFormateada = `${día}/${mes}/${año}`;

    return <div  >{fechaFormateada}</div>
  };




  return( 
   
        <div  className="container">
            <style>
            {`
                .shadow-on-hover:hover {
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Ajusta los valores según lo desees */
                }
            `}
            </style>

            <div className="" style={{ border: '0px solid black',minWidth:'100%', height:'45rem',margin:'1%' }}>
                <div className="card" style={{backgroundColor:'#F8F9F9'}}>
                          <h4>Listados de Eventos</h4>
                </div>
                  <div className="col-12 " >

                    <div className="row">
                    {
                        data.map((Event)=>(
                        <div key={Event.event_id} style={{ border: '0px solid black',margin:'1%',backgroundColor:'#F8F9F9',cursor: 'pointer' }}
                        className="col-12 col-md-3 col-lg-3 card shadow-on-hover"
                        onClick={()=>{
                            router.push(`/ListadoEvento/${Event.event_id}`)
                        }}>
                            <div>
                                <div className='card'
                                style={{border: '0px solid black',backgroundColor:'#F8F9F9' }}>
                                    <h5>{Event.event_name}</h5>
                                </div>
                                <hr/>
                                
                                <div className='card' style={{border: '0px solid black', marginTop: '1rem', backgroundColor:'#F8F9F9' }}>
                                    <p>{Event.event_location}</p>
                                </div>

                                <div className='card' style={{border: '0px solid black',backgroundColor:'#F8F9F9' }}>
                                    <p>{fechaBodyTemplate(Event.event_date)}</p> 
                                </div>
                            </div>
                        
                        </div>
                        ))
                    }
                    </div>
                </div>
            </div>
        </div>
  )
};
export default EventPage;