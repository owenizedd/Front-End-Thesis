import React from 'react'
import Searchbar from '../Util/Searchbar/Searchbar'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import {Link} from 'react-router-dom';
import Cookie from 'js-cookie';
import './Employees.css'
import Modal from '../Util/ModalAndLogin/Modal';
import Loading from '../Util/ModalAndLogin/Loading';
import Card from '../Util/Card/Card';
import { API } from '../Util/common';

export default class Employees extends React.Component{
  api = API;
  state = {
    employees: [],
    searchValue: '',
    img_urls: []
  }

  onSearch = (value) =>{
    this.setState({
      searchValue: value
    })
  }

  componentDidMount = async() =>{
    
    await fetch(`${this.api}/api/employee`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){


        this.setState({employees: data.data, isLoading: false});
      }
      else this.setState({info: data.message, isLoading: false})
    })
    .catch(err => this.setState({info: err.toString(), isLoading: false}));

    this.state.employees.forEach( async(emp,idx) => {
      let links = []
      if (emp.image_url){
        await fetch(emp.image_url, {
          headers: {
            'authorization': Cookie.get('JWT_token')
          }
        })
        .then(res => res.arrayBuffer())
        .then(buff =>{
           this.state.img_urls[idx] = 'data:image/jpeg;base64,' + btoa(String.fromCharCode(...new Uint8Array(buff)))
           this.setState({img_urls: this.state.img_urls})
        })
        .catch(err => this.setState({info: err.toString() + ' Error while fetching images'}));
      }
      else this.state.img_urls[idx]=null
    })

  }


  showImage = (img) =>{
    this.setState({info: 'Image Details', info_image: img})
  }
  
  render(){
    const employees = this.state.employees.map( (employee,idx) => {
     
      if ([employee.employee_name, employee.employee_id, employee.position_name].join(' ').toLowerCase().indexOf(this.state.searchValue.toLowerCase()) === -1) return; 
      let img_url = this.state.img_urls[idx] || 'data:image/jpeg;base64,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';
      return (
        
        <Card width="275px" height="275px" className={"container-col container-ctr " + (employee.is_resign? "resign" : "") }>

          {<img onClick={() => this.showImage(img_url)} style={{cursor: 'pointer'}} src={img_url} width="100px" height={ this.state.img_urls[idx] ? "100px" : "75px" }/>}
          <Link title="Edit this employee" to={`employees/edit/${employee.employee_no}`}><p>ID: {employee.employee_id}</p></Link>
          <p>{employee.employee_name}</p>
          <hr style={{width: '100%'}}/>
          <p style={{margin: 0, padding: 0}}>{employee.position_name}</p>
          {employee.is_resign &&  <p><strong>This employee has resigned</strong></p>}
        </Card>
      )
    }) 
    return(
      <>
        {this.state.info && 
          
          <Modal blurry onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              {this.state.info_image && <img src={this.state.info_image} className="mb-15"/>}
              <ButtonPrimary onClick={(e) => { this.state.info.toLowerCase().indexOf("error") !== -1 ? window.location.reload() : this.setState({info: ''}); e.stopPropagation(); }} text={ this.state.info.toLowerCase().indexOf("error") !== -1 ? "RELOAD PAGE" : "CLOSE"}/>
            </div>
          </Modal>
        }
        {this.state.isLoading && <Loading/>}
        <div className="container-row container-header">
          <h1 className="mr-15 ml-15">Employees</h1>
          <Searchbar onSearch={this.onSearch} placeholder="Search employee's name, ID or position"/>
          <Link to="/employees/add">
            <ButtonPrimary text="ADD" style={{width: '70%'}} onClick={() => {}} />
          </Link>
        </div>
        <div className="container-row spc-ev">
          {employees}
        </div>
      </>
    )
  }
}