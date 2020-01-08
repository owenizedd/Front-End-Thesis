import React from 'react';
import './AbsenceTable.css';
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
export default class AbsenceTable extends React.Component{
  state = {
    isLoading: false
  }

  handleClick = (lat, lng) => {
    this.props.showMap(lat,lng)
  }
  
  render(){    
   

    return(
      <>
        {this.props.tableRows.length ? 
          <Rows rows={this.props.tableRows} amountOfRows={this.props.amountOfRows} onClick={this.handleClick}/> : <h3 className="ta-ctr">There is no any absence log to show.</h3>
        }
      </>
    );
  }
}

const Rows = ({rows, amountOfRows, onClick}) => {
  if (parseInt(amountOfRows) < 0 || !amountOfRows ) amountOfRows = Number.MAX_VALUE;

  const dataRows = rows.map((row, idx) => {
    if (idx < amountOfRows && row){
      return <Row row={row} key={row.attendance_no} onClick={onClick}/>
    }
    else return null;
  }) 
  return(
    <>
      <h1 className="header ta-ctr">Latest Absence Log</h1>
      <div className="container-row">
            <div className="table-head">Absence Photo</div>
            <div className="table-head">Date Time</div>
            <div className="table-head">Employee's ID</div>
            <div className="table-head">Employee's Name</div>
            <div className="table-head">Device Name</div>
            <div className="table-head">Office Name</div>
            <div className="table-head">Log Type</div>
            <div className="table-head">Remarks</div>
            <div className="table-head"></div>
      </div>
      {dataRows}
    </>
  )
}

const Row = ({row, onClick}) => {
  const color = row.device_employee_no === row.employee_no ? "row-green" : "row-orange" ;
  return(
    <div className={`container-row absence-row ${color}`}>
      <img src={row.image_url} alt="row.name" width="80px" height="80px"/>
      <div className="table-data">{row.log_date_time} {row.timezone}</div>
      <div className="table-data">{row.employee_no}</div>
      <div className="table-data">{row.employee_name}</div>
      <div className="table-data">{row.device_employee_name}</div>
      <div className="table-data">{row.office_name}</div>
      <div className="table-data">{row.log_type}</div>
      <div className="table-data">{row.remarks}</div>
      <ButtonPrimary onClick={() => onClick(row.latitude, row.longitude)} style={{width: "200px"}} text="VIEW LOCATION"/>
    </div>
  );
}

/*attendance_no: 0,
        image_url: 'assets/images/logo_svg.svg',
        log_date_time: '20/09/2019 17:21',
        empoloyee_no: '12321',
        employee_name: 'Ryan Owen Thionanda',
        device_employee_name: 'Zen Dharma',
        device_employee_no: '12320',
        office_name: 'North Terrace Office',
        log_type: 'Finish Work',
        remarks: "Please accept my apology for my late arrival",
        latitude: 3.597031,
        longitude: 98.678513,
        timezone: '(UTC+7)',
*/