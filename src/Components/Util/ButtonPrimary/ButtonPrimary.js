import React from 'react';
import './ButtonPrimary.css';

export default ({text, onClick} ) => (<div className="form-control"><button type="button" className="button-primary" onClick={onClick}>{text}</button></div>)