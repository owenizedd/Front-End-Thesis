import React from 'react'
import Searchbar from '../Util/Searchbar/Searchbar'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import {Link} from 'react-router-dom';
import './Employees.css'

export default class Employees extends React.Component{
  
  state = {
  }
  onSearch = (value) =>{
    this.setState({
      searchValue: value
    })
  }
  componentDidUpdate = () =>{
    console.log(this.state);
  }

  render(){
    return(
      <>
        <div className="container-row container-header">
          <h1 className="mr-15 ml-15">Employees</h1>
          <Searchbar onSearch={this.onSearch} placeholder="Search employee's name, ID or position"/>
          <Link to="/employees/add">
            <ButtonPrimary text="ADD" style={{width: '70%'}} onClick={() => {}} />
          </Link>
        </div>
      </>
    )
  }
}