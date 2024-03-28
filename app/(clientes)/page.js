import Image from "next/image";
//import styles from "./page.module.css";
import Users from "@/components/Users";
const fetchUsers=async()=>{
  const res = await fetch("https://reqres.in/api/users");
  const data =await res.json();
  return data.data
}

export default async function Home() {
  const users = await fetchUsers();
  return (
    
    <div>
      <Users  users={users}/> 
    </div>
  );
}
