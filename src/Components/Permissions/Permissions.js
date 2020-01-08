import React from 'react'
import './Permissions.css'
import { Link } from 'react-router-dom'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import Card from '../Util/Card/Card'
import Cookie from 'js-cookie'
import Loading from '../Util/ModalAndLogin/Loading'
import Modal from '../Util/ModalAndLogin/Modal'
import { API } from '../Util/common'
export default class Permissions extends React.Component{
  api = API
  state={
    tab: true,
    permissions: [],
    permissionDetail: {}
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

  handleClickAcceptReject = (permission_no, status, remarks) => {
    //TODO: accept permission on this id
    if (!window.confirm(`Are you sure want to ${status? "accept" : "reject"} this permission?`)) return;
    let sendData = new URLSearchParams();
    sendData.set('request_status', status)
    sendData.set('remarks', remarks)
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
        console.log(newCards)
        this.setState({permissions: newCards})
      }
    })
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
        console.log(data.data)
        this.setState({ 
          
          permissionDetail: { 
            ...data.data
          } 
        })
      }
      else this.setState({info: data.message})
    })
    .catch(err => this.setState({info: err.toString()}))
    
    //TODO : GET IMAGE URL
   

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

        {this.state.tab ? <RequestsCard onSubmit={this.handleClickAcceptReject} permissions={this.state.permissions}/> : <ProcessedCard showDetail={this.showDetail} permissions={this.state.permissions} />}
       
      </>
    )
  }
}

const RequestsCard = ({onSubmit, permissions}) => {
  const card = permissions.map(perm => {
    console.log(perm)
    return(
      <Card width="325px" height="325px"  className="container-col container-ctr card-permission">
        <p>{perm.employee_name}</p>
        <p>{new Date(perm.from_date_time).toDateString()}</p>
        <p>to</p>
        <p>{new Date(perm.until_date_time).toDateString()}</p>
        <div className="container-col ta-left full-width">
          <p>Remarks: {perm.remarks || '-'}</p>
          <p>Description: {perm.description}</p>
        </div>
        <div className="container-row">
            <ButtonPrimary text="ACCEPT" onClick={() => onSubmit(perm.permission_request_no, true, perm.remarks)} style={{width: '100%'}} className="button-success"/>
            <ButtonPrimary text="REJECT" onClick={() => onSubmit(perm.permission_request_no, false, perm.remarks)} style={{width: '100%'}} className="button-danger"/>
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
const PermissionDetail = ({perm, onClose}) => (
  <Modal blurry>
    <div className="container-col bold">
      <img src={perm.image_url} height="200px" width="auto" alt="No Photo"/>
        <p>ID: {perm.employee_id}</p>
        <p>Name: {perm.employee_name}</p>
        <p>From: {new Date(perm.from_date_time).toDateString()}</p>
        <p>To: {new Date(perm.until_date_time).toDateString()}</p>
        <div className="container-col ta-left full-width">
          <p>Reason: {perm.permission_reason_name}</p>
          <p>Remarks: {perm.remarks === "null" ? '-' : perm.remarks}</p>
          <p>Description: {perm.description}</p>
        </div>
        <ButtonPrimary text="CLOSE" onClick={onClose} style={{width: '100%'}} className="button-danger"/>
    </div>
  </Modal>
)