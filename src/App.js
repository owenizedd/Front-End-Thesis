import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';


import Guest from './Components/Guest/Guest';

class App extends Component {
  state = {
    sidebar: [],
    isLoggedIn: false,
    token: ''
  }
  
  componentDidMount = () => {

  }
  componentDidUpdate = () => {
    
  }
  
  render(){
    //sidebar
    return (
      <div id="app">
        {/* {this.state.isLoggedIn && <Sidebar/>} */}
        
        <Router>
          <Switch>
            {!this.state.isLoggedIn && <Route path="/" exact component={Guest}/>}
            
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
