import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Cookie from 'js-cookie';

import Guest from './Components/Guest/Guest';
import Dashboard from './Components/Dashboard/Dashboard';
import {getSession} from './Components/Util/common';

class App extends Component {
  state = {
    sidebar: [],
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
  render(){
    //sidebar

    return (
      <div id="app">
        {/* {this.state.isLoggedIn && <Sidebar/>} */}
        
        <Router>
          <Switch>
            <Route path="/" exact render={() => (
              getSession() && this.state.isLoggedIn ?  <Dashboard/> : <Guest LoggedIn={this.LoggedIn} />
            )}/>
          </Switch>
        </Router>
      </div>
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
