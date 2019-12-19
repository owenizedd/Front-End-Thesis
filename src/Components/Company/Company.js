import React from 'react';
import './Company.css';
import FormInput from '../Util/FormInput/FormInput';
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary';
import { convertToForm } from '../Util/common';
import Loading from '../Util/ModalAndLogin/Loading';
import Cookie from 'js-cookie';
import Modal from '../Util/ModalAndLogin/Modal';

export default class Company extends React.Component{
  api = 'http://157.230.43.112:3000'

  state={
    isLoading: false,
    info: '',
    username: '',
    company_name: '',
    address: '',
    email: '',
    hp: '',
    start_work_day_1: '',
    end_work_day_1: '',
    start_work_day_2: '',
    end_work_day_2: '',
    start_work_day_3: '',
    end_work_day_3: '',
    start_work_day_4: '',
    end_work_day_4: '',
    start_work_day_5: '',
    end_work_day_5: '',
    start_work_day_6: '',
    end_work_day_6: '',
    start_work_day_7: '',
    end_work_day_7: '',
  }

  handleChange = (evt) => {
    
    const {name, value} = evt.target;
    this.setState({
      [name]: value
    })
  }
  handleClick = (evt) =>{
    let form = this.refs.companyForm;
    let companyData = convertToForm(form);
    let sendData = convertToForm(form);
    
    companyData.forEach( (val, key) => {
      // console.log(key);
      if (key.indexOf("start_work_day") !== -1){
        sendData.append("start_time", val);
        sendData.delete(key);
      }
      if (key.indexOf("end_work_day") !== -1){
        sendData.append("end_time", val);
        sendData.delete(key);
      }
    })

    fetch(`${this.api}/api/company`, {
      method: 'PUT',
      body: sendData,
      headers: {
        'authorization': Cookie.get("JWT_token")
      }
    }).then(res=> res.json())
      .then(data=> {
        if (data.message.toLowerCase().indexOf("not allowed") !== -1) this.setState({info: data.message});
      });

  }

  componentDidMount = () => {
    this.setState({isLoading: true});
    fetch(`${this.api}/api/company`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      //company_no: "1"
      // username: "ryanowen"
      // company_name: "YouTube"
      // address: null
      // email: "owenizedd@gmail.com"
      // hp: null
      // late_tolerance_mins: 0
      // must_photo: true
      // must_same_office: false
      // allow_nebeng: false
      // created_on: "2019-12-11T12:58:36.031Z"
      // updated_on: null
      console.log(data);
      if (data && data.data){
        data = data.data;
        this.setState({
          isLoading: false,
          username: data.username,
          company_name: data.company_name,
          address: data.address,
          email: data.email,
          hp: data.hp,
          must_same_office: data.must_same_office ? "Yes" : "No",
          must_photo: data.must_photo ? "Yes" : "No",
          allow_nebeng: data.allow_nebeng ? "Yes" : "No"
        })
        if (data.start_time && data.end_time){
          for(let i = 0; i < data.start_time.length; i++){
            this.setState({
              ['start_work_day_' + (i+1)]: '' + data.start_time[i],
              ['end_work_day_' + (i+1)]: '' + data.end_time[i],
            })
          }
        }
      }
      else{

        this.setState({
          info: "It seems like you will need to login again. Redirecting to login page."
        });

        setTimeout(function(){
          Cookie.remove('JWT_token');
          //redirect to home
          this.props.history.push('/');

        }, 2000);
        
      }
    }).catch(err => {
      this.setState({ info: err.toString() + ". Please check your connection.", isLoading: false });
    })
  }
  render(){
    /*
    company_name
    address
    email
    hp
    late_tolerance_mins
    must_photo
    must_same_office
    allow_nebeng
    updated_on
    start_time
    end_time
    */
   
    return(
      <>
        {this.state.info && 
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              <ButtonPrimary onClick={(e) => { this.state.info.toLowerCase().indexOf("error") !== -1 ? window.location.reload() : this.setState({info: ''}); e.stopPropagation(); }} text={ this.state.info.toLowerCase().indexOf("error") !== -1 ? "RELOAD PAGE" : "CLOSE"}/>
            </div>
          </Modal>
        }
        {this.state.isLoading && <Loading/>}
        <div className="company-settings-container">
          <h1 className="ta-ctr">Company Settings</h1>
          <form className="container-row company-form" ref="companyForm" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="form-wrapper">
              <label htmlFor="username">Username</label>
              <FormInput value="ryanowen" type="text" onChange={this.handleChange} disabled name="username" value={this.state.username}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="company_name">Name</label>
              <FormInput autofocus required type="text" onChange={this.handleChange} name="company_name" value={this.state.company_name}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="address">Company Address</label>
              <FormInput required type="textarea" onChange={this.handleChange} name="address" value={this.state.address}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="email">Email</label>
              <FormInput required type="email" onChange={this.handleChange} name="email" value={this.state.email}/>
            </div>
            <div className="form-wrapper form-work-day mt-15">
              <label htmlFor="email">Monday Work Day (Hour:Minute)</label>
              <div className="container-row container-work-day container-ctr">
                <FormInput required type="text" onChange={this.handleChange} name="start_work_day_1"/>
                <span className="ml-15 mr-15">to</span>
                <FormInput required type="text" onChange={this.handleChange} name="end_work_day_1"/>
              </div>
            </div>
            <div className="form-wrapper form-work-day mt-15">
              <label htmlFor="email">Tuesday Work Day (Hour:Minute)</label>
              <div className="container-row container-work-day container-ctr">
                <FormInput required type="text" onChange={this.handleChange} name="start_work_day_2"/>
                <span className="ml-15 mr-15">to</span>
                <FormInput required type="text" onChange={this.handleChange} name="end_work_day_2"/>
              </div>
            </div>
            <div className="form-wrapper form-work-day mt-15">
              <label htmlFor="email">Wednesday Work Day (Hour:Minute)</label>
              <div className="container-row container-work-day container-ctr">
                <FormInput required type="text" onChange={this.handleChange} name="start_work_day_3"/>
                <span className="ml-15 mr-15">to</span>
                <FormInput required type="text" onChange={this.handleChange} name="end_work_day_3"/>
              </div>
            </div>
            <div className="form-wrapper form-work-day mt-15">
              <label htmlFor="email">Thursday Work Day (Hour:Minute)</label>
              <div className="container-row container-work-day container-ctr">
                <FormInput required type="text" onChange={this.handleChange} name="start_work_day_4"/>
                <span className="ml-15 mr-15">to</span>
                <FormInput required type="text" onChange={this.handleChange} name="end_work_day_4"/>
              </div>
            </div>
            <div className="form-wrapper form-work-day mt-15">
              <label htmlFor="email">Friday Work Day (Hour:Minute)</label>
              <div className="container-row container-work-day container-ctr">
                <FormInput required type="text" onChange={this.handleChange} name="start_work_day_5"/>
                <span className="ml-15 mr-15">to</span>
                <FormInput required type="text" onChange={this.handleChange} name="end_work_day_5"/>
              </div>
            </div>
            <div className="form-wrapper form-work-day mt-15">
              <label htmlFor="email">Saturday Work Day (Hour:Minute)</label>
              <div className="container-row container-work-day container-ctr">
                <FormInput required type="text" onChange={this.handleChange} name="start_work_day_6"/>
                <span className="ml-15 mr-15">to</span>
                <FormInput required type="text" onChange={this.handleChange} name="end_work_day_6"/>
              </div>
            </div>
            <div className="form-wrapper form-work-day mt-15">
              <label htmlFor="email">Monday Work Day (Hour:Minute)</label>
              <div className="container-row container-work-day container-ctr">
                <FormInput required type="text" onChange={this.handleChange} name="start_work_day_7"/>
                <span className="ml-15 mr-15">to</span>
                <FormInput required type="text" onChange={this.handleChange} name="end_work_day_7"/>
              </div>
            </div>
            <div className="form-wrapper mt-15">
              <label htmlFor="address">Phone Number</label>
              <FormInput required type="text" onChange={this.handleChange} name="hp" value={this.state.hp}/>
            </div>
            <div className="form-wrapper mt-15">
              <div className="container-row">
                <label htmlFor="must_photo" className="mr-15">Absence by Photo</label>
                <input type="radio" name="must_photo" value="Yes" className="radio-photo ml-auto" checked={this.state.must_photo==="Yes"} onChange={this.handleChange}/> Yes
                <input type="radio" name="must_photo" value="No" className="ml-15 radio-photo" checked={this.state.must_photo==="No"} onChange={this.handleChange}/> No
              </div>
            </div>
            <div className="form-wrapper mt-15">
              <div className="container-row ">
                <label htmlFor="must_same_office" className="mr-15">Must Absence in Designated Office</label>
                <div>
                <input type="radio" name="must_same_office" value="Yes" className="ml-15 radio-photo" checked={this.state.must_same_office==="Yes"} onChange={this.handleChange}/> Yes
                <input type="radio" name="must_same_office" value="No" className="ml-15 radio-photo" checked={this.state.must_same_office==="No"} onChange={this.handleChange}/> No
                </div>
              </div>
            </div>
            <div className="form-wrapper mt-15">
              <div className="container-row">
                <label htmlFor="allow_nebeng" className="mr-15">Allow Use Other Device</label>
                <input type="radio" name="allow_nebeng" value="Yes" className="ml-auto radio-photo" checked={this.state.allow_nebeng === "Yes"} onChange={this.handleChange}/> Yes
                <input type="radio" name="allow_nebeng" value="No" className="ml-15 radio-photo" checked={this.state.allow_nebeng==="No"} onChange={this.handleChange}/> No
              </div>
            </div>
            <div className="form-wrapper">
              <ButtonPrimary text="SUBMIT" onClick={this.handleClick}/>
            </div>
          </form>
        </div>
      </>
    )
  }
}