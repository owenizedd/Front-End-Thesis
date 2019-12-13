import React from 'react';
import Cookie from 'js-cookie';
import Particles from 'react-particles-js';
import FormInput from '../Util/FormInput/FormInput';
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary';

import './Guest.css';

import {convertToForm} from '../Util/common';
//username
//password
//login button
//forgot password
//register



export default class Guest extends React.Component{
  api = 'http://157.230.43.112:3000';

  
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


  formRef = React.createRef();
  handleClickLogin = () => {
    //do Login functionality
    const that = this;
    const props = this.props;
    if (this.state.username && this.state.password){
      console.log('trying to login...');
      
      this.setState({isLoading: true});
      let loginData = convertToForm(this.formRef.current);
      
      fetch(`${this.api}/login`, {
        method: 'POST',
        body: loginData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => res.json())
      .then(data => {
        //Bearer token
        that.setState({isLoading: false});
        //save token to cookie.
        console.log(data.data);
        Cookie.set('JWT_token', `Bearer ${data.data}`);
        props.LoggedIn();
      })
      .catch(err => console.log(err))
    }
  }

  handleClickRegister = () => {
    const that = this;
    if (this.state.email && this.state.password && this.state.username){
      console.log('trying to register...');
      this.setState({isLoading: true});
      let registerData = convertToForm(this.formRef.current);
      
      fetch(`${this.api}/register`, {
        method: 'POST',
        body: registerData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => res.json())
      .then(data => {
        that.setState({isLoading: false});
        console.log(data);
      })
    }
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
    // console.log(this.state)
  }

  render(){
    var guest = <Login formRef={this.formRef} navToReset={this.navToReset} navToRegister={this.navToRegister} handleChange={this.handleChange} handleClickLogin={this.handleClickLogin}/>;
    if (this.state.Register){
      guest = <Register formRef={this.formRef} navToLogin={this.navToLogin} handleClickRegister={this.handleClickRegister} handleChange={this.handleChange}/>
    }
    if (this.state.Forgot){
      guest = <ForgotPassword formRef={this.formRef} navToLogin={this.navToLogin} handleClickForgot={this.handleClickForgot} handleChange={this.handleChange}/>
    }
    return(
      <div className="login-container">
        <Particles className="particle-bg"/>
        
        {guest}
      </div>
    )
  }
}

//stateless components (presentational)
function Login({formRef, handleChange, handleClickLogin, navToRegister, navToReset}){
  return(
    <div className="form-container">
      <img className="bs" src="assets/images/logo_svg.svg" width="300px" height="auto"/>
      <form ref={formRef}>
        <FormInput type="text" name="username" onChange={handleChange} placeholder="Username"/>
        <FormInput hidden type="password" name="password" onChange={handleChange} placeholder="Password"/>
        <ButtonPrimary text="LOGIN" onClick={handleClickLogin}/>
        <p className="shadowed-text">Forgot your password? <span className="link-style-green" onClick={navToReset}>Reset it here</span></p>
        <p className="shadowed-text">Not registered yet? <span className="link-style-green" onClick={navToRegister}>Register now</span></p>
      </form>
    </div>
  );
}

function ForgotPassword({formRef, handleChange, handleClickForgot, navToLogin}){
  return(
    <div className="form-container">
      <img className="bs" src="assets/images/logo_svg.svg" width="300px" height="auto"/>
      <form ref={formRef}>
        <FormInput type="text" name="username" onChange={handleChange} placeholder="Username"/>
        <ButtonPrimary text="RESET PASSWORD" onClick={handleClickForgot}/>
        <p className="shadowed-text">Want to login? <span className="link-style-green" onClick={navToLogin}>Login here</span></p>
      </form>
    </div>
  )
}

//username - password - email = required
function Register({formRef, handleChange, handleClickRegister, navToLogin}){
  return(
    <div className="form-container">
      <img className="bs" src="assets/images/logo_svg.svg" width="300px" height="auto"/>
      <form ref={formRef}>
        <FormInput  type="text" name="username" onChange={handleChange} placeholder="Username"/>
        <FormInput  hidden type="password" name="password" onChange={handleChange} placeholder="Password"/>
        <FormInput  type="email" name="email" onChange={handleChange} placeholder="Email"/>
        <FormInput  type="text" name="phone_number" onChange={handleChange} placeholder="Phone Number"/>
        <FormInput  type="text" name="company_name" onChange={handleChange} placeholder="Company Name"/>
        <FormInput  type="text" name="company_address" onChange={handleChange} placeholder="Company Address"/>
        <ButtonPrimary text="REGISTER" onClick={handleClickRegister}/>
        <p className="shadowed-text">Want to login? <span className="link-style-green" onClick={navToLogin}>Login here</span></p>
      </form>


    </div>
  )
}