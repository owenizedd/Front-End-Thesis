import React from 'react';
import './ButtonPrimary.css';

const ButtonPrimary = ({text, onClick, style, className, icon} ) => (<div className="form-control" ><button type="button" className={`button-primary ${className}`} onClick={onClick} style={style && style}>{text} {icon && <i className={`fa fa-${icon}`}></i>}</button></div>)

export default ButtonPrimary;