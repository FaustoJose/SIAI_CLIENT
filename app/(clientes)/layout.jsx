import Navigation from "@/components/HeaderClient";
import 'bootstrap/dist/css/bootstrap.min.css';



const clienteLayout = ({ children }) => {
    return (
      <> 
        
      <div>
        
        <Navigation />
        <main>{children}</main>
        
      </div>
      </>
    );
  };
  
  export default clienteLayout;