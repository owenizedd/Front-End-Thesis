import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Cookie from 'js-cookie';

import Guest from './Components/Guest/Guest';
import Dashboard from './Components/Dashboard/Dashboard';
import {getSession} from './Components/Util/common';
import Sidebar from './Components/Sidebar/Sidebar';

class App extends Component {
  state = {
    sidebarIndex: 0,
    isLoggedIn: false,
    token: ''
  }
  
  componentDidMount = () => {
    if (getSession()) this.LoggedIn();
  }
  componentDidUpdate = () => {
    
  }
  
  LoggedIn = () =>{
    this.setState({isLoggedIn: true});
  }
  handleClickSidebar = (sidebarIndex) => {
    this.setState({sidebarIndex: sidebarIndex});

  }
  render(){
    //sidebar

    return (
      <Router>
        <div id="app">
          {getSession() && <Sidebar sidebarIndex={this.state.sidebarIndex} onClick={this.handleClickSidebar}/>}
          
              <Switch>
                <Route path="/" exact render={() => (
                  getSession() ?  <Dashboard/> : <Guest LoggedIn={this.LoggedIn} />
                  )}/>
    
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
