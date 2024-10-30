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
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { Badge } from 'primereact/badge';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import * as XLSX from 'xlsx';
//......................................
import useGet from '@/components/RestHooks/get';
import usePost from '@/components/RestHooks/post';
import usePut from '@/components/RestHooks/put';
import useDelete from '@/components/RestHooks/delete';

const EventoPage = () => {
    let emptyData = {
        event_id: 0,
        event_name: '',
        event_location: '',
        event_date:null
    };

    let emptyData2 = {
        profetion_id: 0,
        description: ''
    };
    let emptyparticipantes = {
        participant_id: 0,
        event_id : 0,
        Img_id :0,
        profetion_id:0,
        participant_name: '',
        academic_degree:''
    };

    const [Datas, setDatas] = useState(null);
    const [DataDialog, setDataDialog] = useState(false);
    const [fileDialog, setFileDialog] = useState(false);
    const [deleteDataDialog, setDeleteDataDialog] = useState(false);
    const [deleteDatasDialog, setDeleteDatasDialog] = useState(false);
    const [Data, setData] = useState(emptyData);
    const [DataFile, setDataFile] = useState(emptyData);
    const [selectedDatas, setSelectedDatas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [date, setDate] = useState(null);
    const toast = useRef(null);
    const fileInputRef = useRef(null);
    const imgInputRef = useRef(null);
    const dt = useRef(null);

    //.....................................................
    const [profs, setProfs] = useState([]);
    const [prof, setProf] = useState(emptyData2);
    //.....................................................
    const [imgs, setImgs] = useState(null);
    const [records, setRecords] = useState([]);
    //.....................................................
    const endPointParticipantes = 'ParticipantesEvento/';
    const endPoint03 = 'Profesion/';
    const endPoint = 'RegistroEventos/';
    const endPoint04 = 'UploadImg/';
    const endPoint05 = 'ImgParticipante/';
    const { data: datas } = useGet(endPoint); 
    const { data: profecion } = useGet(endPoint03); 
    const { data: datas04} = useGet(endPoint05);
  useEffect(() => {
    if (datas) {
      setDatas(datas); 
    }
  }, [datas]);

  useEffect(() => {
    if (profecion) {
        setProfs(profecion); 
    }
  }, [profecion]);

  useEffect(() => {
    if (datas04) {
        setImgs(datas04); 
    }
  }, [datas04]);
    
 
    const openNew = () => {
        setData(emptyData);
        setSubmitted(false);
        setDataDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDataDialog(false);
    };
    const hideFileDialog = () => {
        setSubmitted(false);
        setFileDialog(false);
    };

    const hideDeleteDataDialog = () => {
        setDeleteDataDialog(false);
    };

    const hideDeleteDatasDialog = () => {
        setDeleteDatasDialog(false);
    };

    const saveData = async() => {
         setSubmitted(true);

         if (Data.event_name.trim()) {
            let _Datas = [...Datas];
            let _Data = { ...Data };

            if (Data.event_id) {
                try {
                    // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
                    const data = await usePut(endPoint,Data.event_id, _Data);
                    console.log('Datos actualizados correctamente:', data);
                    const index = _Datas.findIndex(item => item.event_id === data.event_id);
                    if (index !== -1) {
                        _Datas[index] = { ..._Data };
                    }
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Evento Actualizado', life: 3000 });
                } catch (error) {
                    console.error('Error al enviar los datos:', error);
                }
               
            } else {
                try {
                    // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
                    const data = await usePost(endPoint, _Data);
                    console.log('Datos enviados correctamente:', data);
                    _Datas = [..._Datas, data ];
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Evento Creado', life: 3000 });
                } catch (error) {
                    console.error('Error al enviar los datos:', error);
                }
                
                
            }
    
            setDatas(_Datas);
            setDataDialog(false);
            setData(emptyData);
            
         }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            processRecords(jsonData);
          };
          reader.readAsArrayBuffer(file);
        }
      };
    
      const processRecords = (data) => {
        const processedData = data.map(record => ({
          participant_name: record.Nombre+'_'+record.Matrícula,
          academic_degree: record.Honor,
        }));
        setRecords(processedData);
      };
      const saveFile = async () => {
        try {
            let _Imgs = [...imgs];
    
            const names = records.map(record => record.participant_name);
    
            const fileList = imgInputRef.current.files;
    
            if (fileList.length > 0) {
                const fileNames = Array.from(fileList).map(file => file.name);
                const cleanFileNames = fileNames.map(name => name.substring(0, name.lastIndexOf('.')));
                const allNamesExist = names.every(name => cleanFileNames.includes(name));
    
                if (!allNamesExist) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Not all required files are selected', life: 3000 });
                    return;
                }
    
                const formData = new FormData();
    
                Array.from(fileList).forEach(file => {
                    formData.append('file', file);
                });
    
                const imgResponse = await usePost(endPoint04, formData);
                console.log('Imagenes enviadas correctamente:', imgResponse);
    
                // Procesar las respuestas de las imágenes enviadas
                const imgRegistrations = await Promise.all(imgResponse.map(async img => {
                    try {
                        const imgReg = await usePost(endPoint05, img);
                        console.log('Imagen registrada correctamente:', imgReg);
                        return imgReg;
                    } catch (error) {
                        console.error('Error al registrar la imagen:', error);
                        throw error; // Puedes manejar el error según tu lógica
                    }
                }));
                console.log('datos imgregistro',imgRegistrations)
                _Imgs = [..._Imgs,...imgRegistrations];
                console.log('datos imgregistro _Imgs',_Imgs)
                setImgs(_Imgs);
            }
    
            // Procesar cada registro y enviarlos
            await Promise.all(records.map(async record => {
                try {
                    console.log('datos imagen',imgs)
                    const datosImg = imgs.find(item => {
                        const data = item.Img_name;
                        const CleanData = data.substring(0, data.lastIndexOf('.'));
                        return CleanData === record.participant_name;
                    });
    
                    if (!datosImg) {
                        console.error(`No se encontró la imagen para ${record.participant_name}`);
                        return;
                    }
    
                    // Ejemplo de cómo podrías guardar los datos en el servidor
                    const dataToSend = {
                        event_id: DataFile.event_id,
                        Img_id: datosImg.Img_id,
                        profetion_id: prof.profetion_id,
                        participant_name: record.participant_name,
                        academic_degree: record.academic_degree
                    };
    
                    const data = await usePost(endPointParticipantes, dataToSend);
                    console.log('Datos enviados correctamente:', data);
                } catch (error) {
                    console.error('Error al enviar el registro:', error);
                    throw error; // Puedes manejar el error según tu lógica
                }
            }));
    
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Participantes Guardados', life: 3000 });
            setFileDialog(false);
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    const editData = (Data) => {
        setData({ ...Data });
        setDataDialog(true);
    };

    const saveFileData = (Data) => {
        setDataFile({ ...Data });
        setFileDialog(true);
    };

    const confirmDeleteData = (Data) => {
        setData(Data);
        setDeleteDataDialog(true);
    };

    const deleteData = async() => {
        try {
           
            const data = await useDelete(endPoint,Data.event_id)
            console.log('Datos eliminados correctamente:', data);
            let _Datas = Datas.filter((val) => val.event_id !== data.event_id);
            setDatas(_Datas);
            setDeleteDataDialog(false);
            setData(emptyData);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Evento Borrado', life: 3000 });
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
       
    };

   

    const deleteSelectedDatas = () => {
        let _Datas = Datas.filter((val) => !selectedDatas.includes(val));

        setDatas(_Datas);
        setDeleteDatasDialog(false);
        setSelectedDatas(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Evento Borrado', life: 3000 });
    };

 

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Data = { ...Data };

        _Data[`${name}`] = val;

        setData(_Data);
    };

    const SelectProfChange = (e,name) => {
        console.log('dato s de e y name',e,name)
    const datosProf = profs.filter(item => item.description === e);
    console.log('datosde Prof',datosProf)

    const val = (e) || '';
    // let _Data = { ...Data };
    // _Data[`${name}`] = datosProf[0].profetion_id;
    // setData(_Data);
    
    let _prof = { ...prof };
    _prof.description = val;
    _prof.profetion_id = datosProf[0].profetion_id;
    setProf(_prof);
};

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
               
            </div>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return  <div>
                      
                      <p>
                          {rowData.event_name}
                       </p>
                </div>
    };

    const lugarBodyTemplate = (rowData) => {
      return  <div>
                     
                        <p>
                        {rowData.event_location}
                        </p>
                    
              </div>
  };

    

    const idBodyTemplate = (rowData) => {
      return <Badge value={rowData.event_id} size="large" ></Badge>;
  };

    

    const fechaBodyTemplate = (rowData) => {
      const fecha = new Date(rowData.event_date); // Crear un objeto Date con la fecha deseada

      const año = fecha.getFullYear(); // Obtener el año de la fecha
      const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes de la fecha (añadiendo 1 ya que los meses van de 0 a 11)
      const día = String(fecha.getDate()).padStart(2, '0'); // Obtener el día de la fecha

      const fechaFormateada = `${día}/${mes}/${año}`;

      return <div><Tag style={{padding:'4%',height:'100%'}} readOnly  value={fechaFormateada} ></Tag></div>
    };

    const formatDate = (dateString) => {
      const fecha = new Date(dateString); // Crear un objeto Date a partir de la cadena de fecha
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const día = String(fecha.getDate()).padStart(2, '0');
      return `${día}/${mes}/${año}`;
  };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
              <div style={{padding:'7%',height:'80px'}}>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" style={{marginRight:'1rem'}} onClick={() => editData(rowData)} />
                <Button icon="pi pi-save" rounded outlined className="mr-2" style={{marginRight:'1rem'}} onClick={() => saveFileData(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteData(rowData)} />
              </div>
            </React.Fragment>
        );
    };

    // const getSeverity = (Data) => {
    //     switch (Data.inventoryStatus) {
    //         case 'INSTOCK':
    //             return 'success';

    //         case 'LOWSTOCK':
    //             return 'warning';

    //         case 'OUTOFSTOCK':
    //             return 'danger';

    //         default:
    //             return null;
    //     }
    // };

    const header = (
        <div className="flex flex-wrap gap-5 align-items-center justify-content-between">
            <h4 className="m-2">Eventos</h4>
            <span className="p-input-icon-left " >
                <i className="pi pi-search" style={{marginTop:'-7px'}}/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );
    const DataDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveData} />
        </React.Fragment>
    );

    const FileDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideFileDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveFile} />
        </React.Fragment>
    );

    const deleteDataDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDataDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteData} />
        </React.Fragment>
    );
    const deleteDatasDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDatasDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedDatas} />
        </React.Fragment>
    );

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
                // right={rightToolbarTemplate}
                ></Toolbar>

                <DataTable ref={dt} value={Datas} 
                // selection={selectedDatas} 
                // onSelectionChange={(e) => setSelectedDatas(e.value)}
                        dataKey="event_id"  paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Eventos" globalFilter={globalFilter} header={header}>
                    
                    
                    <Column field="event_id" header="Id" sortable style={{ minWidth: '16rem' }} body={idBodyTemplate}></Column>
                    <Column field="event_name" header="Nombre del Evento" sortable style={{ minWidth: '16rem' }} body={nombreBodyTemplate}></Column>
                    <Column field="event_location" header="Lugar"  sortable style={{ minWidth: '8rem' }} body={lugarBodyTemplate}></Column>
                    <Column field="event_date" header="Fecha"  sortable style={{ minWidth: '8rem' }}  body={fechaBodyTemplate}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

                   
                </DataTable>
            </div>

            <Dialog visible={DataDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Evento" modal className="p-fluid" footer={DataDialogFooter} onHide={hideDialog}>
                
                <div className="field">
                    <label htmlFor="event_name" className="font-bold">
                        Nombre:
                    </label>
                    <div className="card flex justify-content-center">
                        <InputText id="event_name" value={Data.event_name} onChange={(e) => onInputChange(e, 'event_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !Data.event_name })} />
                    </div>
                    {submitted && !Data.event_name && <small className="p-error">El nombre es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="event_location" className="font-bold">
                        Ubicación:
                    </label>
                    <div className="card flex justify-content-center">
                        <InputTextarea id="event_location" value={Data.event_location} onChange={(e) => onInputChange(e, 'event_location')} required autoFocus rows={4} cols={20} className={classNames({ 'p-invalid': submitted && !Data.event_location })}/>
                    </div>
                    {submitted && !Data.event_location && <small className="p-error">El lugar es requerida.</small>}
                </div>
                <div className="flex-auto">
                    <label htmlFor="event_date" className="font-bold block mb-2">
                        Fecha: {Data.event_date && formatDate(Data.event_date)}
                    </label>
                        <div className="card flex justify-content-center">
                              <span className="">
                                  <Calendar id="event_date" value={Data.event_date} onChange={(e) => onInputChange(e, 'event_date')} required showIcon dateFormat="dd/mm/yy" inputTemplate={() => <input type="text" value="Texto personalizado" readOnly />}  className={classNames({ 'p-invalid': submitted && !Data.event_date })}/>
                                  {/* <label htmlFor="event_date">{formatDate(Data.event_date)}</label> */}
                              </span>
                        </div>
                    {submitted && !Data.event_date && <small className="p-error">La fecha es requerida.</small>}
                </div>
                
            </Dialog>

            {/* //............................................................................. */}
            <Dialog visible={fileDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Evento" modal className="p-fluid" footer={FileDialogFooter} onHide={hideFileDialog}>
                
                <div className="field">
                    <label htmlFor="event_name" className="font-bold">
                        {`Cargar Imagenes con los nombres de los participantes y sus matrículas:`}
                    </label>
                    <div className="card flex justify-content-center">
                        <input type="file"   accept=".jpg" multiple  ref={imgInputRef} id="event_name"   required autoFocus  />
                    </div>
                    {submitted && !Data.event_name && <small className="p-error">El nombre es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="event_name" className="font-bold">
                        {`Cargar Archivo (Excel) con los nombres, matrículas y honor de los participantes:`}
                    </label>
                    <div className="card flex justify-content-center">
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} id="event_name"   required autoFocus  />
                    </div>
                    {submitted && !Data.event_name && <small className="p-error">El nombre es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="participant_status" className="font-bold">
                       Profesión:
                    </label>
                    <div className="card flex justify-content-center">
                        <Dropdown value={prof.description} onChange={(e) => SelectProfChange(e.value,'profetion_id')} options={optionProf} optionLabel="name" placeholder="Selecciona una Profesión" 
                            filter valueTemplate={selectedProfTemplate} itemTemplate={profOptionTemplate} className="w-full md:w-14rem" />
                    </div> 
                    {submitted && !prof.description && <small className="p-error">La Profecion es requerido.</small>}
                </div>
                
                
            </Dialog>
            {/* //............................................................................. */}

            <Dialog visible={deleteDataDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteDataDialogFooter} onHide={hideDeleteDataDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem',marginRight:'1rem'}} />
                    
                    {Data && (
                        <span>
                            ¿Seguro que quieres eliminar a este evento: <b>{Data.event_name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

           
        </div>
    );
};
export default EventoPage;