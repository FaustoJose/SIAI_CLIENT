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

const ProfesionPage = () => {
    let emptyData = {
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

    const endPoint = 'Category/';
    const { data: datas } = useGet(endPoint); 
  

  useEffect(() => {
    if (datas) {
      setDatas(datas); 
    }
  }, [datas]);

  

    
 
    const openNew = () => {
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

         if (Data.description.trim()) {
            let _Datas = [...Datas];
            let _Data = { ...Data };

            if (Data.category_id) {
                try {
                    // Llama a usePost con el nombre del endpoint y el cuerpo de la solicitud
                    const data = await usePut(endPoint,Data.category_id, _Data);
                    console.log('Datos actualizados correctamente:', data);
                    const index = _Datas.findIndex(item => item.category_id === data.category_id);
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
        setData({ ...Data });
        setDataDialog(true);
    };

    const confirmDeleteData = (Data) => {
        setData(Data);
        setDeleteDataDialog(true);
    };

    const deleteData = async() => {
        try {
           
            const data = await useDelete(endPoint,Data.category_id)
            console.log('Datos eliminados correctamente:', data);
            let _Datas = Datas.filter((val) => val.category_id !== data.category_id);
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

    

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
               
            </div>
        );
    };

   
    const idBodyTemplate = (rowData) => {
        return <Badge value={rowData.category_id} size="large" ></Badge>;
    };

    // const RepuestaBodyTemplate = ({answer}) => {
        
      
    //     return (
    //       <div className='card' style={{ marginTop: '20px' }}>
    //       <ScrollPanel style={{ width: '100%', height: '60px' }}>
    //           {/* Mapear cada nombre en el array y renderizarlo dentro de un span */}
              
    //             <span  style={{ margin: '0.5rem 0', display: 'block' }}>
    //                {answer}
    //             </span>
             
    //       </ScrollPanel>
    //       </div>
    //     );
    //   };

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
            <h4 className="m-2">Categorias</h4>
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
                        dataKey="category_id"  paginator rows={3} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Datas" globalFilter={globalFilter} header={header}>
                    
                    
                    <Column field="category_id" header="Id" sortable style={{ minWidth: '16rem' }} body={idBodyTemplate}></Column>
                    <Column field="description" header="Categorias" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={DataDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Categoria" modal className="p-fluid" footer={DataDialogFooter} onHide={hideDialog}>
               
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                      Categoria:
                    </label>
                    <div className="card flex justify-content-center">
                         <InputText id="description" value={Data.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !Data.description })} />
                    </div>
                    {submitted && !Data.description && <small className="p-error">La Categoria es requerida.</small>}
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
export default ProfesionPage;