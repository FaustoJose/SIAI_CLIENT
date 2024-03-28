import Navigation from "@/components/Navigation";

const clienteLayout = ({ children }) => {
    return (
      <div>
        {/* Aquí puedes agregar el encabezado, pie de página u otros elementos comunes */}
        <header><Navigation /></header>
        <main>{children}</main>
        
      </div>
    );
  };
  
  export default clienteLayout;