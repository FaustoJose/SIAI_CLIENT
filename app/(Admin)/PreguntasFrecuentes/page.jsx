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
//import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { ScrollPanel } from 'primereact/scrollpanel';

//......................................
import useGet from '@/components/RestHooks/get';
import usePost from '@/components/RestHooks/post';
import usePut from '@/components/RestHooks/put';
import useDelete from '@/components/RestHooks/delete';
import useGetById from '@/components/RestHooks/getById';

import { Dropdown } from 'primereact/dropdown';

const PreguntasPage = () => {
    let emptyData = {
        faq_id: 0,
        question: '',
        answer: ''
    };

    let emptyData1 = {
        category_id: 0,
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

    const [categorys, setCategorys] = useState([]);
    const [category, setCategory] = useState(emptyData1);


    const endPoint = 'Preguntas/';
    const endPoint02 = 'Category/';
    const { data: datas } = useGet(endPoint); 
    const { data: datas02} = useGet(endPoint02); 

  useEffect(() => {
    if (datas) {
      setDatas(datas); 
    }
  }, [datas]);

  useEffect(() => {
    if (datas02) {
        setCategorys(datas02); 
    }
  }, [datas02]);

    
 
    const openNew = () => {
        setCategory(emptyData1);
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

         if (Data.question.trim()) {
            let _Datas = [...Datas];
            let _Data = { ...Data };

            if (Data.faq_id) {
                try {
                    // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
                    const data = await usePut(endPoint,Data.faq_id, _Data);
                    console.log('Datos actualizados correctamente:', data);
                    const index = _Datas.findIndex(item => item.faq_id === data.faq_id);
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

        const datosCategory = categorys.filter(item => item.category_id === Data.category_id);
        const datoCat=datosCategory[0];
        //.........................................
        setCategory({...datoCat});
        setData({ ...Data });
        setDataDialog(true);
    };

    const confirmDeleteData = (Data) => {
        setData(Data);
        setDeleteDataDialog(true);
    };

    const deleteData = async() => {
        try {
           
            const data = await useDelete(endPoint,Data.faq_id)
            console.log('Datos eliminados correctamente:', data);
            let _Datas = Datas.filter((val) => val.faq_id !== data.faq_id);
            setDatas(_Datas);
            setDeleteDataDialog(false);
            setData(emptyData);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
       
    };

   

    const deleteSelectedDatas = () => {
        let _Datas = Datas.filter((val) => !selectedDatas.includes(val));

        setDatas(_Datas);
        setDeleteDatasDialog(false);
        setSelectedDatas(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Datas Deleted', life: 3000 });
    };

 

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Data = { ...Data };

        _Data[`${name}`] = val;

        setData(_Data);
    };

    const SelectCategoryChange = (e,name) => {
        console.log('dato s de e y name',e,name)
     const datosCat = categorys.filter(item => item.description === e);
     console.log('datos de ',datosCat)

     const val = (e) || '';
     let _Data = { ...Data };
     _Data[`${name}`] = datosCat[0].category_id;
     setData(_Data);
     
     let _category = { ...category };
     _category.description = val;
     setCategory(_category);
 };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
               
            </div>
        );
    };

    const idCategoryBodyTemplate = (rowData) => {
        let data = [];
        let result={};
        try {
          // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
          data = useGetById(endPoint02,rowData.category_id);
          result = data.data;
         
      } catch (error) {
          console.error('Error al cargar los datos:', error);
      }
  
        return <div><p>{result.description}</p></div>
    };
   
    const idBodyTemplate = (rowData) => {
        return <Badge value={rowData.faq_id} size="large" ></Badge>;
    };

    const RepuestaBodyTemplate = ({answer}) => {
        
      
        return (
          <div className='card' style={{ marginTop: '20px' }}>
          <ScrollPanel style={{ width: '100%', height: '60px' }}>
              {/* Mapear cada nombre en el array y renderizarlo dentro de un span */}
              
                <span  style={{ margin: '0.5rem 0', display: 'block' }}>
                   {answer}
                </span>
             
          </ScrollPanel>
          </div>
        );
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
            <h4 className="m-2">Preguntas frecuentes</h4>
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

     //.................................
     const optionsCategory = categorys.map(item => ({
        value: item.description,
    }));

    
      
    const selectedCategoryTemplate = (option, props) => {
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

    const categoryOptionTemplate = (option) => {
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
                        dataKey="faq_id"  paginator rows={3} rowsPerPageOptions={[3,5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Preguntas Frecuentes" globalFilter={globalFilter} header={header}>
                    
                    
                    <Column field="faq_id" header="Id" sortable style={{ minWidth: '16rem' }} body={idBodyTemplate}></Column>
                    <Column field="category_id" header="Categoría" sortable style={{ minWidth: '12rem' }} body={idCategoryBodyTemplate}></Column>
                    <Column field="question" header="Preguntas frecuentes" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="answer" header="Respuestas"  sortable style={{ minWidth: '8rem' }} body={RepuestaBodyTemplate}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '16rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={DataDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Pregunta y Respuesta" modal className="p-fluid" footer={DataDialogFooter} onHide={hideDialog}>
                


               <div className="field">
                    <label htmlFor="participant_status" className="font-bold">
                       Categoría:
                    </label>
                    <div className="card flex justify-content-center">
                        <Dropdown value={category.description} onChange={(e) => SelectCategoryChange(e.value,'category_id')} options={optionsCategory} optionLabel="name" placeholder="Select a Catagory" 
                            filter valueTemplate={selectedCategoryTemplate} itemTemplate={categoryOptionTemplate} className="w-full md:w-14rem" />
                    </div> 
                    {submitted && !category.description && <small className="p-error">La Categoría es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="question" className="font-bold">
                        Pregunta:
                    </label>
                    <div className="card flex justify-content-center">
                         <InputText id="question" value={Data.question} onChange={(e) => onInputChange(e, 'question')} required autoFocus className={classNames({ 'p-invalid': submitted && !Data.question })} />
                    </div>
                    {submitted && !Data.question && <small className="p-error">La pregunta es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="answer" className="font-bold">
                        Respuesta:
                    </label>
                    <div className="card flex justify-content-center">
                       <InputTextarea id="answer" value={Data.answer} onChange={(e) => onInputChange(e, 'answer')} required autoFocus rows={3} cols={20} className={classNames({ 'p-invalid': submitted && !Data.answer })}/>
                    </div>
                    {submitted && !Data.answer && <small className="p-error">La respuesta es requerida.</small>}
                </div>

               
            </Dialog>

            <Dialog visible={deleteDataDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteDataDialogFooter} onHide={hideDeleteDataDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem',marginRight:'1rem'}} />
                    
                    {Data && (
                        <span>
                             ¿Seguro que quieres eliminar esta pregunta: <b>{Data.question}</b>
                        </span>
                    )}
                </div>
            </Dialog>

           
        </div>
    );
};
export default PreguntasPage;