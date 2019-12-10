import React from 'react';
import './FormInput.css';
export default class FormInput extends React.Component{
  
  
  state = {
    counter: 0,
    iconName: "fa-eye",
    type: ""
  }



  handleClick = () => {
    const newIconName = this.state.iconName === "fa-eye" ? "fa-eye-slash" : "fa-eye";
    const newType = this.state.type === "password" ? "text" : "password";
    this.setState({
      iconName : newIconName,
      type: newType
    });
  }

  componentDidMount = () => {
    this.setState({
      type: this.props.type
    })
    
  }
  
  render(){ 
  
  const {value, type, onChange, name, placeholder, hidden} = this.props;
  
  if (hidden){
    var style={display: 'flex', position: 'relative'}
  }
  return (
    <div className={`form-control ${type}`} style={style}>
      <input className={`form-input ${type}`} name={name} type={this.state.type} value={value} placeholder={placeholder} onChange={(evt) => onChange(evt)} />
      {hidden && <i className={`fa ${this.state.iconName} eye-icon`} onClick={this.handleClick}></i>}
    </div>
  )
  }
}