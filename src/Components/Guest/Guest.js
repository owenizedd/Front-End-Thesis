import React from 'react';
import Particles from 'react-particles-js';
import FormInput from '../Util/FormInput/FormInput';
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary';

import './Guest.css';
//username
//password
//login button
//forgot password
//register
export default class Guest extends React.Component{

  state={
    isLoading: false,
    Login: true,
    Register: false,
    Forgot: false
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value 
    })
  }

  handleClickLogin = () => {
    //do Login functionality
  }

  handleClickRegister = () => {

  }

  handleClickForgot = () => {
    
  }

  navToReset = () => {
    this.setState({
      Login: false,
      Forgot: true,
      Register: false
    })
  }

  navToRegister = () => {
    this.setState({
      Login: false,
      Forgot: false,
      Register: true,
    });

    
  }

  navToLogin = () => {
    this.setState({
      Login: true,
      Register: false,
      Forgot: false
    })
  }
  componentDidUpdate(){
    console.log(this.state)
  }

  render(){
    var guest = <Login navToReset={this.navToReset} navToRegister={this.navToRegister} handleChange={this.handleChange} handleClickLogin={this.handleClickLogin}/>;
    if (this.state.Register){
      guest = <Register navToLogin={this.navToLogin} handleClickRegister={this.handleClickRegister} handleChange={this.handleChange}/>
    }
    if (this.state.Forgot){
      guest = <ForgotPassword navToLogin={this.navToLogin} handleClickForgot={this.handleClickForgot} handleChange={this.handleChange}/>
    }
    return(
      <div className="login-container">
        <Particles className="particle-bg"/>
        {guest}
      </div>
    )
  }
}

function Login({handleChange, handleClickLogin, navToRegister, navToReset}){
  return(
    <div className="form-container">
      <form>
        <FormInput type="text" name="username" onChange={handleChange} placeholder="Username"/>
        <FormInput hidden type="password" name="password" onChange={handleChange} placeholder="Password"/>
        <ButtonPrimary text="LOGIN" onClick={handleClickLogin}/>
        <p className="shadowed-text">Forgot Your Password? <span className="link-style-green" onClick={navToReset}>Reset it here</span></p>
        <p className="shadowed-text">Not registered yet? <span className="link-style-green" onClick={navToRegister}>Register now</span></p>
      </form>


    </div>
  );
}

function ForgotPassword({handleChange, handleClickForgot, navToLogin}){
  return(
    <div className="form-container">
      <form>
        <FormInput type="text" name="username" onChange={handleChange} placeholder="Username"/>
        <ButtonPrimary text="RESET PASSWORD" onClick={handleClickForgot}/>
        <p className="shadowed-text">Want to login? <span className="link-style-green" onClick={navToLogin}>Login here</span></p>
      </form>
    </div>
  )
}

function Register({handleChange, handleClickRegister, navToLogin}){
  return(
    <div className="form-container">
      <form>
        <FormInput type="text" name="username" onChange={handleChange} placeholder="Username"/>
        <FormInput hidden type="password" name="password" onChange={handleChange} placeholder="Password"/>
        <FormInput type="text" name="email" onChange={handleChange} placeholder="Email"/>
        <FormInput type="text" name="phoneNumber" onChange={handleChange} placeholder="Phone Number"/>
        <FormInput type="text" name="companyName" onChange={handleChange} placeholder="Company Name"/>
        <FormInput type="text" name="companyAddress" onChange={handleChange} placeholder="Company Address"/>
        <ButtonPrimary text="REGISTER" onClick={handleClickRegister}/>
        <p className="shadowed-text">Want to login? <span className="link-style-green" onClick={navToLogin}>Login here</span></p>
      </form>


    </div>
  )
}