import React from 'react';
import './FormInput.css';
export default class FormInput extends React.Component{
  
  
  state = {
    counter: 0,
    iconName: "fa-eye",
    type: ""
  }



  handleClick = () => {
    if (this.props.icon) return;
    const newIconName = this.state.iconName === "fa-eye" ? "fa-eye-slash" : "fa-eye";
    const newType = this.state.type === "password" ? "text" : "password";
    this.setState({
      iconName : newIconName,
      type: newType
    });
  }

  componentDidMount = () => {
    this.setState({
      type: this.props.type,
      iconName: this.props.icon || this.state.iconName
    })
    
  }
  
  render(){ 
  
  let {value, type, onChange, name, placeholder, hidden, disabled, required, autoFocus, icon} = this.props;
  if (!onChange) onChange = () => {}
  if (hidden || icon) var style={display: 'flex', position: 'relative'}
  
  let form = <input autoFocus={autoFocus} required={required ? true: false} disabled={disabled} className={`form-input ${type}`} name={name} type={this.state.type} value={value} placeholder={placeholder} onChange={(evt) => onChange(evt)} />;
  if (type === "file"){
    form = <input autoFocus={autoFocus} required={required ? true: false} disabled={disabled} className={`form-input ${type}`} name={name} type={this.state.type} value={value} placeholder={placeholder} onChange={(evt) => onChange(evt)} accept="image/jpeg" />;
  }
  if (type === "textarea"){
    form = <textarea autoFocus={autoFocus} required={required? true: false} disabled={disabled} className={`form-input ${type}`} name={name} type={type} value={value} placeholder={placeholder} rows="2" onChange={(evt) => onChange(evt)}>{value}</textarea>
  }

  return (
    <div className={`form-control ${type}`} style={style}>
      {form}
      { (hidden || icon) && <i className={`fa ${this.state.iconName} eye-icon ${icon && "icon"}`} onClick={this.handleClick}></i>}
    </div>
  )
  }
}