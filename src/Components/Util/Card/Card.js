import React from 'react';
import './Card.css';
export default ({children, width, height, className}) => {
  if (width && height){
    var style = {
      width: width,
      height: height
    }
  }
  return(
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}