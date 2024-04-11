"use client"


import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
//import { DataService } from './service/DataService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
//import Select from 'react-select';
//......................................
import useGet from '@/components/RestHooks/get';
import usePost from '@/components/RestHooks/post';
import usePut from '@/components/RestHooks/put';
import useDelete from '@/components/RestHooks/delete';
import useGetById from '@/components/RestHooks/getById';

const ParticipantePage = () => {
    let emptyData = {
        participant_id: 0,
        event_id : 0,
        profetion_id:0,
        participant_name: ''
    };
    let emptyData1 = {
        event_id: 0,
        event_name: '',
        event_location: '',
        event_date:null
    };
   
    let emptyData2 = {
        profetion_id: 0,
        description: ''
    };

    const [Datas, setDatas] = useState(null);
    const [DataDialog, setDataDialog] = useState(false);
    const [deleteDataDialog, setDeleteDataDialog] = useState(false);
    const [deleteDatasDialog, setDeleteDatasDialog] = useState(false);
    const [Data, setData] = useState(emptyData);
    const [selectedDatas, setSelectedDatas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(emptyData1);
//.....................................................
    const [profs, setProfs] = useState([]);
    const [prof, setProf] = useState(emptyData2);
//.....................................................


    const endPoint = 'ParticipantesEvento/';
    const endPoint02 = 'RegistroEventos/';
    const endPoint03 = 'Profesion/';
    const { data: datas } = useGet(endPoint); 
    const { data: datas02} = useGet(endPoint02); 
    const { data: datas03} = useGet(endPoint03); 
//.............................................
  useEffect(() => {
    if (datas) {
      setDatas(datas); 
    }
  }, [datas]);
//..............................................
  useEffect(() => {
    if (datas02) {
      setEvents(datas02); 
    }
  }, [datas02]);
//...............................................
useEffect(() => {
    if (datas03) {
        setProfs(datas03); 
    }
  }, [datas03]);
    
//...............................................
    const openNew = () => {
        setEvent(emptyData1);
        setProf(emptyData2);
        setData(emptyData);
        setSubmitted(false);
        setDataDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDataDialog(false);
    };

    const hideDeleteDataDialog = () => {
        setDeleteDataDialog(false);
    };

    const hideDeleteDatasDialog = () => {
        setDeleteDatasDialog(false);
    };

    const saveData = async() => {
         setSubmitted(true);

         if (Data.participant_name.trim()) {
            let _Datas = [...Datas];
            let _Data = { ...Data };

            if (Data.participant_id) {
                try {
                    // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
                    const data = await usePut(endPoint,Data.participant_id, _Data);
                    console.log('Datos actualizados correctamente:', data);
                    const index = _Datas.findIndex(item => item.participant_id === data.participant_id);
                    if (index !== -1) {
                        _Datas[index] = { ..._Data };
                    }
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data Updated', life: 3000 });
                } catch (error) {
                    console.error('Error al enviar los datos:', error);
                }
               
            } else {
                try {
                    // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
                    const data = await usePost(endPoint, _Data);
                    console.log('Datos enviados correctamente:', data);
                    _Datas = [..._Datas, data ];
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data Created', life: 3000 });
                } catch (error) {
                    console.error('Error al enviar los datos:', error);
                }
                
                
            }
    
            setDatas(_Datas);
            setDataDialog(false);
            setData(emptyData);
            
         }
    };

    const editData = (Data) => {
        //.........................................
        const datosEvent = events.filter(item => item.event_id === Data.event_id);
        const datosE=datosEvent[0];
        //.........................................
        const datosProf = profs.filter(item => item.profetion_id === Data.profetion_id);
        const datosP=datosProf[0];
        //.........................................
        setProf({...datosP});
        setEvent({ ...datosE});
        setData({ ...Data });
        setDataDialog(true);
    };

    const confirmDeleteData = (Data) => {
        setData(Data);
        setDeleteDataDialog(true);
    };

    const deleteData = async() => {
        try {
           
            const data = await useDelete(endPoint,Data.participant_id)
            console.log('Datos eliminados correctamente:', data);
            let _Datas = Datas.filter((val) => val.participant_id !== data.participant_id);
            setDatas(_Datas);
            setDeleteDataDialog(false);
            setData(emptyData);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
       
    };

   

   

 

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Data = { ...Data };

        _Data[`${name}`] = val;

        setData(_Data);
    };

    const SelectEventChange = (e,name) => {
           console.log('dato s de e y name',e,name)
        const datosEvent = events.filter(item => item.event_name === e);
        console.log('datosde Event',datosEvent)

        const val = (e) || '';
        let _Data = { ...Data };
        _Data[`${name}`] = datosEvent[0].event_id;
        setData(_Data);
        
        let _event = { ...event };
        _event.event_name = val;
        setEvent(_event);
    };

    const SelectProfChange = (e,name) => {
            console.log('dato s de e y name',e,name)
        const datosProf = profs.filter(item => item.description === e);
        console.log('datosde Prof',datosProf)

        const val = (e) || '';
        let _Data = { ...Data };
        _Data[`${name}`] = datosProf[0].profetion_id;
        setData(_Data);
        
        let _prof = { ...prof };
        _prof.description = val;
        setProf(_prof);
    };
   

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
               
            </div>
        );
    };

    const NombresBodyTemplate = ({participant_name}) => {
        
        return (
          <div  style={{ marginTop: '20px' }}>
          
                <span  style={{ margin: '0.5rem 0', display: 'block' }}>
                   {participant_name}
                </span>
           
          </div>
        );
      };


    const idBodyTemplate = (rowData) => {
        return <Badge value={rowData.participant_id} size="large" ></Badge>;
    };

    const idEventoBodyTemplate = (rowData) => {
      let data = [];
      let result={};
      try {
        // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
        data = useGetById(endPoint02,rowData.event_id);
        result = data.data;
       
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }

      return <div><p>{result.event_name}</p></div>
  };
   
  const idProfesionBodyTemplate = (rowData) => {
    let data = [];
    let result={};
    try {
      // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
      data = useGetById(endPoint03,rowData.profetion_id);
      result = data.data;
     
  } catch (error) {
      console.error('Error al cargar los datos:', error);
  }

    return <div><p>{result.description}</p></div>
};

  

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div style={{padding:'7%',height:'100%'}}>
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" style={{marginRight:'1rem'}} onClick={() => editData(rowData)} />
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteData(rowData)} />
                </div>
            </React.Fragment>
        );
    };


    const header = (
        <div className="flex flex-wrap gap-5 align-items-center justify-content-between">
            <h4 className="m-2">Participantes</h4>
            <span className="p-input-icon-left " >
                <i className="pi pi-search" style={{marginTop:'-7px'}}/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const DataDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveData} />
        </React.Fragment>
    );
    const deleteDataDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDataDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteData} />
        </React.Fragment>
    );
    //.................................
    const options = events.map(item => ({
        value: item.event_name,
    }));

    
      
    const selectedEventTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    {/* <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} /> */}
                    <div>{option.value}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const eventOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                {/* <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} /> */}
                <div>{option.value}</div>
            </div>
        );
    };
//...............................
const optionProf = profs.map(item => ({
    value: item.description,
}));


  
const selectedProfTemplate = (option, props) => {
    if (option) {
        return (
            <div className="flex align-items-center">
                {/* <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} /> */}
                <div>{option.value}</div>
            </div>
        );
    }

    return <span>{props.placeholder}</span>;
};

const profOptionTemplate = (option) => {
    return (
        <div className="flex align-items-center">
            {/* <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} /> */}
            <div>{option.value}</div>
        </div>
    );
};
//...............................
    return (
        <div >
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-3" style={{marginBottom: '2rem'}} left={leftToolbarTemplate} 
               
                ></Toolbar>

                <DataTable ref={dt} value={Datas} 
                        dataKey="participant_id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Datas" globalFilter={globalFilter} header={header}>
                    
                    
                    <Column field="participant_id" header="Id" sortable style={{ minWidth: '8rem' }} body={idBodyTemplate}></Column>
                    <Column field="participant_name" header="Nombres Participantes" sortable style={{ minWidth: '16rem' }} body={NombresBodyTemplate}></Column>
                    <Column field="profetion_id" header="Profesión" sortable style={{ minWidth: '8rem' }} body={idProfesionBodyTemplate}></Column>
                    <Column field="event_id" header="Evento" sortable style={{ minWidth: '8rem' }} body={idEventoBodyTemplate}></Column>

                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    
                </DataTable>
            </div>

            <Dialog visible={DataDialog} style={{ width: '32rem'}} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Participante" modal className="p-fluid" footer={DataDialogFooter} onHide={hideDialog}>

                <div className="field">
                    <label htmlFor="participant_name" className="font-bold">
                        <div>Nombre:</div>
                    </label>
                    <div className="card flex justify-content-center">
                    <InputText id="participant_name" value={Data.participant_name} onChange={(e) => onInputChange(e, 'participant_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !Data.participant_name })} />
                    </div>
                    {submitted && !Data.participant_name && <small className="p-error">Este campo es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="participant_status" className="font-bold">
                        Profesion:
                    </label>
                    <div className="card flex justify-content-center">
                        <Dropdown value={prof.description} onChange={(e) => SelectProfChange(e.value,'profetion_id')} options={optionProf} optionLabel="name" placeholder="Select a Profetion" 
                            filter valueTemplate={selectedProfTemplate} itemTemplate={profOptionTemplate} className="w-full md:w-14rem" />
                    </div> 
                    {submitted && !prof.description && <small className="p-error">La Profecion es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="participant_status" className="font-bold">
                        Eventos:
                    </label>
                    <div className="card flex justify-content-center">
                        <Dropdown value={event.event_name} onChange={(e) => SelectEventChange(e.value,'event_id')} options={options} optionLabel="name" placeholder="Select a Event" 
                            filter valueTemplate={selectedEventTemplate} itemTemplate={eventOptionTemplate} className="w-full md:w-14rem" />
                    </div> 
                    {submitted && !event.event_name && <small className="p-error">El Evento es requerido.</small>}
                </div>

                
               
               

               
            </Dialog>

            <Dialog visible={deleteDataDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDataDialogFooter} onHide={hideDeleteDataDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem',marginRight:'1rem'}} />
                    
                    {Data && (
                        <span>
                            Esta seguro de eliminar este evento <b>{Data.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

           
        </div>
    );
};
export default ParticipantePage;