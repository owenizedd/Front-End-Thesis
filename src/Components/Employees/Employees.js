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
  }
  onSearch = (value) =>{
    this.setState({
      searchValue: value
    })
  }
  componentDidMount = () =>{
    
    fetch(`${this.api}/api/employee`, {
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
  }

  render(){
    const employees = this.state.employees.map(employee => {
      if ([employee.employee_name, employee.employee_id].join(' ').toLowerCase().indexOf(this.state.searchValue.toLowerCase()) === -1) return; 
      return (
        
        <Card width="275px" height="275px" className="container-col container-ctr">

          <img src={employee.image_url} alt="No Photo" width="100px" height="100px"/> 
          <Link title="Edit this employee" to={`employees/edit/${employee.employee_no}`}><p>ID: {employee.employee_id}</p></Link>
          <p>{employee.employee_name}</p>
          <hr style={{width: '100%'}}/>
          <p>{employee.position_name}</p>
        </Card>
      )
    }) 
    return(
      <>
        {this.state.info && 
          
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
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