import React from 'react';
import {Link} from 'react-router-dom';
import './Sidebar.css';
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary';
import { API, saveSidebarState, savePrivilege, LOGO } from '../Util/common';
import Cookie from 'js-cookie'
import Modal from '../Util/ModalAndLogin/Modal';
export default ({sidebarIndex, onClick, toggleSidebar, isSidebarOpen}) => {
  let menuNames   = ["Home", "Company", "Employees", "Offices", "Roles", "Positions", "Absences", "Report", "Permissions"];
  let menuIcons   = ["fa-home", "fa-cogs", "fa-users", "fa-building", "fa-users-cog", "fa-list", "fa-money-check", "fa-chart-bar", "fa-tasks"];
  let target      = ["/", "/company", "/employees", "/offices", "/roles", "/positions", "/absences", "/report", "/permissions"]; 
  let sidebarArr  = [];
  for(let i = 0; i < menuNames.length; i++){
    sidebarArr.push(
      <Link key={menuNames[i]} onClick={() => onClick(i)} to={target[i]}>
        <li className={ "sidebar-link"  + (i === sidebarIndex ? " active" : "" ) }>

          <i className={`fa ${menuIcons[i]}`}></i>
          {menuNames[i]}
        </li>
      </Link>
    
    )
  }
  return(
    <>
      <button className="toggle-sidebar" onClick={toggleSidebar}>Menu <i className="fa fa-bars"></i></button>
      
      <div className={`sidebar-container ${isSidebarOpen ? "active-sidebar" : ""}`}>
        <div className="sidebar-header">
          <img alt="logo" className="logo" src={LOGO} width="100px" height="auto"/>
          <h3>Recognisight</h3>
          <Link to="/">
            <ButtonPrimary text="LOG OUT" className="mt-15 ml-15 button-danger" style={{transform: "scale(0.8)",width: '150px', height: '30px'}} onClick={() => logOut(onClick)}/>
          </Link>
        </div>
        <ul className="sidebar-links">
      
            {sidebarArr}
          
        </ul>
      </div>
      
    </>
  )
}


const logOut = (onClick) => {
  if (!window.confirm('Are you sure want to log out?')){
    // saveSidebarState(0);
    onClick(0);
    return;
  }
  fetch(`${API}/logout`, {
    headers: {
      'authorization': Cookie.get('JWT_token')
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.message.indexOf('logged out') !== -1) {
      saveSidebarState(0)
      savePrivilege(false,false,false,false,false);
      Cookie.remove('JWT_token')
      window.location.href = window.location.href;

    }
    else alert('Log out failed')
  })
  .catch(err => alert(err.toString())) 
}