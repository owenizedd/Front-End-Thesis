import React from 'react';
import './FormInputDate.css';
import ReactDatePicker from 'react-datepicker';
export default class FormInputDate extends React.Component{
  state={
    value:  new Date(),
    onChange: null,
    sent: false,
    propsReceived: false
  }
  handleChange= (date, onChange) => {
    this.setState({
      value: date,
      event: { //fake event
        target:{
          name: [this.props.name],
          value: date
        }
      },
      onChange: onChange,
      sent: false, //reset so it will send
    })
  }
  
  componentDidUpdate(){
    if (this.props.value && !this.state.propsReceived) {
      console.info(this.props)
      this.setState({propsReceived: true, value: new Date(this.props.value)})
      this.props.onChange({
        target:{
          name: [this.props.name],
          value: new Date(this.props.value) || new Date()
        }
      })
    }
    if (!this.state.sent) //check if it hasn't been sent yet.
      if (this.state.onChange !== null){
        this.state.onChange(this.state.event);
        this.setState({sent: true}); //toggle to sent, true so it wont recursively call itself
      }
  }

  componentDidMount(){
    if (!this.props.hasInitialValue) this.props.onChange({
        target:{
          name: [this.props.name],
          value:  new Date()
        }
    })
    if (this.props.hasInitialValue && this.props.value){
      this.setState({propsReceived: true, value: new Date(this.props.value)})
      this.props.onChange({
        target:{
          name: [this.props.name],
          value: new Date(this.props.value) || new Date()
        }
      })
    }
  }
  render(){ 
    const { onChange, name, icon, className, width} = this.props;
 
    var cstyle={display: 'flex', position: 'relative', padding: ''}
    if (width) cstyle.width=width;
    return (
      <div className={`form-control date`} style={cstyle} className={className}>
        <ReactDatePicker dateFormat="d-MM-yyyy" selected={new Date(this.state.value)} className="form-input" name={name} onChange={date => {
          
          this.handleChange(date, onChange);
        }}/>
        
        { icon && <i className={`fa ${icon} eye-icon ${icon && "icon-date"}`} ></i>}
      </div>
    )
  }
}

