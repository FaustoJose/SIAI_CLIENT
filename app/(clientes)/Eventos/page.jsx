"use client";
import useGet from "@/components/RestHooks/get";
import { useRouter } from "next/navigation";

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

            <div className="card" style={{ border: '0px solid black',width:'100%', height:'auto',margin:'1%' }}>
            <div className='col-12  card' style={{  height:'auto', marginBottom: '1rem',backgroundColor:'#D6DBDF' }}>
                          <h4>Listados de Eventos</h4>
                </div>
                  <div className="col-12 " >

                    <div className="row">
                    {
                        data.map((Event)=>(
                        <div key={Event.event_id} 
                        className="col-12 col-md-3 col-lg-4 text-center"
                        onClick={()=>{
                            router.push(`/ListadoEvento/${Event.event_id}`)
                        }}>
                            <div className="card shadow-on-hover" style={{ cursor: 'pointer' }}>
                                <div className='card'
                                style={{border: '0px solid black',backgroundColor:'#fff' }}>
                                    <h5>{Event.event_name}</h5>
                                </div>
                                <hr/>
                                
                                <div className='card' style={{border: '0px solid black', marginTop: '1rem', backgroundColor:'#fff' }}>
                                    <p>{Event.event_location}</p>
                                </div>

                                <div className='card' style={{border: '0px solid black',backgroundColor:'#fff' }}>
                                    <p>{fechaBodyTemplate(Event.event_date)}</p> 
                                </div>
                            </div>
                        
                        </div>
                        ))
                    }
                    <hr/>
                    </div>
                   
                </div>
            </div>
        </div>
  )
};
export default EventPage;