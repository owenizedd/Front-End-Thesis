import React from 'react';

import './Dashboard.css';
import Card from '../Util/Card/Card';
import AbsenceTable from '../Util/AbsenceTable/AbsenceTable';
import Cookie from 'js-cookie';
import Loading from '../Util/ModalAndLogin/Loading';
import { API, savePrivilege } from '../Util/common';
import Modal from '../Util/ModalAndLogin/Modal';
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary';
import Map from '../Util/Map/Map';


export default class Dashboard extends React.Component{
  api = API;
  state={
    amountOfEmployee: null,
    amountOfOffice: null,
    isLoading: false,
    company_name: null,
    address: '-',
    tableRows: [],
    info: ''
  }
  
  showImage = (img) =>{
    this.setState({info: 'Image Details', info_image: img})
  }
  componentDidMount = async() => {
    //fetch
    let api = API
    this.setState({isLoading: true});

    await fetch(`${api}/api/dashboard`, {
      headers:{
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        const {allow_manage_absence, allow_manage_employee, allow_manage_office, allow_manage_position} = data.data.role_data;
        savePrivilege(data.data.is_company, allow_manage_absence, allow_manage_employee, allow_manage_office, allow_manage_position);

        let address = data.data.company_data.address == null ? '-' : data.data.company_data.address;
        if (address.length > 23) address = address.slice(0, 20) + '...';
        this.setState({
          amountOfOffice: data.data.office_count,
          amountOfEmployee: data.data.employee_count,
          address: address,
          company_name: data.data.company_data.company_name
        })
      }
    })


    //fetch absence data today and show 
    let params = {
      from_date: new Date().toISOString().slice(0,10),
      until_date: new Date().toISOString().slice(0,10)
    }

    
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    queryString.length > 0 && (queryString = '?' + queryString);
    await fetch(`${this.api}/api/absence${queryString}`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        // this.setState({info: data.message})
        this.setState({tableRows: data.data})
      }
      else this.setState({info: data.message})
    })
    .catch(err => this.setState({info: err.toString()}))
    this.setState({isLoading: false});
  }
  showMap = (lat, lng) => {
    this.setState({viewLatitude: lat, viewLongitude: lng})
    this.toggleShowMap()
  }
  toggleShowMap = () => {
    this.setState({viewLocation: !this.state.viewLocation})
  }
  render(){

 
    return(
      <>
        {this.state.isLoading && <Loading/>}
        {this.state.info && 
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >

              <h1>{this.state.info}</h1>
              <img src={this.state.info_image}/>
              <ButtonPrimary onClick={(e) => {this.setState({info: '', info_image: ''}); e.stopPropagation(); }} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        {this.state.viewLocation && <MapModal lat={this.state.viewLatitude} lng={this.state.viewLongitude} onClose={this.toggleShowMap} />}
        <Summary 
          companyName={this.state.company_name}
          address={this.state.address} 
          amountOfEmployee={this.state.amountOfEmployee}
          amountOfOffice={this.state.amountOfOffice}
        />
        <AbsenceTable showMap={this.showMap} onClickImage={this.showImage} amountOfRows="5" tableRows={this.state.tableRows}/>
        
      </>
    )
  }
}

const Summary = ({companyName, address, amountOfEmployee, amountOfOffice}) => {
  
  return(
    <div className="summary container-column">
      <h1 className="header ta-ctr">Summary</h1>
      <div className="container-row spc-ev">
        <Card width="250px" height="220px" className="m-5">
          <h3 className="card-title">Company</h3>
          <h2 >{companyName}</h2>
          <p>{address}</p>
        </Card>
        <Card width="250px" height="220px" className="m-5">
          <h3 className="card-title">Employee</h3>
          <p className="header">{amountOfEmployee}</p>
        </Card >
        <Card width="250px" height="220px" className="m-5">
          <h3 className="card-title">Office</h3>
          <p className="header">{amountOfOffice}</p>
        </Card>
      </div>
    </div>
  )
}


const MapModal = ({onClose, lat, lng}) => (
  <Modal>
    <div className="container-col container-ctr">
      
      <Map viewMode latitude={lat} longitude={lng} mapHeight='50vh' mapWidth='100%'/>
      <ButtonPrimary text="CLOSE" onClick={onClose}/>
    </div>
  </Modal>
)

