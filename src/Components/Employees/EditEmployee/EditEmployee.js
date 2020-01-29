import React from 'react'
import { getSession } from '../../Util/common';
import { Redirect } from 'react-router-dom';
import FormInput from '../../Util/FormInput/FormInput'
import FormInputDate from '../../Util/FormInputDate/FormInputDate'
import FormInputDropdown from '../../Util/FormInputDropdown/FormInputDropdown'
import 'react-datepicker/dist/react-datepicker.css';
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary'
import { convertToForm, API } from '../../Util/common'
import Cookie from 'js-cookie'
import Modal from '../../Util/ModalAndLogin/Modal'
import Loading from '../../Util/ModalAndLogin/Loading'
import './EditEmployee.css'


class EditEmployeeComponent extends React.Component{
  api = API
  state={
    info: '',
    isLoading: false,
    listOffices: [],
    listPositions: [],
    listRoles: [],
    imgBase64s: [],
    showModalProfilePictures: false,
  }

  handleChange = (evt) => {

    const {name, value} = evt.target;
    this.setState({
      [name]: value
    })
  }
  handleClickSubmit = async() => {
    
    this.setState({isLoading: true});
    let employeeData = convertToForm(this.refs.editEmployeeForm);
    let dateParts = employeeData.get('work_date').split('-');
    let workDate = new Date(dateParts[2], dateParts[1] -1, dateParts[0]);
    
    dateParts = employeeData.get('birthdate').split('-');
    let birthDate = new Date(dateParts[2], dateParts[1] -1, dateParts[0]);
    
    employeeData.set('work_date', workDate.toDateString()) 
    employeeData.set('birthdate', birthDate.toDateString());

    await fetch(`${this.api}/api/employee/${this.props.match.params.id}`, {
      method: 'PUT',
      body: employeeData,
      headers: {
        'authorization': Cookie.get("JWT_token")
      },
    })
    .then(res=>  res.json())
    .then(data => {
      this.setState({info: data.message, isLoading: false})
      
    })
    .catch(err=> this.setState({info: err.toString(), isLoading: false}))
    
  }
  componentDidMount = async() => {
    //fetch current employee information
    this.setState({isLoading:true})
    
    await fetch(`${this.api}/api/employee/${this.props.match.params.id}`, {
      headers:{
        'authorization': Cookie.get("JWT_token")
      }
    })
    .then( res => res.json())
    .then( data => {
      this.setState( prevState => {
        // didn't think about data.data before...

        return {
          ...prevState,
          ...(data.data), 
        }
      })
      this.setState({
        gender: this.state.gender? "Yes" : "No",
        
      })
    })

    //fetch all photo base64
    if (this.state.employee_photo_no){
      this.state.photos.forEach( (photo,idx) => {
        if (photo.employee_photo_no===this.state.employee_photo_no){
          this.setState({selectedPhotoIdx: idx})
        }
      })
    }
    if (this.state.photos && this.state.photos.length){
      this.state.photos.forEach( async(photo,idx) => {
        await fetch(photo.image_url, {
          headers: {
            'authorization': Cookie.get('JWT_token')
          }
        })
        .then(res => res.arrayBuffer())
        .then(buff => {
          this.state.imgBase64s[idx] = 'data:image/jpeg;base64,' + btoa(String.fromCharCode(...new Uint8Array(buff)))
        })
      })
    }

    //reason why here set load to false because to let user to see the content
    //not blocking user from accessing the page
    this.setState({isLoading: false})

    
    //fetch positions, roles, offices options

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
            label: pos.position_name,
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

  }
  deleteEmployee = () => {

    if (!window.confirm("Are you sure want to delete this employee?")) return
    
    fetch(`${this.api}/api/employee/${this.props.match.params.id}`, {
      method: "DELETE",
      headers: {
        'authorization': Cookie.get("JWT_token")
      }
    })
    .then(res => res.json())
    .then(data => {

      this.setState({info: data.message, isLoading:false})
      //TODO: WHEN SUCCESS DELETE, REDIRECT TO EMPLOYEE, USE HISTORY OF REACT ROUTER!
    })
    .catch(err => this.setState({isLoading: false, info: err.toString}));
  }

  handleClickClearSession = () => {
    if (!window.confirm("Are you sure want to clear session of this employee?")) return;
    
    fetch(`${this.api}/api/employee/session/${this.props.match.params.id}`, {
      method: "PUT",
      headers: {
        "authorization": Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => this.setState({ info: data.message}))
    .catch(err => this.setState({info: err.toString()}))
  }

  handleClickResign = () => {
    if (!window.confirm("Are you sure want to set resign to this employee?")) return;

    fetch(`${this.api}/api/employee/resign/${this.props.match.params.id}`, {
      method: "PUT",
      headers: {
        "authorization": Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => this.setState({ info: data.message}))
    .catch(err => this.setState({ info: err.toString()}))
  }
  toggleModalProfilePictures = () => {
    this.setState({showModalProfilePictures: !this.state.showModalProfilePictures})
  }
  setProfilePicture = (idx) => {
    let picData = new URLSearchParams();
    picData.set('employee_photo_no', this.state.photos[idx].employee_photo_no)
    
    fetch(`${this.api}/api/employee/face/${this.props.match.params.id}`, {
      body: picData,
      method: 'PUT',
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.message.indexOf('updated')!==-1) this.setState({selectedPhotoIdx: idx})
      
    })

  }
  handleClickDeletePhotos = (id) => {
    this.setState({isLoading: true})
    fetch(`${this.api}/api/employee/face/${this.props.match.params.id}`, {
      method: "DELETE",
      headers:{
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then( data =>{
      this.setState({info: data.message, isLoading: false})

      if (data.message.indexOf('removed') !== -1){
        this.setState({
          imgBase64s: []
        })
      }
    })
    .catch(err => this.setState({info: err.toString(), isLoading: false}))


    
  }
  componentDidUpdate(){

  }
  
  render(){
    const officeValue = this.state.listOffices.filter(ofc => ofc.value===this.state.office_no)[0]
    const positionValue = this.state.listPositions.filter(pos => pos.value===this.state.position_no)[0]
    const roleValue = this.state.listRoles.filter(role => role.value===this.state.role_no)[0]

    return(
      <>
        {this.state.info && 
          
          <Modal blurry onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              <ButtonPrimary onClick={(e) => {this.setState({info: ''}); e.stopPropagation(); }} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        {
          this.state.showModalProfilePictures && <ModalProfilePictures selectedPhotoIdx={this.state.selectedPhotoIdx} photos={this.state.imgBase64s} onClick={this.setProfilePicture} onClose={this.toggleModalProfilePictures}/>
        }
        {this.state.isLoading && <Loading/>}
        <div className="wrapper-form employee">
          {/* <FormInputDate */}
          <h1 className="ta-ctr">Edit an Employee</h1>
          <form className="container-row" ref="editEmployeeForm" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="form-wrapper">
              <label  htmlFor="username">Username *</label>
              <FormInput required type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="password">Password</label>
              <FormInput required autofocus hidden type="password" onChange={this.handleChange} name="password" value={this.state.password}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="employee_name">Full Name *</label>
              <FormInput required type="text" onChange={this.handleChange} name="employee_name" value={this.state.employee_name}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="employee_id">Employee ID *</label>
              <FormInput required type="text" onChange={this.handleChange} name="employee_id" value={this.state.employee_id}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="work_date">Work Date</label>
              <FormInputDate hasInitialValue value={this.state.work_date} onChange={this.handleChange} icon="fa-calendar" name="work_date"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="office_no">Office *</label>
              <FormInputDropdown options={this.state.listOffices} value={officeValue} onChange={this.handleChange} placeholder="Select an office..." name="office_no"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="position_no">Position *</label>
              <FormInputDropdown options={this.state.listPositions} value={positionValue} onChange={this.handleChange} placeholder="Select a position..." name="position_no"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="role_no">Role *</label>
              <FormInputDropdown optional options={this.state.listRoles} value={roleValue} onChange={this.handleChange} placeholder="Select a role..." name="role_no"/>
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
              <FormInputDate hasInitialValue value={this.state.birthdate} onChange={this.handleChange} icon="fa-calendar" name="birthdate"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="gender" className="mr-15">Gender</label>
              <input type="radio" name="gender" value="Yes" checked={this.state.gender==="Yes"} onChange={this.handleChange}/> Male
              <input type="radio" name="gender" value="No" checked={this.state.gender==="No"} onChange={this.handleChange}/> Female
              <div className="container-row container-employee-buttons container-ctr mt-15">
                <ButtonPrimary onClick={this.toggleModalProfilePictures} text="SET PROFILE PICTURE" style={{width: '140px'}} className="button-success"/>
                <ButtonPrimary onClick={this.deleteEmployee} text="DELETE EMPLOYEE" style={{letterSpacing: '1px'}} className=" ml-15 button-danger"/>
              </div>
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

const ModalProfilePictures = ({photos, onClick, onClose, selectedPhotoIdx}) => {

  
  let listPhoto = photos.map( (photo,idx) => {
    let colorRow = idx === selectedPhotoIdx ? 'row-green' : ''
    return(
    <div className={colorRow + " attachment-photo container-row spc-bt"} style={{width: '25vw'}} key={idx}>
      <img src={photo} width="200px" height="auto"/>
      <ButtonPrimary className="button-success" icon="check" text="SET THIS PHOTO" style={{marginLeft: '-130px',width: '200px'}}  onClick={() => onClick(idx)} />
    </div>

    )
  })
  return(
    <Modal blurry>
      <div className="container-col attachment-modal container-ctr scrollable-modal">
        <h1 className="ta-ctr">Registered Photos</h1>

        {listPhoto}
        {listPhoto.length ? '' : <p>No Photo</p>}
        <ButtonPrimary text="CLOSE" onClick={onClose}/>
      </div>
    </Modal>
  )
}

const EditEmployee = ({match}) => getSession() ? (getSession('allowEmployee') ? <EditEmployeeComponent match={match}/> : <Redirect to="/"/>) : <Redirect to="/"/>

export default EditEmployee