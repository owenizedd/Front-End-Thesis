import React from 'react';
import './ButtonPrimary.css';

const ButtonPrimary = ({text, onClick, style} ) => (<div className="form-control" ><button type="button" className="button-primary" onClick={onClick} style={style && style}>{text}</button></div>)

export default ButtonPrimary;