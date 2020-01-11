import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import './logged-in.css'
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
import Cookie from 'js-cookie'
import Modal from './Components/Util/ModalAndLogin/Modal';
import ButtonPrimary from './Components/Util/ButtonPrimary/ButtonPrimary';
class App extends Component {
  state = {
    sidebarIndex: 0,
    isLoggedIn: false,
    token: '',
  }
  
  componentDidMount = () => {
    
    console.log(`Made with <3 with React.js`, Cookie.get('JWT_token'))
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

    return(
      <Router>
         {this.state.info && 
          
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
  
              <h1>{this.state.info}</h1>
              <img src={this.state.info_image}/>
              <ButtonPrimary onClick={(e) => {this.setState({info: '', info_image: ''}); e.stopPropagation(); }} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        <div id="app" className={ "app-container" + (this.state.isLoggedIn ? ' pd-l-sidebar' : '')} >
          {
            getSession() && <Sidebar sidebarIndex={this.state.sidebarIndex} onClick={this.handleClickSidebar}/>
          }
          <Switch>
            <Route path="/" exact render={() => (
              getSession() ?  <Dashboard/> : <Guest toggleLoggedIn={this.toggleLoggedIn} />
            )}/>
            <Route path="/company" exact render={() => (
              getSession() ? (getSession('isCompany') ? <Company/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>
      
            <Route path="/employees" exact render={() => (
              getSession() ? (getSession('allowEmployee') ? <Employees/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>
            <Route path="/employees/add" exact render={() => (
              getSession() ? (getSession('allowEmployee') ? <AddEmployee/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>
            <Route path="/employees/edit/:id" exact component={EditEmployee}/>
            
            <Route path="/offices" exact render={() => (
              getSession() ? (getSession('allowOffice') ? <Offices/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>          
            <Route path="/offices/add" exact render={() => (
              getSession() ? (getSession('allowOffice') ? <AddOffice/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>
            <Route path="/offices/edit/:id" exact component={EditOffice}/>
            
            <Route path="/roles" exact render={() => (
              getSession() ? (getSession('allowRole') ? <Roles/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>
            <Route path="/roles/add" exact render={ ()=> (
              getSession() ? (getSession('allowRole') ? <AddRole/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>
            <Route path="/roles/edit/:id" exact component={EditRole}/>

            <Route path="/positions" exact render={ () => (
              getSession() ? (getSession('allowPosition') ? <Positions/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>

            <Route path="/positions/add" exact render={ ()=> (
              getSession() ? (getSession('allowPosition') ? <AddPosition/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>

            <Route path="/positions/edit/:id" exact render={EditPosition}/>
            
            <Route path="/absences" exact render={ () => (
              getSession() ? (getSession('allowAbsence') ? <AbsenceLogDetails/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>

            <Route path="/report" exact render={ () => (
              getSession() ? (getSession('allowReport') ? <Report/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>

            <Route path="/permissions" exact render= { () => (
              getSession() ? (getSession('allowPermission') ? <Permissions/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>
            <Route path="/permissions/add" exact render= { () => (
              getSession() ? (getSession('allowPermission') ? <AddPermission/> : <NotAllowed/>) : <Redirect to="/"/>
            )}/>
            {/* When there is no route match to path, render 404. */}
            <Route path="/" render={() => <h1 className="ta-ctr">404 Not Found.<br/> Unfortunately, we couldn't find the page you're looking for.</h1>} />
          </Switch>
        </div>
      </Router>
    );
  }
}


const NotAllowed = () => (<h1>You are not allowed to access this page.</h1>)
export default App;
