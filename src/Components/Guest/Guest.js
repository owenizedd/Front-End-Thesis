import React from 'react';
import Cookie from 'js-cookie';
import Particles from 'react-particles-js';
import FormInput from '../Util/FormInput/FormInput';
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary';

import './Guest.css';

import {convertToForm, saveSidebarState, API} from '../Util/common';
import Loading from '../Util/ModalAndLogin/Loading';
import Modal from '../Util/ModalAndLogin/Modal';
//username
//
//login button
//forgot password
//register



export default class Guest extends React.Component{
  api = API;

  constructor(props){
    super(props);
    saveSidebarState(0);
  }
  
  state={
    isLoading: false,
    login: true,
    register: false,
    forgot: false,
    info: '',
  }

  handleChange = (evt) => {
    
    this.setState({
      [evt.target.name]: evt.target.value 
    })
  }


  formRef = React.createRef();
  handleClicklogin = () => {
    //do login functionality
    const that = this;
    const props = this.props;
    if (this.state.username && this.state.password){
      
      this.setState({isLoading: true});
      let loginData = convertToForm(this.formRef.current);
      
      fetch(`${this.api}/login`, {
        method: 'POST',
        body: loginData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res =>  {
        return res.json();
      })
      .then(data => {
        //Bearer token
        that.setState({isLoading: false});
        
        //if credential is correct
        if (data.data){
          //0.5 == half of a day
          Cookie.set('JWT_token', `Bearer ${data.data}`, { expires: 0.5});
          props.toggleLoggedIn();
        }
        else{
          this.setState({ info: 'Wrong Credential. Please try again.'});
        }
      })
      .catch(err => {this.setState({ isLoading: false, info: err.toString() + " Please check your connection or use different connection."})})
    }
    else{
      this.setState({ info: 'Please fill the correct username and password.'});
    }
  }

  handleClickRegister = () => {
    const that = this;
    if (this.state.email && this.state.password && this.state.username){
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
      })
    }
    else{
      this.setState({info: "Please at least fill correct username, email and password."});
    }
  }

  handleClickForgot = () => {

  }

  navToReset = () => {
    this.setState({
      login: false,
      forgot: true,
      register: false
    })
  }

  navToRegister = () => {
    this.setState({
      login: false,
      forgot: false,
      register: true,
    });

    
  }

  navToLogin = () => {
    this.setState({
      login: true,
      register: false,
      forgot: false
    })
  }
  componentDidUpdate(){
  }

  render(){
    var guest = <Login formRef={this.formRef} navToReset={this.navToReset} navToRegister={this.navToRegister} handleChange={this.handleChange} handleClicklogin={this.handleClicklogin}/>;
    if (this.state.register){
      guest = <Register formRef={this.formRef} navToLogin={this.navToLogin} handleClickRegister={this.handleClickRegister} handleChange={this.handleChange}/>
    }
    if (this.state.forgot){
      guest = <ForgotPassword formRef={this.formRef} navToLogin={this.navToLogin} handleClickForgot={this.handleClickForgot} handleChange={this.handleChange}/>
    }
    return(
      <div className="login-container">
        <Particles className="particle-bg"/>
        {this.state.isLoading && <Loading/>}
        {this.state.info && 
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              <ButtonPrimary onClick={(e) => {this.setState({info: ''}); e.stopPropagation(); }} text="CLOSE"/>
            </div>
          </Modal>
        }
        {guest}
      </div>
    )
  }
}

//stateless components (presentational)
function Login({formRef, handleChange, handleClicklogin, navToRegister, navToReset}){
  return(
    <div className="form-container">
      <img alt="logo" className="bs" src="assets/images/logo_svg.svg" width="300px" height="auto"/>
      <form ref={formRef}>
        <FormInput autoFocus required type="text" name="username" onChange={handleChange} placeholder="Username"/>
        <FormInput required hidden type="password" name="password" onChange={handleChange} placeholder="Password"/>
        <ButtonPrimary text="LOGIN" onClick={handleClicklogin}/>
        <p className="shadowed-text">Forgot your password? <span className="link-style-green" onClick={navToReset}>Reset it here</span></p>
        <p className="shadowed-text">Not registered yet? <span className="link-style-green" onClick={navToRegister}>Register now</span></p>
      </form>
    </div>
  );
}

function ForgotPassword({formRef, handleChange, handleClickForgot, navToLogin}){
  return(
    <div className="form-container">
      <img alt="logo" className="logo" src="assets/images/logo_svg.svg" width="300px" height="auto"/>
      <form ref={formRef}>
        <FormInput autoFocus required type="text" name="username" onChange={handleChange} placeholder="Username"/>
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
      <img alt="logo" className="bs" src="assets/images/logo_svg.svg" width="300px" height="auto"/>
      <form ref={formRef}>
        <FormInput autoFocus required type="text" name="username" onChange={handleChange} placeholder="Username"/>
        <FormInput required hidden type="password" name="password" onChange={handleChange} placeholder="Password"/>
        <FormInput required type="email" name="email" onChange={handleChange} placeholder="Email"/>
        <FormInput  type="text" name="phone_number" onChange={handleChange} placeholder="Phone Number"/>
        <FormInput  type="text" name="company_name" onChange={handleChange} placeholder="Company Name"/>
        <FormInput  type="text" name="company_address" onChange={handleChange} placeholder="Company Address"/>
        <ButtonPrimary text="REGISTER" onClick={handleClickRegister}/>
        <p className="shadowed-text">Want to login? <span className="link-style-green" onClick={navToLogin}>Login here</span></p>
      </form>
    </div>
  )
}