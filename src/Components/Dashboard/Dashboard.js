import React from 'react';

import './Dashboard.css';
import Card from '../Util/Card/Card';
import AbsenceTable from '../AbsenceTable/AbsenceTable';
import Cookie from 'js-cookie';
import Loading from '../Util/ModalAndLogin/Loading';
import Modal from '../Util/ModalAndLogin/Modal';


export default class Dashboard extends React.Component{

  state={
    amountOfCompany: null,
    amountOfEmployee: null,
    amountOfOffice: null,
    isLoading: false,
    tableRows: []
  }
  
  componentDidMount = async() => {
    //fetch
    let api = 'http://157.230.43.112:3000'

    this.setState({isLoading: true});
    await fetch(`${api}/api/office`,{
      headers: {
        "authorization": Cookie.get("JWT_token")
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        amountOfOffice: data.data.length
      })
    })

    await fetch(`${api}/api/employee`, {
      headers: {
        "authorization": Cookie.get("JWT_token")
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        amountOfEmployee: data.data.length,
        isLoading: false
      })
    })

    //fetch absence data and show 
  }

  render(){

    return(
      <>
        {this.state.isLoading && <Loading/>}
        <Summary 
          amountOfCompany={this.state.amountOfCompany} 
          amountOfEmployee={this.state.amountOfEmployee}
          amountOfOffice={this.state.amountOfOffice}
        />
        <AbsenceTable amountOfRows="5" tableRows={this.state.tableRows}/>
        
      </>
    )
  }
}

const Summary = ({amountOfCompany, amountOfEmployee, amountOfOffice}) => {
  
  return(
    <div className="summary container-column">
      <h1 className="header ta-ctr">Summary</h1>
      <div className="container-row spc-ev">
        <Card width="250px" height="200px" className="m-5">
          <h3 className="card-title">Company</h3>
          <p className="header">{amountOfCompany}</p>
        </Card>
        <Card width="250px" height="200px" className="m-5">
          <h3 className="card-title">Employee</h3>
          <p className="header">{amountOfEmployee}</p>
        </Card >
        <Card width="250px" height="200px" className="m-5">
          <h3 className="card-title">Office</h3>
          <p className="header">{amountOfOffice}</p>
        </Card>
      </div>
    </div>
  )
}


