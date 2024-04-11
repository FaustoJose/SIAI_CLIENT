// import Image from "next/image";

// //import styles from "./page.module.css";
// import Users from "@/components/Users";


// const fetchUsers=async()=>{
//   const res = await fetch("https://reqres.in/api/users");
//   const data =await res.json();
//   return data.data
// }

// export default async function Home() {
//   const users = await fetchUsers();
//   return (
    
//     <div>
//       <Users  users={users}/> 
//     </div>
//   );
// }
"use client"

import useGet from '@/components/RestHooks/get';
import Pregunta from '@/components/peguntas/pregunta';

function PreguntasPage() {
 
  const endPoint = 'Preguntas/';
  const { data: datas } = useGet(endPoint); 
  const data = datas;
 console.log('los datos de useGet',data)
  return (
    <>
      
      <Pregunta Datas={data}/>
      
    </>
  );
}

export default PreguntasPage;