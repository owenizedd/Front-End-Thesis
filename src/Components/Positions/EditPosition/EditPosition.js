import React from 'react';
import FormInput from '../../Util/FormInput/FormInput'
import FormInputDropdown from '../../Util/FormInputDropdown/FormInputDropdown'
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary';
import Modal from '../../Util/ModalAndLogin/Modal';
import Loading from '../../Util/ModalAndLogin/Loading';
import { convertToForm, getSession } from '../../Util/common';
import { Redirect } from 'react-router-dom';

class EditPositionComponent extends React.Component{

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
    let positionData = convertToForm(this.refs.addPositionForm);
    positionData.forEach((val,key) => {
      console.log(`${key}: ${val}`);
    })
  }

  componentDidMount = () => {
    
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
        <h1 className="ta-ctr">Edit a Position</h1>
        <div className="wrapper-form uneven-form label-ls-0">
          <form ref="addPositionForm"  className="container-row">
            <div className="form-wrapper">
              <label htmlFor="position_name">Position ID</label>
              <FormInput value={this.state.position_id}  type="text" onChange={this.handleChange} required name="position_id"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="position_name">Position Name</label>
              <FormInput value={this.state.position_name} type="text" onChange={this.handleChange} required name="position_name"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="superior_position_no">Superior No.</label>
              <FormInputDropdown value={this.state.superior_position_no} name="superior_position_no" placeholder="-- Superior No. (Optional) --" onChange={this.handleChange}/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="leave_quota">Maximum Days Leave Anually</label>
              <FormInput type="text" value={this.state.leave_quota} onChange={this.handleChange} required name="leave_quota"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="leave_valid_after_days">Leave Valid After Days</label>
              <FormInput type="text" value={this.state.leave_valid_after_days} onChange={this.handleChange} required name="leave_valid_after_days"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="late_tolerance_mins">Late Tolerance (Minutes)</label>
              <FormInput type="text" value={this.state.late_tolerance_mins} onChange={this.handleChange} required name="late_tolerance_mins"/>
            </div>
            <div className="form-wrapper">
              <label htmlFor="leave_valid_for_days">Leave Valid For Days</label>
              <FormInput type="text" value={this.state.leave_valid_for_days}onChange={this.handleChange} required name="leave_valid_for_days"/>
            </div>
            <div className="form-wrapper mt-15">
              <label htmlFor="">Flexible Work Hours</label>
              <input type="radio" value="Yes" name="is_flexible_work_hours"   checked={this.state.is_flexible_work_hours==="Yes"}/> Yes
              <input type="radio" value="No" name="is_flexible_work_hours"   checked={this.state.is_flexible_work_hours==="No"}/> No
              <br/>
              <label htmlFor="">Use Company Settings</label>
              <input type="radio" value="Yes" name="is_follow_company_settings"   checked={this.state.is_is_follow_company_settings==="Yes"}/> Yes
              <input type="radio" value="No" name="is_follow_company_settings"   checked={this.state.is_follow_company_settings==="No"}/> No
            </div>
            <div className="form-wrapper">
            <label htmlFor="">Must Absence at Designated Office</label>
              <input type="radio" value="Yes" name="must_same_office" checked={this.state.is_must_same_office==="Yes"}/> Yes
              <input type="radio" value="No" name="must_same_office" checked={this.state.must_same_office==="No"}/> No
              <br/>
              <label htmlFor="">Absence by Photo</label>
              <input type="radio" value="Yes" name="must_photo"  checked={this.state.must_photo==="Yes"}/> Yes
              <input type="radio" value="No" name="must_photo" checked={this.state.must_photo==="No"}/> No
            </div>
            <div className="form-wrapper">
            <label htmlFor="">Allow Use Other Device</label>
              <input type="radio" value="Yes" name="allow_nebeng" checked={this.state.allow_nebeng==="Yes"} /> Yes
              <input type="radio" value="No" name="allow_nebeng"  checked={this.state.allow_nebeng==="No"}/> No
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

const EditPosition = ({match}) => (
  getSession() ? <EditPositionComponent match={match}/> : <Redirect to="/"/>
)

export default EditPosition