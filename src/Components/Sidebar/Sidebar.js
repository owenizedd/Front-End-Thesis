import React from 'react';
import {Link, BrowserRouter as Router, Route} from 'react-router-dom';
import './Sidebar.css';

export default ({sidebarIndex, onClick}) => {
  let menuNames   = ["Home", "Company", "Employees", "Offices", "Roles", "Positions", "Absences", "Report", "Permission Requests"];
  let menuIcons   = ["fa-home", "fa-cogs", "fa-users", "fa-building", "fa-users-cog", "fa-list", "fa-money-check", "fa-chart-bar", "fa-tasks"];
  let target      = ["/", "/company", "/employees", "/offices", "/roles", "/positions", "/absences", "/report", "/permission-requests"]; 
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
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img alt="logo" className="logo" src="assets/images/logo_svg.svg" width="100px" height="auto"/>
        <h3>HR Online</h3>
      </div>
      <ul className="sidebar-links">
    
          {sidebarArr}
        
      </ul>
    </div>
  )
}