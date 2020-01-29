import React from 'react'
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary'
import FormInput from '../../Util/FormInput/FormInput'

import { convertToForm, API } from '../../Util/common'
import Cookie from 'js-cookie'
import Modal from '../../Util/ModalAndLogin/Modal'
import Loading from '../../Util/ModalAndLogin/Loading'
import Map from '../../Util/Map/Map'
export default class AddOffice extends React.Component{
  api = API;
  
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
    this.setState({positions: pos})
  }
  handleClick = () => {
    this.setState({isLoading: true});
    let officeData = convertToForm(this.refs.addOfficeForm);
    for(let i = 0; i < this.state.positions.length; i++){
      officeData.append('longitude', this.state.positions[i].lng);
      officeData.append('latitude', this.state.positions[i].lat);
    }

    fetch(`${this.api}/api/office`, {
      method: "POST",
      body: officeData,
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({info: data.message, isLoading:false});

    })
    .catch(err => this.setState({ info: err.toString(), isLoading: false}));
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
        
        <h1 className="ta-ctr">Add an Office</h1>
        <Map positions onChange={this.handleMapChange}/>
        <div className="wrapper-form">
          <form ref="addOfficeForm" className="container-row">
            <div className="form-wrapper">
              <label htmlFor="office_id">Office ID *</label>
              <FormInput autoFocus type="text" name="office_id" onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="office_name">Office Name *</label>
              <FormInput type="text" name="office_name" onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="office_name">Office Address *</label>
              <FormInput type="text" name="address" onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper mt-15">
              <ButtonPrimary onClick={this.handleClick} text="SUBMIT"/>
            </div>
          </form>
        </div>
      </>
    )
  }


}



