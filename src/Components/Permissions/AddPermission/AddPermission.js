import React from 'react'
import './AddPermission.css'
import FormInputDropdown from '../../Util/FormInputDropdown/FormInputDropdown'
import FormInput from '../../Util/FormInput/FormInput'
import { convertToForm, API } from '../../Util/common'
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary'
import Cookie from 'js-cookie'
import Modal from '../../Util/ModalAndLogin/Modal'
import FormInputDate from '../../Util/FormInputDate/FormInputDate'
import Loading from '../../Util/ModalAndLogin/Loading'

export default class AddPermission extends React.Component{
  api = API;
  
  state = {
    listPermissions: [],
    listEmployee: [],
    start_range: new Date(),
    end_range: new Date(),
    photos: [],
  }

  handleClick = async() => {
    this.setState({isLoading: true})
    try{
      let attachmentData = new URLSearchParams();
      if (this.state.photos[0].indexOf('jpeg') !== -1) {
        this.setState({isLoading: false, info: `The image you're trying to submit is not in the correct .jpg / .jpeg format`})
        return;
      }
      attachmentData.set('image', this.state.photos[0].slice(23, this.state.photos[0].length))
       
      attachmentData.set('employee_no', this.state.employee_no.value)
      await fetch(`${this.api}/api/permission/attachment`, {
        body: attachmentData,
        method: 'POST',
        headers: {
          'authorization': Cookie.get('JWT_token')
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.data){
          this.setState({ absence_photo_no: data.data.absence_photo_no})
        }
        else{
          this.setState({ info: data.message})
        }
      })
      .catch(err => this.setState({info: err.toString()}))
      
      let permissionData = convertToForm(this.refs.addPermissionForm);
      permissionData.delete('permission_date')
      permissionData.set('permission_reason_no', this.state.permission_reason_no.value)
      permissionData.set('employee_no', this.state.employee_no.value)
      if (this.state.permission_date === "one"){
        permissionData.set('from_date_time', new Date(new Date().toLocaleDateString('en-US')).toJSON())
        permissionData.set('until_date_time', new Date(new Date( new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toLocaleDateString('en-US') ).toJSON()).toJSON() )
      }
      else{
        permissionData.set('from_date_time', this.state.start_range.toJSON());
        permissionData.set('until_date_time', this.state.end_range.toJSON())
      }
      permissionData.set('absence_photo_no', this.state.absence_photo_no)

      await fetch(`${this.api}/api/permission`,{
        body: permissionData,
        method: 'POST',
        headers: {
          'authorization': Cookie.get('JWT_token')
        }
      })
      .then(res => res.json())
      .then(data => this.setState({info: data.message}))
      .catch(err => this.setState({info: err.toString()}))

    }
    catch(ex){
      this.setState({info: 'Please fill all required fields.'})
    }

    this.setState({isLoading: false})
  }

  handleChange = (evt) => {
    
    const {type, name, value} = evt.target;

    if (type==="file"){
      this.readImages(evt.target.files)
    }
    else{
      this.setState({
        [name]: value
      })
    }
  }

  readImages = (images) => {
    //since it turns out the images to upload only 1, 
    //so return if there's an image, comment line 71 
    //to enable append multiple photos
    if (this.state.photos.length) return;
 
    if (images){
      //since only 1 phtoo, so choose 1 photo
      for(let i = 0; i < 1; i++){  
        let reader = new FileReader();
        reader.addEventListener('load', e => {
            let lastPhotos = this.state.photos;
            lastPhotos.push(e.target.result)
            this.setState({
              photos: lastPhotos
            })
        });
        reader.readAsDataURL(images[i])
      }
    }
    else this.setState({info: "Images error to load. Please try again"});
  }

  handleDeletePhoto = (id) => {
    let newPhoto = this.state.photos;
    newPhoto.splice(id,1);
    this.setState({photos: newPhoto})
  }

  toggleDateRangeModal = () => this.setState({showDateRange: !this.state.showDateRange})
 
  filterAbsencesByDate = () => {
    this.toggleDateRangeModal();

    if (this.state.start_range > this.state.end_range){
      this.setState({info: "The start range shouldn't precede the end range."})
    }
    else{
      this.setState({info: "Date Range Saved."})
    }
  }
  resetFilterByDate = () => {
    this.setState({start_range: null, end_range: null})

    this.toggleDateRangeModal()
  }

  componentDidMount = async() => {
    this.setState({isLoading: true})

    await fetch(`${this.api}/api/permission/reason`, {
      headers:{
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      let reasons = []
      if (data.data){
        data.data.forEach(reason => {
          reasons.push({
            value: reason.permission_reason_no,
            label: reason.permission_reason_name,
          })
        })
        this.setState({listPermissions: reasons})
      }
      else this.setState({info: data.message })
    })
    .catch(err => this.setState({ info: err.toString()}));
    
    await fetch(`${this.api}/api/employee`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        let employees = [];
        data.data.forEach(emp => {
          employees.push({
            value: emp.employee_no,
            label: emp.employee_name
          })
        })
        this.setState({listEmployee: employees})
      }
      else this.setState({info: this.state.info + ' ' + data.message })
    })
    .catch(err => this.setState({ info: err.toString()}));
    this.setState({isLoading: false})

  }

  toggleAttachmentsModal = () => this.setState({ showAttachmentsModal: !this.state.showAttachmentsModal })
  
  componentDidUpdate(){
  }
  render(){
    
    
    return(
      <>
        {this.state.isLoading && <Loading/>}
        {this.state.info && 
          
          <Modal blurry onClick={() => {}}>
            
            <div className="container-col container-ctr" >
              {this.state.photos[0].length && <img height="200px" width="auto" src={this.state.photos[0]} alt=""/>}
              <h1>{this.state.info}</h1>
              <ButtonPrimary onClick={(e) => {this.setState({info: ''}); e.stopPropagation(); }} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        
        {this.state.showDateRange && <DateRangeModal initialValueEnd={this.state.end_range} initialValueStart={this.state.start_range} onClearFilter={this.resetFilterByDate} onChange={this.handleChange} onClick={this.filterAbsencesByDate} /> }
        {this.state.showAttachmentsModal && <AttachmentsModal photos={this.state.photos} onClose={this.toggleAttachmentsModal} addPhoto={this.handleChange} deletePhoto={this.handleDeletePhoto}/>}
        <h1 className="ta-ctr">Add a Permission</h1>
        <div className={`wrapper-form form-permission ${this.state.permission_date==="custom" ? "" : "uneven-form"}`}>
          <form ref="addPermissionForm" className="container-row">
            <div className="form-wrapper">
              <label htmlFor="employee_no">Employee's Name</label>
              <FormInputDropdown onChange={this.handleChange} options={this.state.listEmployee} className="mt-15"  placeholder="-- Select an Employee --" name="employee_no"/>
            </div>
            <div className="form-wrapper"></div>
            <div className="form-wrapper">
              <label htmlFor="permission_reason_no">Permission Reason</label>
              <FormInputDropdown onChange={this.handleChange} options={this.state.listPermissions} className="mt-15"name="permission_reason_no"  placeholder="-- Select a Reason --"/>
            </div>
            <div className="form-wrapper mt-15">
              <label  htmlFor="permission_date">Permission Date</label>
              <br/>
              <input type="radio" onChange={this.handleChange} name="permission_date" value="one"/> One Day
              <input type="radio" onChange={this.handleChange} name="permission_date" value="custom"/> Custom Duration
            
            </div>
            <div className="form-wrapper">
              <label htmlFor="description">Description</label>
              <FormInput type="text" onChange={this.handleChange} name="description"/>
            </div>
            {
              this.state.permission_date === "custom" && 
              <div className="form-wrapper">
                <ButtonPrimary text="SET DATE RANGE" className="button-danger" onClick={ this.toggleDateRangeModal } />
              </div>
            }
            <div className="form-wrapper">
              
              <ButtonPrimary className="button-danger" text="ATTACHMENTS" onClick={this.toggleAttachmentsModal}/>
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

const DateRangeModal = ({onChange, onClick, onClearFilter, initialValueStart, initialValueEnd}) => {
  // console.log(initialValueStart, initialValueEnd)
  return(
    <Modal>
      <div className="container-col container-ctr">
        <h1>Choose Date Range for permission</h1>
        <h4>Note: The timezone is your timezone.</h4>
        <FormInputDate onChange={onChange} icon="fa-calendar" name="start_range" hasInitialValue value={initialValueStart.toJSON()} className="date-modal"/> to
        <FormInputDate onChange={onChange} icon="fa-calendar" name="end_range"  hasInitialValue value={initialValueEnd.toJSON()} className="date-modal"/>
        <ButtonPrimary text="SAVE" onClick={onClick} style={{marginTop: '15px'}}/>
        <ButtonPrimary text="RESET SAVED DATE" onClick={onClearFilter} style={{marginTop: '15px'}}/>
      </div>
    </Modal>
  )
}

const AttachmentsModal = ({deletePhoto, addPhoto, onClose, photos}) => {
  let listPhoto = photos.map( (photo,idx) => (
    <div className="attachment-photo container-row spc-bt" key={idx}>
      <img src={photo} width="70px" height="70px"/>
      <ButtonPrimary icon="window-close" style={{width: '50px'}}  onClick={() => deletePhoto(idx)} />
    </div>
  ))
  listPhoto.length && listPhoto.unshift(<h2>Preview of photos</h2>)
  return(
    <Modal blurry>
      <div className="container-col attachment-modal container-ctr">
        <h1 className="ta-ctr">Attachments</h1>

        {listPhoto}

        <FormInput type="file" onChange={addPhoto} name="photo"/>
        <ButtonPrimary onClick={onClose} text="SAVE AND CLOSE" className="mt-15"/>
        <h3>Delete last photo if you want to change the photo (only .jpg/.jpeg format allowed)</h3>
      </div>
    </Modal>
  )

}