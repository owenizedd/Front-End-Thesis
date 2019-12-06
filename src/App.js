import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';


import Login from './Components/Login/Login';

class App extends Component {
  state = {
    sidebar: [],
    isLoggedIn: false
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
            <Route path="/" exact component={Login}/>
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
