import React from 'react'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import FormInput from '../Util/FormInput/FormInput'
import './Roles.css'
import { convertToForm, API } from '../Util/common'
import Cookie from 'js-cookie'
import Modal from '../Util/ModalAndLogin/Modal'
import Loading from '../Util/ModalAndLogin/Loading'
import Card from '../Util/Card/Card'
import { Link } from 'react-router-dom'
export default class Roles extends React.Component{

  api = API
  state={
    info: '',
    isLoading: false,
    roles: []
  }
  handleChange = (evt) => {
    
    const {name, value} = evt.target;
    
    this.setState({
      [name]: value
    })
  
  }

  componentDidMount(){
    this.setState({isLoading: true});
    fetch(`${this.api}/api/role`, {
      headers:{
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
    
      if (data.data){
        this.setState({roles: data.data, isLoading: false});
      }
      else this.setState({info: data.message, isLoading: false});
    })
    .catch(err => this.setState({isLoading: false, info: err.toString()}))

  }
  
  render(){
    const cards = this.state.roles.map( role => {
      return (
        <Card width="300px" height="100px">
          <Link to={`/roles/edit/${role.role_no}`}>
            {role.role_id}
          </Link>
          <p>{role.role_name}</p>
        </Card>
      )
    })
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
        <div className="container-row container-header spc-ev mb-15">
          <h1 className="mr-15 mb">Roles</h1>
          <Link to="/roles/add">
            <ButtonPrimary text="ADD A ROLE" style={{width: '180px'}} />
          </Link>
        </div>
        
        <div className="container-row spc-ev">
          {cards}
        </div>
        
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

