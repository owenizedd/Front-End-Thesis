import React from 'react';
import Particles from 'react-particles-js';
import FormInput from '../FormInput/FormInput';
import './Guest.css';
//username
//password
//login button
//forgot password
//register
export default class Guest extends React.Component{

  state={
    username: '',
    password: '',
    isLoading: false
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value 
    })
  }

  componentDidUpdate(){
    console.log(this.state)
  }

  render(){
    return(
      <Login handleChange={this.handleChange}/>
    )
  }
}

function Login({handleChange}){
  return(
    <div className="login-container">
          <Particles className="particle-bg"/>
          
          <div className="form-container">
            <FormInput type="text" name="username" onChange={handleChange} placeholder="Username"/>
            <FormInput hidden type="password" name="password" onChange={handleChange} placeholder="Password"/>
            
          </div>
    </div>
  );
}