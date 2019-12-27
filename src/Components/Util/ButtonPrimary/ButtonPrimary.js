import React from 'react';
import './ButtonPrimary.css';

const ButtonPrimary = ({text, onClick, style, className} ) => (<div className="form-control" ><button type="button" className={`button-primary ${className}`} onClick={onClick} style={style && style}>{text}</button></div>)

export default ButtonPrimary;