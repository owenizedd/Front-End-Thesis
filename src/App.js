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

class App extends Component {
  state = {
    sidebarIndex: 0,
    isLoggedIn: false,
    token: '',
  }
  
  componentDidMount = () => {
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
          {getSession() && <Sidebar sidebarIndex={this.state.sidebarIndex} onClick={this.handleClickSidebar}/>}
          
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
                <Route path="/employees/edit/:id" exact render={() => (
                  <h1>Edit Employee</h1>
                )}/>
              </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
