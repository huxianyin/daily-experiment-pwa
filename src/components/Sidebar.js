import React from 'react'
import {SidebarData} from './SidebarData';
import "../css/Sidebar.css"

export function Sidebar() {
  return (
    <div className='Sidebar'>
      <ul className='SidebarList'>
        {SidebarData.map((value,key) => {
            return (<li key={key} className="row" onClick={()=>{
                window.location.pathname=value.link;
            }}>
                <img id='icon' src={process.env.PUBLIC_URL + "/" + value.icon}></img>
                <div id="title"> {value.title}</div>
            </li>)
        })}
        
      </ul>
    </div>
  )
}


