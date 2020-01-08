import React from 'react'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import FormInput from '../Util/FormInput/FormInput'
import './Roles.css'
import { convertToForm, API } from '../Util/common'
import Cookie from 'js-cookie'
import Modal from '../Util/ModalAndLogin/Modal'
import Loading from '../Util/ModalAndLogin/Loading'
import FormInputDropdown from '../Util/FormInputDropdown/FormInputDropdown'
export default class Roles extends React.Component{

  api = API
  state={
    allow_manage_absence: '',
    allow_manage_office: '',
    allow_manage_employee: '',
    allow_manage_position: '',
    info: '',
    isLoading: false,
    showAddRole: true,
  }
  handleChange = (evt) => {
    
    const {name, value} = evt.target;
    
    this.setState({
      [name]: value
    })
    if (name.toString()==="role_selected"){
      this.setState({isLoading: true})
      fetch(`${this.api}/api/role/${value.value}`, {
        headers: {
          'authorization': Cookie.get("JWT_token")
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({isLoading: false})
        this.setState({
          role_no: data.data.role_no,
          role_id: data.data.role_id,
          role_name: data.data.role_name,
          allow_manage_employee: data.data.allow_manage_employee ? "Yes" : "No",
          allow_manage_absence: data.data.allow_manage_absence ? "Yes" : "No",
          allow_manage_office: data.data.allow_manage_office ? "Yes" : "No",
          allow_manage_position: data.data.allow_manage_position ? "Yes" : "No"
        })
      })
    }
  }


  formRef = React.createRef();
  handleClick =  async() =>{
    this.setState({isLoading: true})
    let roleData = convertToForm(this.formRef.current)
    let dataFullFilled = true;
    if (!roleData.has('role_id')) dataFullFilled=false;
    if (!roleData.has('role_name')) dataFullFilled=false;
    if (!roleData.has('allow_manage_employee')) dataFullFilled=false;
    if (!roleData.has('allow_manage_office')) dataFullFilled=false;
    if (!roleData.has('allow_manage_position')) dataFullFilled=false;
    if (!roleData.has('allow_manage_absence')) dataFullFilled=false;
    if (dataFullFilled){
      await fetch(`${this.api}/api/role`, {
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
        this.setState({info: err.toString, isLoading: false});
      })
    }
    else{
      this.setState({info: 'Please fill all required fields.', isLoading: false});
    }
  }
  reloadOptions = () => {
    this.setState({isLoading: true});
    fetch(`${this.api}/api/role`, {
      headers:{
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
    
      if (data.data){
        let options = [];

        data.data.forEach(role => {
          options.push({
            value: role.role_no,
            label: role.role_name,
          })
        })
        this.setState({options: options, isLoading: false});
      }
      else this.setState({info: data.message, isLoading: false});
    })
    .catch(err => this.setState({isLoading: false, info: err.toString()}))

    this.setState({
      allow_manage_absence: '',
      allow_manage_office: '',
      allow_manage_employee: '',
      allow_manage_position: '',
      role_id: '',
      role_name: '',
    });
  }
  handleNav = () =>{
    if (this.state.showAddRole){
      this.reloadOptions();
    }
    this.setState({showAddRole: !this.state.showAddRole});
  }

  handleSubmit = async() => {
      this.setState({isLoading: true})
      let roleData = convertToForm(this.formRef.current)
      let dataFullFilled = true;
      if (!roleData.has('role_id')) dataFullFilled=false;
      if (!roleData.has('role_name')) dataFullFilled=false;
      if (!roleData.has('allow_manage_employee')) dataFullFilled=false;
      if (!roleData.has('allow_manage_office')) dataFullFilled=false;
      if (!roleData.has('allow_manage_position')) dataFullFilled=false;
      if (!roleData.has('allow_manage_absence')) dataFullFilled=false;
      if (dataFullFilled){
        await fetch(`${this.api}/api/role/${this.state.role_no}`, {
          method: "PUT",
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
          this.setState({info: err.toString, isLoading: false});
        })
      }
      else{
        this.setState({info: 'Please fill all required fields.', isLoading: false});
      }
  }

  handleClickDelete = async() => {
    if (!window.confirm("Are you sure want to delete this employee?")) return
    this.setState({isLoading: true})
    if (this.state.role_no){
      await fetch(`${this.api}/api/role/${this.state.role_no}`, {
        method: "DELETE",
        headers: {
          'authorization': Cookie.get('JWT_token')
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({info: data.message, isLoading: false});
      })
      .catch(err => {
        this.setState({info: err.toString, isLoading: false});
      })
    }
    else{
      this.setState({info: 'Please select a role first.', isLoading: false});
    }

    this.reloadOptions();
  }
  componentDidUpdate(){
    console.info(this.state)
  }
  render(){
    
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

        {this.state.showAddRole ?
          <AddRole onNav={this.handleNav} formRef={this.formRef} onChange={this.handleChange} onClick={this.handleClick} allow_manage_absence={this.state.allow_manage_absence} allow_manage_office={this.state.allow_manage_office} allow_manage_employee={this.state.allow_manage_employee} allow_manage_position={this.state.allow_manage_position}/>
          :
          <EditRole onDelete={this.handleClickDelete} role_no={this.state.role_no} role_id={this.state.role_id} role_name={this.state.role_name} options={this.state.options} onNav={this.handleNav} formRef={this.formRef} onChange={this.handleChange} onSubmit={this.handleSubmit} allow_manage_absence={this.state.allow_manage_absence} allow_manage_office={this.state.allow_manage_office} allow_manage_employee={this.state.allow_manage_employee} allow_manage_position={this.state.allow_manage_position}/>
        }
      </>
    )
  }
}


const AddRole = ({onNav, onChange, onClick, formRef, allow_manage_position, allow_manage_employee, allow_manage_office, allow_manage_absence}) => {
  
  return(
    <>
      <div className="container-row container-header spc-ev mb-15">
        <h1 className="mr-15 mb">Add a Role</h1>
        <ButtonPrimary text="EDIT ROLES" style={{width: '180px'}} onClick={onNav}/>
      </div>
      <div className="wrapper-form form-role">
        <form ref={formRef} className="container-row">
          <div className="form-wrapper">
          <label htmlFor="role_id">Role ID</label>
            <FormInput required type="text" name="role_id" onChange={onChange}/>
          </div>
          <div className="form-wrapper">
            <label htmlFor="role_name">Role Name</label>
            <FormInput required type="text" name="role_name" onChange={onChange}/>
          </div>
          <div className="form-wrapper">
            <label htmlFor="allow_manage_employee">Allow Manage Employee</label>
            <input type="radio" name="allow_manage_employee" value="Yes" onChange={onChange} checked={ allow_manage_employee==="Yes"}/> Yes
            <input type="radio" name="allow_manage_employee" value="No" onChange={onChange} checked={ allow_manage_employee==="No"}/> No
            <br/>
            <label htmlFor="allow_manage_office" >Allow Manage Office</label>
            <input type="radio" name="allow_manage_office" value="Yes" onChange={onChange} checked={ allow_manage_office==="Yes"}/> Yes
            <input type="radio" name="allow_manage_office" value="No" onChange={onChange} checked={ allow_manage_office==="No"}/> No
          </div>
          <div className="form-wrapper">
            <label htmlFor="allow_manage_position">Allow Manage Position</label>
            <input type="radio" name="allow_manage_position" value="Yes" onChange={onChange} checked={ allow_manage_position==="Yes"}/> Yes
            <input type="radio" name="allow_manage_position" value="No" onChange={onChange} checked={ allow_manage_position==="No"}/> No
            <br/>
            <label htmlFor="allow_manage_absence">Allow Manage Absence</label>
            <input type="radio" name="allow_manage_absence" value="Yes" onChange={onChange} checked={ allow_manage_absence==="Yes"}/> Yes
            <input type="radio" name="allow_manage_absence" value="No" onChange={onChange} checked={ allow_manage_absence==="No"}/> No
          </div>
          <div className="form-wrapper">
            
              <ButtonPrimary text="SUBMIT" onClick={onClick}/>
            
          </div>
        </form>
      </div>
    </>
  )
}

const EditRole = ({options,role_id, role_name, onDelete, role_no, onNav,onChange, onSubmit, formRef, allow_manage_position, allow_manage_employee, allow_manage_office, allow_manage_absence}) => {
  
  return(
    <>
    <div className="container-row container-header spc-ev mb-15">
    <h1 className="mr-15 mb">Edit a Role</h1>
    <ButtonPrimary text="ADD ROLES" style={{width: '180px'}} onClick={onNav}/>
    </div>
    <div className="wrapper-form">
      <form ref={formRef} className="container-row">
        <div className="form-wrapper">
          <FormInputDropdown options={options} className="mt-15" onChange={onChange} placeholder="-- Select a Role to Edit --" name="role_selected"/>
        </div>
        <div className="form-wrapper"></div>
        <div className="form-wrapper">
        <label htmlFor="role_id">Role ID</label>
          <FormInput required type="text" name="role_id" value={role_id} onChange={onChange}/>
        </div>
        <div className="form-wrapper">
          <label htmlFor="role_name">Role Name</label>
          <FormInput required type="text" name="role_name" value={role_name} onChange={onChange}/>
        </div>
        <div className="form-wrapper">
          <label htmlFor="allow_manage_employee">Allow Manage Employee</label>
          <input type="radio" name="allow_manage_employee" value="Yes" onChange={onChange} checked={ allow_manage_employee==="Yes"}/> Yes
          <input type="radio" name="allow_manage_employee" value="No" onChange={onChange} checked={ allow_manage_employee==="No"}/> No
          <br/>
          <label htmlFor="allow_manage_office" >Allow Manage Office</label>
          <input type="radio" name="allow_manage_office" value="Yes" onChange={onChange} checked={ allow_manage_office==="Yes"}/> Yes
          <input type="radio" name="allow_manage_office" value="No" onChange={onChange} checked={ allow_manage_office==="No"}/> No
        </div>
        <div className="form-wrapper">
          <label htmlFor="allow_manage_position">Allow Manage Position</label>
          <input type="radio" name="allow_manage_position" value="Yes" onChange={onChange} checked={ allow_manage_position==="Yes"}/> Yes
          <input type="radio" name="allow_manage_position" value="No" onChange={onChange} checked={ allow_manage_position==="No"}/> No
          <br/>
          <label htmlFor="allow_manage_absence">Allow Manage Absence</label>
          <input type="radio" name="allow_manage_absence" value="Yes" onChange={onChange} checked={ allow_manage_absence==="Yes"}/> Yes
          <input type="radio" name="allow_manage_absence" value="No" onChange={onChange} checked={ allow_manage_absence==="No"}/> No
        </div>
        <div className="form-wrapper">
          <ButtonPrimary text="SUBMIT" onClick={onSubmit}/>
          
        </div>
        
        <div className="form-wrapper">
            <ButtonPrimary text="DELETE"  className="button-danger"  onClick={onDelete}/>
          </div>
      </form>
    </div>
  </>
  )
}