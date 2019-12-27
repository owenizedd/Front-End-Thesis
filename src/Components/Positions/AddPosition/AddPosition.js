import React from 'react';
import FormInput from '../../Util/FormInput/FormInput'
import FormInputDropdown from '../../Util/FormInputDropdown/FormInputDropdown'
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary';
import Modal from '../../Util/ModalAndLogin/Modal';
import Loading from '../../Util/ModalAndLogin/Loading';
import { convertToForm } from '../../Util/common';
import Cookie from 'js-cookie'
export default class AddPosition extends React.Component{
  api = 'http://157.230.43.112:3000'

  state = {
    isLoading: false,
    info: ''
  }
  handleChange = (evt) => {
    const {name, value} = evt.target;
    this.setState({
      [name]: value
    })
  }

  handleClick = () => {
    this.setState({isLoading: true});
    let positionData = convertToForm(this.refs.addPositionForm);
    if (positionData.get('superior_position_no').length==0) positionData.delete('superior_position_no')
    // positionData.forEach((val,key) => {
    //   if (key.indexOf('leave')!==-1 || key.indexOf('late')!==-1){
    //     let number = 0;
    //     for(let i = 0; i < val.length; i++){
    //       if (val[i] >= '0' && val[i] <='9'){
    //         number = number * 10 +  +val[i]
    //       }
    //     }
    //     positionData.set(key, number)
    //   }
    // })
    
    fetch(`${this.api}/api/position`, {
      method: 'POST',
      body: positionData,
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => this.setState({isLoading: false, info: data.message}))
    .catch(err => this.setState({isLoading: false, info: err.toString()}))
  

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
        <h1 className="ta-ctr">Add a Position</h1>
        <div className="wrapper-form uneven-form label-ls-0">
          <form ref="addPositionForm"  className="container-row">
            <div className="form-wrapper">
              <label htmlFor="position_name">Position ID</label>
              <FormInput type="text" onChange={this.handleChange} required name="position_id"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="position_name">Position Name</label>
              <FormInput type="text" onChange={this.handleChange} required name="position_name"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="superior_position_no">Superior No.</label>
              <FormInputDropdown name="superior_position_no" placeholder="-- Superior No. (Optional) --" onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="">Maximum Days Leave Anually</label>
              <FormInput type="text" onChange={this.handleChange} required name="leave_quota"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="">Leave Valid After Days</label>
              <FormInput type="text" onChange={this.handleChange} required name="leave_valid_after_days"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="late_tolerance">Late Tolerance (Minutes)</label>
              <FormInput type="text" onChange={this.handleChange} required name="late_tolerance"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="">Leave Valid For Days</label>
              <FormInput type="text" onChange={this.handleChange} required name="leave_valid_for_days"/>
            </div>
            <div className="form-wrapper mt-15">
              <label htmlFor="">Flexible Work Hours</label>
              <input type="radio" value="Yes" name="is_flexible_work_hours" id=""/> Yes
              <input type="radio" value="No" name="is_flexible_work_hours" id=""/> No
              <br/>
              <label htmlFor="">Use Company Settings</label>
              <input type="radio" value="Yes" name="is_follow_company_settings" id=""/> Yes
              <input type="radio" value="No" name="is_follow_company_settings" id=""/> No
            </div>
            <div className="form-wrapper">
            <label htmlFor="">Must Absence at Designated Office</label>
              <br/>
              <input type="radio" value="Yes" name="must_same_office" id=""/> Yes
              <input type="radio" value="No" name="must_same_office" id=""/> No
              <br/>
              <label htmlFor="">Absence by Photo</label>
              <input type="radio" value="Yes" name="must_photo" id=""/> Yes
              <input type="radio" value="No" name="must_photo" id=""/> No
            </div>
            <div className="form-wrapper">
            <label htmlFor="">Allow Use Other Device</label>
              <input type="radio" value="Yes" name="allow_nebeng" id=""/> Yes
              <input type="radio" value="No" name="allow_nebeng" id=""/> No
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