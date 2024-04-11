import Sidebar from "@/components/Sidebar";
//
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos básicos de PrimeReact
import 'primeicons/primeicons.css'; 
 
//import 'bootstrap/dist/css/bootstrap.min.css';


const AdminLayout = ({ children }) => {
    return (
      <div  className="layout">
        {/* Aquí puedes agregar el encabezado, pie de página u otros elementos comunes */}
        <Sidebar />
        <main style={{width: '100%',
                      height: '100vh', /* Esto hace que ocupe toda la altura de la ventana */
                      display: 'flex',
                      flexDirection: 'column'}} >
          {children}
        </main>
        
      </div>
    );
  };
  
  export default AdminLayout;