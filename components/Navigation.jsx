import Link from "next/link";

const Navigation = () => {
  return <div>
    
      

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" href="/">Pregunatas Frecuentes</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                
                    
                    <li className="nav-item">
                    <Link className="nav-link" href="/services">Servicios</Link>
                    </li>
                
                </ul>
                </div>
            </div>
        </nav>


  </div>;
};
export default Navigation;