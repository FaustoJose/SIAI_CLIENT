// import Navigation from "@/components/Navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos básicos de PrimeReact
//import 'primeicons/primeicons.css'; // Iconos de PrimeIcons (opcional)

// Importar estilos de componentes específicos
// import 'primereact/resources/themes/saga-blue/sidebar.css'; // Estilos del Sidebar
// import 'primereact/resources/themes/saga-blue/menubar.css'; // Estilos del Menubar
// import 'primereact/resources/themes/saga-blue/tabview.css'; // Estilos del TabView
// Agrega más importaciones de estilos según los componentes que utilices
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://bootswatch.com/5/flatly/bootstrap.min.css" />
      </head>
      <body className={inter.className}>
        {/* <Navigation />  */}
        <div className="container p-4">
        {children}
        </div>
        </body>
    </html>
  );
}