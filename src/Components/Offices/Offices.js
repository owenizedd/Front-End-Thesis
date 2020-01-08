import React from 'react'
import Searchbar from '../Util/Searchbar/Searchbar'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import {Link} from 'react-router-dom';
import './Offices.css'
import Cookie from 'js-cookie'
import Modal from '../Util/ModalAndLogin/Modal';
import Loading from '../Util/ModalAndLogin/Loading';
import Card from '../Util/Card/Card';
import { API } from '../Util/common';
export default class Offices extends React.Component{
  api = API
  state = {
    info: '',
    isLoading: false,
    searchValue: '',
  }
  onSearch = (value) =>{
    this.setState({
      searchValue: value.toLowerCase()
    })
  }
  componentDidMount = () =>{
    
    this.setState({isLoading: true})
    fetch(`${this.api}/api/office`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        this.setState({offices: data.data, isLoading: false})
      }
    })
    .catch(err => this.setState({ isLoading: false, info: err.toString()}));
  }

  render(){
    if (this.state.offices){
      var officesArr = this.state.offices.filter(office => office.office_id.toLowerCase().indexOf(this.state.searchValue) !== -1 || office.office_name.toLowerCase().indexOf(this.state.searchValue) !== -1 || office.address.toLowerCase().indexOf(this.state.searchValue) !== -1)
      .map(office => {
        return (
          <Card width="250px" height="200px" className="m-5">
            <Link to={`/offices/edit/${office.office_no}`}>
              <h2 className="card-link">{office.office_id}</h2>
            </Link>
            <h3>{office.office_name}</h3>
            <hr />
            <p>{office.address}</p>
          </Card>
        )
      })
    }
    return(
      <>
        {this.state.info && 
          
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              <ButtonPrimary onClick={(e) => {this.setState({info: ''}); e.stopPropagation(); }} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        {this.state.isLoading && <Loading/>}
        <div className="container-row container-header">
          <h1 className="mr-15 ml-15">Offices</h1>
          <Searchbar  onSearch={this.onSearch} placeholder="Search offices name, ID or address"/>
          <Link to="/offices/add">
            <ButtonPrimary text="ADD" style={{width: '70%'}} onClick={() => {}} />
          </Link>
        </div>
        <div className="container-row spc-ev">
          {officesArr}
        </div>
      </>
    )
  }
}