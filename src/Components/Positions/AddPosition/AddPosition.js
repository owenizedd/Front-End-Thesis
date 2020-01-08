import React from 'react';
import FormInput from '../../Util/FormInput/FormInput'
import FormInputDropdown from '../../Util/FormInputDropdown/FormInputDropdown'
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary';
import Modal from '../../Util/ModalAndLogin/Modal';
import Loading from '../../Util/ModalAndLogin/Loading';
import { convertToForm, API } from '../../Util/common';
import Cookie from 'js-cookie'
export default class AddPosition extends React.Component{
  api = API

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

  async componentDidMount(){
    this.setState({isLoading:true})
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
            label: pos.position_id + ' | ' + pos.position_name
          })
        })
        this.setState({listPositions: positions})
      }
      else this.setState({info: data.message})
    })
    .catch( err => this.setState({ info: err.toString()}))

    this.setState({isLoading: false})
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
              <FormInputDropdown options={this.state.listPositions} name="superior_position_no" placeholder="-- Superior No. (Optional) --" onChange={this.handleChange}/>
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
              <label htmlFor="late_tolerance_mins">Late Tolerance (Minutes)</label>
              <FormInput type="text" onChange={this.handleChange} required name="late_tolerance_mins"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="">Leave Valid For Days</label>
              <FormInput type="text" onChange={this.handleChange} required name="leave_valid_for_days"/>
            </div>
            <div className="form-wrapper mt-15">
              <label htmlFor="">Flexible Work Hours</label>
              <input type="radio" value="Yes" name="is_flexible_work_hours" id=""/> Yes
              <input type="radio" value="0" name="is_flexible_work_hours" id=""/> No
              <br/>
              <label htmlFor="">Use Company Settings</label>
              <input type="radio" value="Yes" name="is_follow_company_settings" id=""/> Yes
              <input type="radio" value="0" name="is_follow_company_settings" id=""/> No
            </div>
            <div className="form-wrapper">
            <label htmlFor="">Must Absence at Designated Office</label>
              <br/>
              <input type="radio" value="Yes" name="must_same_office" id=""/> Yes
              <input type="radio" value="0" name="must_same_office" id=""/> No
              <br/>
              <label htmlFor="">Absence by Photo</label>
              <input type="radio" value="Yes" name="must_photo" id=""/> Yes
              <input type="radio" value="0" name="must_photo" id=""/> No
            </div>
            <div className="form-wrapper">
            <label htmlFor="">Allow Use Other Device</label>
              <input type="radio" value="Yes" name="allow_nebeng" id=""/> Yes
              <input type="radio" value="0" name="allow_nebeng" id=""/> No
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