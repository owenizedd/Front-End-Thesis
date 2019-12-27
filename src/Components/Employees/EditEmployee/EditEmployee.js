import React from 'react'
import { getSession } from '../../Util/common';
import { Redirect } from 'react-router-dom';
import FormInput from '../../Util/FormInput/FormInput'
import FormInputDate from '../../Util/FormInputDate/FormInputDate'
import FormInputDropdown from '../../Util/FormInputDropdown/FormInputDropdown'
import 'react-datepicker/dist/react-datepicker.css';
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary'
import { convertToForm } from '../../Util/common'
import Cookie from 'js-cookie'
import Modal from '../../Util/ModalAndLogin/Modal'
import Loading from '../../Util/ModalAndLogin/Loading'
import './EditEmployee.css'


class EditEmployeeComponent extends React.Component{
  api = 'http://157.230.43.112:3000';
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
  handleClickSubmit = async() => {
    return;
    this.setState({isLoading: true});
    let employeeData = convertToForm(this.refs.editEmployeeForm);
    console.log(employeeData);
    
    await fetch(`${this.api}/api/employee`, {
      method: 'PUT',
      body: employeeData,
      headers: {
        'authorization': Cookie.get("JWT_token")
      },
    })
    this.setState({isLoading: false})
  }

  handleClickDeletePhotos = () => {

  }
  
  handleClickClearSession = () => {

  }

  handleClickResign = () => {

  }

  componentDidMount(){
    this.setState({username: this.props.match.params.id || 'Error'});
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
        <div className="wrapper-form employee">
          {/* <FormInputDate */}
          <h1 className="ta-ctr">Edit an Employee</h1>
          <form className="container-row" ref="editEmployeeForm" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="form-wrapper">
              <label  htmlFor="username">Username</label>
              <FormInput disabled required type="text" name="username" value={this.state.username}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="password">Password</label>
              <FormInput required autofocus hidden type="password" onChange={this.handleChange} name="password" value={this.state.password}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="employee_name">Full Name</label>
              <FormInput required type="text" onChange={this.handleChange} name="full_name" value={this.state.full_name}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="employee_id">Employee ID</label>
              <FormInput required type="text" onChange={this.handleChange} name="employee_name" value={this.state.employee_name}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="work_date">Work Date</label>
              <FormInputDate onChange={this.handleChange} icon="fa-calendar" name="work_date"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="office_no">Office</label>
              <FormInputDropdown onChange={this.handleChange} placeholder="Select an office..." name="office_no"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="position_no">Position</label>
              <FormInputDropdown onChange={this.handleChange} placeholder="Select a position..." name="position_no"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="role_no">Role</label>
              <FormInputDropdown onChange={this.handleChange} placeholder="Select a role..." name="role_no"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="address">Address</label>
              <FormInput required type="text" onChange={this.handleChange} name="address" value={this.state.address}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="hp">Address</label>
              <FormInput required type="text" onChange={this.handleChange} name="hp" value={this.state.hp}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="email">Email</label>
              <FormInput required type="email" onChange={this.handleChange} name="email" value={this.state.email}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="birthdate">Birthdate</label>
              <FormInputDate onChange={this.handleChange} icon="fa-calendar" name="work_date"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="gender" className="mr-15">Gender</label>
              <input type="radio" name="gender" value="male" checked={this.state.gender==="male"} onChange={this.handleChange}/> Male
              <input type="radio" name="gender" value="female" checked={this.state.gender==="female"} onChange={this.handleChange}/> Female
            </div>
            <div className="form-wrapper">
              <div className="container-row container-employee-buttons container-ctr">
                <ButtonPrimary text="DELETE PHOTOS" onClick={this.handleClickDeletePhotos}/>
                <ButtonPrimary text="CLEAR SESSION" onClick={this.handleClickClearSession}/>
                <ButtonPrimary text="RESIGN" onClick={this.handleClickResign}/>
              </div>
            </div>
            <div className="form-wrapper">
              <ButtonPrimary text="SUBMIT" onClick={this.handleClickSubmit} />
            </div>
          </form>
        </div>
      </>
    );
  }
}

const EditEmployee = ({match}) => !getSession() ? <Redirect to="/"/> :<EditEmployeeComponent match={match}/> 

export default EditEmployee