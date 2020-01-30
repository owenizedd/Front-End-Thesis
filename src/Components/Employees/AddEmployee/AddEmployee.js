import React from 'react'
import './AddEmployee.css'
import FormInput from '../../Util/FormInput/FormInput'
import FormInputDate from '../../Util/FormInputDate/FormInputDate'
import FormInputDropdown from '../../Util/FormInputDropdown/FormInputDropdown'
import 'react-datepicker/dist/react-datepicker.css';
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary'
import { convertToForm, API } from '../../Util/common'
import Cookie from 'js-cookie'
import Modal from '../../Util/ModalAndLogin/Modal'
import Loading from '../../Util/ModalAndLogin/Loading'

export default class AddEmployee extends React.Component{
  api = API;
  
  state={
    info: '',
    isLoading: false,
  }

  handleChange = (evt) => {

    const {name, value} = evt.target;

    this.setState({
      [name]: value
    })
  }
  toggleLoading = () => this.setState({isLoading: !this.state.isLoading})
  componentDidMount = async() => {
     //fetch pos, fetch office and role for select
     this.toggleLoading()
     await fetch(`${this.api}/api/position`, {
       headers: {
         'authorization': Cookie.get('JWT_token')
       }
     })
     .then(res => res.json())
     .then(data => {
       if (data.data){
         let positions = []
         data.data.forEach(pos => {
           positions.push({
             value: pos.position_no,
             label: pos.position_name
           })
         })
         this.setState({listPositions: positions})
       }
       else this.setState({info: data.message})
     })
     .catch( err => this.setState({ info: err.toString()}))
 
     await fetch(`${this.api}/api/office`, {
       headers: {
         'authorization': Cookie.get('JWT_token')
       }
     })
     .then(res => res.json())
     .then(data => {
       if (data.data){
         let offices = [];
         data.data.forEach(ofc => {
           offices.push({
             value: ofc.office_no,
             label: ofc.office_name
           })
         })
         this.setState({listOffices: offices})
       }
       else this.setState({info: this.state.info + ' ' + data.message })
     })
     .catch(err => this.setState({ info: err.toString()}));

     await fetch(`${this.api}/api/role`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        let roles = [];
        data.data.forEach(role => {
          roles.push({
            value: role.role_no,
            label: role.role_name
          })
        })
        this.setState({listRoles: roles})
      }
      else this.setState({info: this.state.info + ' ' + data.message })
    })
    .catch(err => this.setState({ info: err.toString()}));

     this.toggleLoading();
  }
  
  handleClick = async() => {
    this.setState({isLoading: true});
    let employeeData = convertToForm(this.refs.addEmployeeForm);
    let dateParts = employeeData.get('work_date').split('-');
    let workDate = new Date(dateParts[2], dateParts[1] -1, dateParts[0]);
    
    dateParts = employeeData.get('birthdate').split('-');
    let birthDate = new Date(dateParts[2], dateParts[1] -1, dateParts[0]);
    
    employeeData.set('work_date', workDate.toDateString()) 
    employeeData.set('birthdate', birthDate.toDateString());

    
    if (!employeeData.get('office_no')){
      this.setState({info: 'Office is required.', isLoading: false})
      return;
    }
    if (!employeeData.get('position_no')){
      this.setState({info: 'Position is required.', isLoading: false})
      return;
    }


    await fetch(`${this.api}/api/employee`, {
      method: 'POST',
      body: employeeData,
      headers: {
        'authorization': Cookie.get("JWT_token")
      },
    })
    .then(res => res.json())
    .then(data =>{
      this.setState({info: data.message, isLoading: false});
    })
    .catch(err => this.setState({isLoading: false, info: err.toString()}))
  }

  render(){
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
        <div className="wrapper-form">
          {/* <FormInputDate */}
          <h1 className="ta-ctr">Add an Employee</h1>
          <form className="container-row" ref="addEmployeeForm" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="form-wrapper">
              <label htmlFor="username">Username *</label>
              <FormInput autoFocus required type="text" onChange={this.handleChange} name="username" value={this.state.username}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="password">Password *</label>
              <FormInput required hidden type="password" onChange={this.handleChange} name="password" value={this.state.password}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="employee_name">Full Name *</label>
              <FormInput required type="text" onChange={this.handleChange} name="employee_name" value={this.state.full_name}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="employee_id">Employee ID *</label>
              <FormInput required type="text" onChange={this.handleChange} name="employee_id" value={this.state.employee_id}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="work_date">Work Date</label>
              <FormInputDate className="mt-10" onChange={this.handleChange} icon="fa-calendar" name="work_date"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="office_no">Office *</label>
              <FormInputDropdown options={this.state.listOffices} onChange={this.handleChange} placeholder="Select an office..." name="office_no"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="position_no">Position *</label>
              <FormInputDropdown options={this.state.listPositions} onChange={this.handleChange} placeholder="Select a position..." name="position_no"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="role_no">Role</label>
              <FormInputDropdown optional options={this.state.listRoles} onChange={this.handleChange} placeholder="Select a role..." name="role_no"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="address">Address</label>
              <FormInput required type="text" onChange={this.handleChange} name="address" value={this.state.address}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="hp">Phone Number</label>
              <FormInput required type="text" onChange={this.handleChange} name="hp" value={this.state.hp}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="email">Email *</label>
              <FormInput required type="email" onChange={this.handleChange} name="email" value={this.state.email}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="birthdate">Birthdate</label>
              <FormInputDate  className="mt-10" onChange={this.handleChange} icon="fa-calendar" name="birthdate"/>
            </div>
            <div className="form-wrapper  mt-15">
              <label htmlFor="gender" className="mr-15">Gender</label>
              <input type="radio" name="gender" value="Yes" checked={this.state.gender==="Yes"} onChange={this.handleChange}/> Male
              <input type="radio" name="gender" value="No" checked={this.state.gender==="No"} onChange={this.handleChange}/> Female
            </div>

            <div className="form-wrapper">
              <ButtonPrimary text="SUBMIT" onClick={this.handleClick} />
            </div>
          </form>
        </div>
      </>
    );
  }
}