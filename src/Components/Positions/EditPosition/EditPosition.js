import React from 'react';
import FormInput from '../../Util/FormInput/FormInput'
import FormInputDropdown from '../../Util/FormInputDropdown/FormInputDropdown'
import ButtonPrimary from '../../Util/ButtonPrimary/ButtonPrimary';
import Modal from '../../Util/ModalAndLogin/Modal';
import Loading from '../../Util/ModalAndLogin/Loading';
import { convertToForm, getSession, API } from '../../Util/common';
import { Redirect } from 'react-router-dom';
import Cookie from 'js-cookie'
class EditPositionComponent extends React.Component{
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
    let positionData = convertToForm(this.refs.editPositionForm);
    if (positionData.get('superior_position_no').length==0) positionData.delete('superior_position_no')

    fetch(`${this.api}/api/position/${this.props.match.params.id}`, {
      method: 'PUT',
      body: positionData,
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => this.setState({isLoading: false, info: data.message}))
    .catch(err => this.setState({isLoading: false, info: err.toString()}))
  

  }

  componentDidMount = () => {
    this.setState({isLoading: true});
    fetch(`${this.api}/api/position/${this.props.match.params.id}`, {
      headers: {
        'authorization': Cookie.get('JWT_token'),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      /*
      position_no: "8"
company_no: "1"
position_id: "PO1"
position_name: "CEO"
superior_position_no: null
leave_quota: 120
leave_valid_after_days: 120
leave_valid_for_days: 120
is_flexible_work_hours: true
is_follow_company_settings: false
late_tolerance_mins: 120
must_photo: false
must_same_office: false
allow_nebeng: true
created_by: "ryanowen"
created_on: "2019-12-29T03:10:35.700Z"
updated_by: null
updated_on: null
 */
      if (data.data){
        data = data.data;
        this.setState({
          position_id: data.position_id,
          position_name: data.position_name,
          superior_position_no: data.superior_position_no,
          leave_quota: data.leave_quota,
          leave_valid_after_days: data.leave_valid_after_days,
          leave_valid_for_days: data.leave_valid_for_days,
          is_flexible_work_hours: data.is_flexible_work_hours ? "Yes" : "0",
          is_follow_company_settings: data.is_follow_company_settings ? "Yes" : "0",
          must_photo: data.must_photo ? "Yes" : "0",
          must_same_office: data.must_same_office? "Yes" : "0",
          allow_nebeng: data.allow_nebeng ? "Yes" : "0"   ,
          late_tolerance_mins: data.late_tolerance_mins,
          isLoading: false,   
        })
      }
      else{
        this.setState({info: data.message, isLoading: false});
      }
    })
    .catch(err => this.setState({info: err.toString(), isLoading: false}))
    
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
          <form ref="editPositionForm"  className="container-row">
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
              <input type="radio" value="0" name="is_flexible_work_hours"   checked={this.state.is_flexible_work_hours==="0"}/> No
              <br/>
              <label htmlFor="">Use Company Settings</label>
              <input type="radio" value="Yes" name="is_follow_company_settings"   checked={this.state.is_is_follow_company_settings==="Yes"}/> Yes
              <input type="radio" value="0" name="is_follow_company_settings"   checked={this.state.is_follow_company_settings==="0"}/> No
            </div>
            <div className="form-wrapper">
            <label htmlFor="">Must Absence at Designated Office</label>
              <input type="radio" value="Yes" name="must_same_office" checked={this.state.is_must_same_office==="Yes"}/> Yes
              <input type="radio" value="0" name="must_same_office" checked={this.state.must_same_office==="0"}/> No
              <br/>
              <label htmlFor="">Absence by Photo</label>
              <input type="radio" value="Yes" name="must_photo"  checked={this.state.must_photo==="Yes"}/> Yes
              <input type="radio" value="0" name="must_photo" checked={this.state.must_photo==="0"}/> No
            </div>
            <div className="form-wrapper">
            <label htmlFor="">Allow Use Other Device</label>
              <input type="radio" value="Yes" name="allow_nebeng" checked={this.state.allow_nebeng==="Yes"} /> Yes
              <input type="radio" value="0" name="allow_nebeng"  checked={this.state.allow_nebeng==="0"}/> No
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