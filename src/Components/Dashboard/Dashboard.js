import React from 'react';

import './Dashboard.css';
import Card from '../Util/Card/Card';
import AbsenceTable from '../Util/AbsenceTable/AbsenceTable';
import Cookie from 'js-cookie';
import Loading from '../Util/ModalAndLogin/Loading';


export default class Dashboard extends React.Component{

  state={
    amountOfEmployee: null,
    amountOfOffice: null,
    isLoading: false,
    company_name: null,
    address: '-',
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
        
      })
    })

    await fetch(`${api}/api/company`, {
      headers: {
        "authorization": Cookie.get("JWT_token")
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.data)
      if (data.data){
        let address = data.data.address == null ? 'JL. Medan Binjai Km 10,5' : data.data.address;
        if (address.length > 23) address = address.slice(0, 20) + '...';
        this.setState({
          company_name: data.data.company_name,
          address: address,
          isLoading: false,
        })
      }
      else{
        this.setState({
          address: "Error while fetching information",
          isLoading: false,
        })
      }
    })

    //fetch absence data and show 
  }

  render(){

    return(
      <>
        {this.state.isLoading && <Loading/>}
        <Summary 
          companyName={this.state.company_name}
          address={this.state.address} 
          amountOfEmployee={this.state.amountOfEmployee}
          amountOfOffice={this.state.amountOfOffice}
        />
        <AbsenceTable amountOfRows="5" tableRows={this.state.tableRows}/>
        
      </>
    )
  }
}

const Summary = ({companyName, address, amountOfEmployee, amountOfOffice}) => {
  
  return(
    <div className="summary container-column">
      <h1 className="header ta-ctr">Summary</h1>
      <div className="container-row spc-ev">
        <Card width="250px" height="200px" className="m-5">
          <h3 className="card-title">Company</h3>
          <h2 >{companyName}</h2>
          <p>{address}</p>
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


