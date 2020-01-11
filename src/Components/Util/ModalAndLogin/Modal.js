import React from 'react';
import './Modal.css'
import { getSession } from '../common';
export default ({children, onClick, blurry}) => (<div className={`modal ${blurry ? "blurry" : ""} ${getSession()? '' : ' full-width'}`} onClick={onClick}>{children}</div>)