import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
// import Cookie from 'js-cookie';

import Guest from './Components/Guest/Guest';
import Dashboard from './Components/Dashboard/Dashboard';
import {getSession, saveSidebarState, getSidebarState} from './Components/Util/common';
import Sidebar from './Components/Sidebar/Sidebar';
import Company from './Components/Company/Company';
import Employees from './Components/Employees/Employees';

class App extends Component {
  state = {
    sidebarIndex: 0,
    isLoggedIn: false,
    token: '',
  }
  
  componentDidMount = () => {
  
    this.setState({ sidebarIndex: getSidebarState() })
    if (getSession()) this.LoggedIn();
  }
  componentDidUpdate = () => {
    
  }
  
  LoggedIn = () =>{
    this.setState({isLoggedIn: true});
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
                  getSession() ?  <Dashboard/> : <Guest LoggedIn={this.LoggedIn} />
                )}/>
                <Route path="/company" exact render={() => <Company/>}/>
                <Route path="/employees" exact render={() => <Employees/>}/>
              </Switch>
        </div>
      </Router>
    );
  }

  navigateToLogin = () =>{
    let enterApp = this.state.enterApp;
    enterApp.isLogin = true;
    this.setState({
      enterApp: enterApp
    })
  }
}

export default App;
