"use client"
import React,{useState} from 'react';
// import { Sidebar } from 'primereact/sidebar';
// import { Menu } from 'primereact/menu';
// import { Button } from 'primereact/button';
import Link from 'next/link';
import Image from 'next/image';
import { MdDashboard } from "react-icons/md";
import {FaFileCircleQuestion} from "react-icons/fa6";
import { AiFillProfile } from "react-icons/ai";
import { BsCalendarEventFill } from "react-icons/bs";
import { FaPeopleArrows } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { MdMenuOpen } from "react-icons/md";



const Sidebar = () => {


    const sidebarItems=[ 
        // {
        //     name:"Dashboard",
        //     href:"/Dashboard",
        //     icon:MdDashboard,
        // },
        {
            name:"Preguntas Frecuentes",
            href:"/PreguntasFrecuentes",
            icon:FaFileCircleQuestion,
        },
        {
            name:"Eventos",
            href:"/Evento",
            icon:BsCalendarEventFill,
        },
        {
            name:"Participantes",
            href:"/Participantes",
            icon:FaPeopleArrows,
        },
        {
            name:"Profesión",
            href:"/Profesion",
            icon:AiFillProfile,
        },
        {
            name:"Categorías",
            href:"/Category",
            icon:MdCategory,
        }
    ]
   
   const [isCollapsedSidebar,setIsCollapseSidebar]= useState(false)
 

  


  const toogleSidebarCollapseHandler =()=>{
    setIsCollapseSidebar((prev)=>!prev);
  }
  return (

        <div className='sidebar_wrapper'>
            <button className='sidebar_btn' onClick={toogleSidebarCollapseHandler}>
            <MdMenuOpen />
            </button>
            <div className='sidebar' data-collapse={isCollapsedSidebar}>
                <div className='sidebar_top'>
                    <Image src='/logo.jpg' width={80} height={80} className='sidebar_logo' alt='logo' />
                    <p className='sidebar_logo-name'>SIAI</p>
                </div>
                
                <ul className='sidebar_list'>
                    {sidebarItems.map(({name,href,icon: Icon})=>(
                        <li className='sidebar_items' key={name}>
                        
                                <Link href={href} className='sidebar_link' >
                                    <span className='sidebar_icon text-sm'>
                                        <Icon />
                                        {/* <MdDashboard /> */}
                                    </span>
                                    <span className='sidebar_name'>{name}</span>
                                </Link>
                            
                        </li>
                    ))}
                </ul>
            </div>
        </div>
       
  )
};
export default Sidebar;