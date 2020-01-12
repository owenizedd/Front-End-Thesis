import React from 'react'
import './Permissions.css'
import { Link } from 'react-router-dom'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import Card from '../Util/Card/Card'
import Cookie from 'js-cookie'
import Loading from '../Util/ModalAndLogin/Loading'
import Modal from '../Util/ModalAndLogin/Modal'
import { API } from '../Util/common'
import FormInput from '../Util/FormInput/FormInput'
export default class Permissions extends React.Component{
  api = API
  state={
    tab: true,
    permissions: [],
    permissionDetail: {},
    remarks: null,
  }
  toggleTab = async() => {
    
    await this.setState({tab: !this.state.tab});
    if (this.state.tab){ //show requests
      //show all the request card
      this.fetchPermissions()
    }
    else{ //show processed
      //show all the processed card
      this.fetchPermissions('?is_processed=true')
    }
  }
  componentDidMount(){
    this.fetchPermissions()
  }
  fetchPermissions = (query) => {
    this.setState({isLoading: true, permissions: []})
    fetch(`${this.api}/api/permission${query ? query : ''}`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res=> res.json())
    .then(data => {
      if (data.data){
        this.setState({permissions: data.data, isLoading: false})
      }
      else this.setState({info: data.message, isLoading: false})
    })
    .catch( err => this.setState({info: err.toString(), isLoading: false}))
    
  }
  handleChange = (evt) => {
    const {name, value} = evt.target;

    this.setState({
      [name]: value
    })
  }
  handleClickAcceptReject = (permission_no, status, send) => {
    // accept permission on this id, algorithm recursively to make this reusable
    if (!send){
      this.setState({
        info: 'Please input remarks for this permission request',
        info_content: (
          <>
            <FormInput type="text" name="remarks" value={this.state.remarks} onChange={this.handleChange}/>
            <ButtonPrimary text="SUBMIT" applyToParent className="mb-15 mt-15" onClick={() => this.handleClickAcceptReject(permission_no, status, true)}/>
          </>
        )
      })
    }
    else{
      this.setState({info: '', info_content: null, isLoading: true});

      let sendData = new URLSearchParams();
      sendData.set('request_status', status)
      sendData.set('remarks', this.state.remarks)
      fetch(`${this.api}/api/permission/status/${permission_no}`, {
        body: sendData,
        method: "PUT",
        headers: {
          'authorization': Cookie.get('JWT_token')
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({info: data.message})
        if (data.message.indexOf("updated")!==-1){
          let newCards = [...this.state.permissions];
          newCards = newCards.filter(prm => prm.permission_request_no !== permission_no);
          this.setState({permissions: newCards, remarks: null, isLoading: false})
        }
      })
      .catch(err => this.setState({info: err.toString(), isLoading: false}))
    }
  }

  showDetail = async(permission_request_no) => {
    this.setState({isLoading: true})
    await fetch(`${this.api}/api/permission/${permission_request_no}`, {
      headers: {
        'authorization': Cookie.get("JWT_token")
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        this.setState({ 
          
          permissionDetail: { 
            ...data.data
          } 
        })
      }
      else this.setState({info: data.message})
    })
    .catch(err => this.setState({info: err.toString()}))
    

   

    await fetch(this.state.permissionDetail.image_url, {
      headers:{
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.blob())
    .then(data => {
      let reader = new FileReader();
      reader.onload = e => {
        let newPermissionDetail = {...this.state.permissionDetail}
        newPermissionDetail.image_url = e.target.result;
        this.setState({
          showPermissionDetail: true,
          permissionDetail: newPermissionDetail,
          isLoading: false,
        })
      }
      reader.readAsDataURL(data);
    })
    .catch(err => this.setState({info: err.toString(), isLoading: false}))
  }
  closeDetail = () => {
    this.setState({showPermissionDetail: false})
  }

  
  render(){
    return(
      <>
        {this.state.isLoading && <Loading/>}
        {this.state.info && 
          
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              {this.state.info_content}
              <ButtonPrimary onClick={(e) => this.setState({info: ''})} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        {this.state.showPermissionDetail && <PermissionDetail perm={this.state.permissionDetail} onClose={this.closeDetail} /> }
        <div className="container-row container-header spc-ev mb-15">
          <h1 className="mr-15 mb">Permissions</h1>
          <Link to="/permissions/add">
            
            <ButtonPrimary text="CREATE A PERMISSION" style={{width: '300px'}}/>
          </Link>
        </div>
        <div className="container-row m-5">
          <button className={"tab-link " + (this.state.tab && "active")} onClick={this.toggleTab}>REQUESTS</button>
          <button className={"tab-link " + (!this.state.tab && "active")} onClick={this.toggleTab}>PROCESSED</button>
        </div>

        {this.state.tab ? <RequestsCard onSubmit={this.handleClickAcceptReject} permissions={this.state.permissions} viewAttachment={this.showDetail}/> : <ProcessedCard showDetail={this.showDetail} permissions={this.state.permissions} />}
       
      </>
    )
  }
}

const RequestsCard = ({onSubmit, permissions, viewAttachment}) => {
  const card = permissions.map(perm => {
    // console.log(perm)
    return(
      <Card width="325px" height="250px"  className="container-col container-ctr card-permission">
        <p>{perm.employee_name}</p>
        <p>{new Date(perm.from_date_time).toDateString()}</p>
        <p>to</p>
        <p>{new Date(perm.until_date_time).toDateString()}</p>
        <div className="container-col ta-left full-width">
          <p>Description: {perm.description}</p>
        </div>
        <div className="container-row">
            <ButtonPrimary text="ACCEPT" onClick={() => onSubmit(perm.permission_request_no, true, false)} style={{width: '100%'}} className="button-success"/>
            <ButtonPrimary text="REJECT" onClick={() => onSubmit(perm.permission_request_no, false, false)} style={{width: '100%'}} className="button-danger"/>
            <ButtonPrimary text="VIEW DETAILS" onClick={() => viewAttachment(perm.permission_request_no)} style={{width: '100%'}}/>
        </div> 
      </Card>
    )
  })

  return(
    <div className="container-row container-card">
      {card.length ? card : "Currently there is no any permission request."}
    </div>
  )
}

const ProcessedCard = ({permissions, showDetail}) => {
  const card = permissions.map(perm => {
    return(
      <Card width="325px" height="200px" className="container-col container-ctr card-permission">
        <p>{perm.employee_name}</p>
        <p>{new Date(perm.from_date_time).toDateString()}</p>
        <p>to</p>
        <p>{new Date(perm.until_date_time).toDateString()}</p>
        <p>Remarks: {perm.remarks === "null" ? '-' : perm.remarks}</p>
        <strong>Processed By: {perm.processed_by}</strong> 
        <ButtonPrimary onClick={() => showDetail(perm.permission_request_no)} text="SHOW DETAILS" />
      </Card>
    )
  })

  return(
    <div className="container-row">
      {card.length ? card : "Currently there is no any permission processed."}
    </div>
  )
}

/*
absence_photo_no: "12"
​
company_no: "1"
​
created_by: "ryanowen"
​
created_on: "2020-01-06T11:08:20.127Z"
​
description: "Urusan Keluarga"
​
employee_id: "EM-007"
​
employee_name: "John Wick"
​
employee_no: "1"
​
from_date_time: "2020-02-02T11:07:50.000Z"
​
image_url: "http://157.230.43.112:3000/api/image/absence/12"
​
permission_reason_name: "Izin"
​
permission_reason_no: 2
​
permission_request_no: "4"
​
processed_by: "ryanowen"
​
processed_on: "2020-01-06T11:08:27.908Z"
​

request_status: true
​
until_date_time: "2020-02-04T11:07:50.000Z"
​
*/
const PermissionDetail = ({perm, onClose}) => {
   let img_url = (perm.absence_photo_no && perm.image_url) || 'data:image/jpeg;base64,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';
   return(
    <Modal blurry>
      <div className="container-col bold">
        <img src={img_url} width='250px' height="auto" alt="Image is not valid"/>
          <p>ID: {perm.employee_id}</p>
          <p>Name: {perm.employee_name}</p>
          <p>From: {new Date(perm.from_date_time).toDateString()}</p>
          <p>To: {new Date(perm.until_date_time).toDateString()}</p>
          <div className="container-col ta-left" style={{width: '80%'}}>
            <p>Reason: {perm.permission_reason_name}</p>
            <p>Remarks: {perm.remarks === "null" ? '-' : perm.remarks}</p>
            <p>Description: {perm.description}</p>
            {perm.request_status && <p>Request: {perm.request_status ? "Accepted" : "Rejected" }</p>}
          </div>
          <ButtonPrimary text="CLOSE" onClick={onClose} style={{width: '100%'}} className="button-danger"/>
      </div>
    </Modal>
  )
}