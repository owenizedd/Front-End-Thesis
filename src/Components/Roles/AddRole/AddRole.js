import React from 'react'
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary'
import FormInput from '../../Util/FormInput/FormInput'
import { convertToForm, API } from '../../Util/common'
import Cookie from 'js-cookie'
import Modal from '../../Util/ModalAndLogin/Modal'
import Loading from '../../Util/ModalAndLogin/Loading'
import Card from '../../Util/Card/Card'
import { Link } from 'react-router-dom'
import { render } from 'react-dom'


export default class AddRole extends React.Component {
  api = API
  state = {

  }

  handleChange = (evt) => {
    const {name, value} = evt.target;
    this.setState({
      [name]: value
    })
  }
  handleClick =  () =>{
    this.setState({isLoading: true})
    let roleData = convertToForm(this.refs.addRoleForm)
    let dataFullFilled = true;
    if (!roleData.has('role_id')) dataFullFilled=false;
    if (!roleData.has('role_name')) dataFullFilled=false;
    if (!roleData.has('allow_manage_employee')) dataFullFilled=false;
    if (!roleData.has('allow_manage_office')) dataFullFilled=false;
    if (!roleData.has('allow_manage_position')) dataFullFilled=false;
    if (!roleData.has('allow_manage_absence')) dataFullFilled=false;
    if (dataFullFilled){
      fetch(`${this.api}/api/role`, {
        method: "POST",
        body: roleData,
        headers: {
          'authorization': Cookie.get('JWT_token')
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({info: data.message, isLoading: false});
      })
      .catch(err => {
        this.setState({info: err.toString(), isLoading: false});
      })
    }
    else{
      this.setState({info: 'Please fill all required fields.', isLoading: false});
    }
  }
  render(){
    const { allow_manage_position, allow_manage_employee, allow_manage_office, allow_manage_absence} = this.state
    return(
      <>
        {this.state.info && 
            
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              <ButtonPrimary onClick={(e) => {this.setState({info: ''}); e.stopPropagation(); }} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        {this.state.isLoading && <Loading/>}
        <h1 className="ta-ctr mb-15">Add a Role</h1>
        <div className="wrapper-form form-role">
          <form ref="addRoleForm"className="container-row">
            <div className="form-wrapper">
            <label htmlFor="role_id">Role ID</label>
              <FormInput required type="text" name="role_id" onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="role_name">Role Name</label>
              <FormInput required type="text" name="role_name" onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="allow_manage_employee">Allow Manage Employee</label>
              <input type="radio" name="allow_manage_employee" value="Yes" onChange={this.handleChange} checked={ allow_manage_employee==="Yes"}/> Yes
              <input type="radio" name="allow_manage_employee" value="No" onChange={this.handleChange} checked={ allow_manage_employee==="No"}/> No
              <br/>
              <label htmlFor="allow_manage_office" >Allow Manage Office</label>
              <input type="radio" name="allow_manage_office" value="Yes" onChange={this.handleChange} checked={ allow_manage_office==="Yes"}/> Yes
              <input type="radio" name="allow_manage_office" value="No" onChange={this.handleChange} checked={ allow_manage_office==="No"}/> No
            </div>
            <div className="form-wrapper">
              <label htmlFor="allow_manage_position">Allow Manage Position</label>
              <input type="radio" name="allow_manage_position" value="Yes" onChange={this.handleChange} checked={ allow_manage_position==="Yes"}/> Yes
              <input type="radio" name="allow_manage_position" value="No" onChange={this.handleChange} checked={ allow_manage_position==="No"}/> No
              <br/>
              <label htmlFor="allow_manage_absence">Allow Manage Absence</label>
              <input type="radio" name="allow_manage_absence" value="Yes" onChange={this.handleChange} checked={ allow_manage_absence==="Yes"}/> Yes
              <input type="radio" name="allow_manage_absence" value="No" onChange={this.handleChange} checked={ allow_manage_absence==="No"}/> No
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

