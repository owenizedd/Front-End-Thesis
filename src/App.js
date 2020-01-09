import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
// import Cookie from 'js-cookie';

import Guest from './Components/Guest/Guest';
import Dashboard from './Components/Dashboard/Dashboard';
import {getSession, saveSidebarState, getSidebarState} from './Components/Util/common';
import Sidebar from './Components/Sidebar/Sidebar';
import Company from './Components/Company/Company';
import Employees from './Components/Employees/Employees';
import AddEmployee from './Components/Employees/AddEmployee/AddEmployee';
import EditEmployee from './Components/Employees/EditEmployee/EditEmployee';
import Offices from './Components/Offices/Offices';
import AddOffice from './Components/Offices/AddOffice/AddOffice';
import EditOffice from './Components/Offices/EditOffice/EditOffice';
import Roles from './Components/Roles/Roles';
import EditRole from './Components/Roles/EditRole/EditRole'
import Positions from './Components/Positions/Positions';
import AddPosition from './Components/Positions/AddPosition/AddPosition';
import EditPosition from './Components/Positions/EditPosition/EditPosition';
import AbsenceLogDetails from './Components/AbsenceLogDetails/AbsenceLogDetails';
import Report from './Components/Report/Report';
import Permissions from './Components/Permissions/Permissions';
import AddPermission from './Components/Permissions/AddPermission/AddPermission';
import AddRole from './Components/Roles/AddRole/AddRole';

class App extends Component {
  state = {
    sidebarIndex: 0,
    isLoggedIn: false,
    token: '',
  }
  
  componentDidMount = () => {
    
    console.log(`Made with <3 with React.js`)
    this.setState({ sidebarIndex: getSidebarState() }) 
    if (getSession()) this.toggleLoggedIn();
  }
  
  componentDidUpdate = () => {
    
  }
  
  toggleLoggedIn = () => {
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }
  handleClickSidebar = (sidebarIndex) => {
    saveSidebarState(sidebarIndex);
    this.setState({sidebarIndex: sidebarIndex});

  }
  render(){
    //change all background to dark purple + padding left for body
    //so that the content wont get covered by sidebar. 
    this.state.isLoggedIn && require('./logged-in.css');
    return (
      <Router>
        
        <div id="app" className="app-container" >
          {
            getSession() && <Sidebar sidebarIndex={this.state.sidebarIndex} onClick={this.handleClickSidebar}/>
          }
          <Switch>
            <Route path="/" exact render={() => (
              getSession() ?  <Dashboard/> : <Guest toggleLoggedIn={this.toggleLoggedIn} />
            )}/>
            <Route path="/company" exact render={() => (
              getSession() ? <Company/> : <Redirect to="/"/>
            )}/>
            
            <Route path="/employees" exact render={() => (
              getSession() ? <Employees/> : <Redirect to="/"/>
            )}/>
            <Route path="/employees/add" exact render={() => (
              getSession() ? <AddEmployee/> : <Redirect to="/"/>
            )}/>
            <Route path="/employees/edit/:id" exact component={EditEmployee}/>
            
            <Route path="/offices" exact render={() => (
              getSession() ? <Offices/> : <Redirect to="/"/>
            )}/>          
            <Route path="/offices/add" exact render={() => (
              getSession() ? <AddOffice/> : <Redirect to="/"/>
            )}/>
            <Route path="/offices/edit/:id" exact component={EditOffice}/>
            
            <Route path="/roles" exact render={() => (
              getSession() ? <Roles/> : <Redirect to="/"/>
            )}/>
            <Route path="/roles/add" exact render={ ()=> (
              getSession() ? <AddRole/> : <Redirect to="/"/>
            )}/>
            <Route path="/roles/edit/:id" exact component={EditRole}/>

            <Route path="/positions" exact render={ () => (
              getSession() ? <Positions/> : <Redirect to="/"/>
            )}/>

            <Route path="/positions/add" exact render={ ()=> (
              getSession() ? <AddPosition/> : <Redirect to="/"/>
            )}/>

            <Route path="/positions/edit/:id" exact render={EditPosition}/>
            
            <Route path="/absences" exact render={ () => (
              getSession() ? <AbsenceLogDetails/> : <Redirect to="/"/>
            )}/>

            <Route path="/report" exact render={ () => (
              getSession() ? <Report/> : <Redirect to="/"/>
            )}/>

            <Route path="/permissions" exact render= { () => (
              getSession() ? <Permissions/> : <Redirect to="/"/>
            )}/>
            <Route path="/permissions/add" exact render= { () => (
              getSession() ? <AddPermission/> : <Redirect to="/"/>
            )}/>
            {/* When there is no route match to path, render 404. */}
            <Route path="/" render={() => <h1 className="ta-ctr">404 Not Found.<br/> Unfortunately, we couldn't find the page you're looking for.</h1>} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
