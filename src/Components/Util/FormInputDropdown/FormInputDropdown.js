import React, { useState } from 'react';
import Select from 'react-select';

import './FormInputDropdown.css';
import ReactDatePicker from 'react-datepicker';
export default class FormInputDropdown extends React.Component{
  state={
    selectedOption: null,
    sent: false,
  }
  handleChange = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption,
      event: { //fake event
        target:{
          name: [this.props.name],
          value: selectedOption
        }
      },
      sent: false, //reset so it will send
    })

 
  }
  
  componentDidUpdate(){

    //logic for prevent  sending data repeteadly to parent component
    if (!this.state.sent) //check if it hasn't been sent yet.
      if (this.props.onChange !== null && this.state.event){
        this.props.onChange(this.state.event);
        this.setState({sent: true}); //toggle to sent, true so it wont recursively call itself
      }
  }
  render(){ 
    const { placeholder,  name } = this.props;
    
    var style={display: 'flex', position: 'relative'}
    
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ];

    return (
      <div className={`form-control`} style={style}>
       <Select placeholder={placeholder} name={name} className="form-input-select-container" classNamePrefix="form-input-select" value={this.state.selectedOption} onChange={this.handleChange} options={options}/>
      </div>
    )
  }
}

