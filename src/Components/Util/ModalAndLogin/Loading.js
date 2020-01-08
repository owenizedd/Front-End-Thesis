import React from 'react'
import Modal from './Modal'
import './Loading.css'

export default () => (<Modal blurry onClick={() => {}}>
  <div className="container-col container-ctr">
    <h4><i>Just fetching some data, let's hope this won't take too long.</i></h4>
    <div className="sbl-puzzle mt-15">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
  </div>

</Modal>)
