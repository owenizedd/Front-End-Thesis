import React from 'react'
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary'
import FormInput from '../../Util/FormInput/FormInput'

import { convertToForm, getSession, API } from '../../Util/common'
import Cookie from 'js-cookie'
import Modal from '../../Util/ModalAndLogin/Modal'
import Loading from '../../Util/ModalAndLogin/Loading'
import Map from '../../Util/Map/Map'
import { Redirect } from 'react-router-dom'
class EditOfficeComponent extends React.Component{
  api = API

  state = {
    office_id: '',
    office_name: '',
    address: '',
    info: '',
    positions: [],
    isLoading: false,
    lastPolygon: null,
  }
  handleChange = (evt) => {
    
    const {name, value} = evt.target;
    this.setState({
      [name]: value
    })
  }
  handleMapChange = (pos) => {
    pos.longitude = pos.lng;
    pos.latitude = pos.lat; 
    this.setState({positions: pos})
  }
  handleClick = () => {
    this.setState({isLoading: true});
    let officeData = convertToForm(this.refs.editOfficeForm);
    
    for(let i = 0; i < this.state.positions.length; i++){
      officeData.append('longitude', this.state.positions[i].lng);
      officeData.append('latitude', this.state.positions[i].lat);
    }


    fetch(`${this.api}/api/office/${this.props.match.params.id}`, {
      method: "PUT",
      body: officeData,
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({info: data.message, isLoading:false});

    })
    .catch( err => {
      this.setState({ info: err.toString(), isLoading: false});
    })

  }

  componentDidMount = () => {
    this.setState({isLoading: true})
    fetch(`${this.api}/api/office/${this.props.match.params.id}`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        this.setState({
          office_id: data.data.office_id,
          office_name: data.data.office_name,
          address: data.data.address,
          positions: data.data.office_location,
          isLoading: false,
        })
      }
    })
    .catch(err => this.setState({isLoading: false}))
  }

  deleteOffice = () => {
    if (!window.confirm("Are you sure want to delete this office?")) return
    
    fetch(`${this.api}/api/office/${this.props.match.params.id}`, {
      method: "DELETE",
      headers: {
        'authorization': Cookie.get("JWT_token")
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({info: data.message, isLoading:false})
    })
    .catch(err => this.setState({isLoading: false, info: err.toString}));
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
        
        <h1 className="ta-ctr">Edit an Office</h1>
        <Map positions={this.state.positions} onChange={this.handleMapChange}/>
        <div className="wrapper-form">
          <form ref="editOfficeForm" className="container-row">
            <div className="form-wrapper">
              <label htmlFor="office_id">Office ID</label>
              <FormInput  type="text" name="office_id" value={this.state.office_id} onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="office_name">Office Name</label>
              <FormInput autoFocus type="text" name="office_name" value={this.state.office_name} onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="office_name">Office Address</label>
              <FormInput type="text" name="address" value={this.state.address} onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper mt-15">
            <ButtonPrimary onClick={this.deleteOffice} className="button-danger" text="DELETE OFFICE"/>
              <ButtonPrimary onClick={this.handleClick} text="SUBMIT"/>
            </div>
          </form>
        </div>
      </>
    )
  }
}

const EditOffice =  ({match}) => {
  if (!getSession()) return <Redirect to="/"/>
  else if (!getSession('allowOffice')) return <Redirect to="/"/>
  else return <EditOfficeComponent match={match}/>
}
export default EditOffice 




