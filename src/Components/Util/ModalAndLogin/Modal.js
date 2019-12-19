import React from 'react';
import './Modal.css'
export default ({children, onClick}) => (<div className="modal" onClick={() => onClick()}>{children}</div>)