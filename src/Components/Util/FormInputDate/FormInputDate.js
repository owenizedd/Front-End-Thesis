import React, { useState } from 'react';
import './FormInputDate.css';
import ReactDatePicker from 'react-datepicker';
export default class FormInputDate extends React.Component{
  state={
    value: new Date(),
    onChange: null,
    sent: false,
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
    if (!this.state.sent) //check if it hasn't been sent yet.
      if (this.state.onChange !== null){
        this.state.onChange(this.state.event);
        this.setState({sent: true}); //toggle to sent, true so it wont recursively call itself
      }
  }
  render(){ 
    const { onChange, name, icon} = this.props;
    
    var style={display: 'flex', position: 'relative'}
    
    return (
      <div className={`form-control date`} style={style}>
        <ReactDatePicker dateFormat="d MMMM yyyy" selected={new Date(this.state.value)} className="form-input" name={name} onChange={date => {
          
          this.handleChange(date, onChange);
        }}/>
        
        { icon && <i className={`fa ${icon} eye-icon ${icon && "icon-date"}`} ></i>}
      </div>
    )
  }
}

