import React from 'react';
import './Modal.css'
export default ({children, onClick, blurry}) => (<div className={`modal ${blurry ? "blurry" : ""}`} onClick={onClick}>{children}</div>)