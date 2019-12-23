import React from 'react';
import './AbsenceTable.css';
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary';
export default class AbsenceTable extends React.Component{
  state = {
    isLoading: false
  }

  handleClick = () =>{

  }
  
  render(){    
    const rows = [
      {
        id: 0,
        image: 'assets/images/logo_svg.svg',
        dateTime: '20/09/2019 17:21 (UTC+7)',
        employeeId: '12321',
        employeeName: 'Ryan Owen Thionanda',
        deviceName: 'Ryan Owen Thionanda',
        officeName: 'North Terrace Office',
        absenceBy: 'Device',
        logType: 'Finish Work',
        remarks: "Please accept my apology for my late arrival",
        latitude: '40.712776',
        longitude: '-74.005974',
        differ: false,
        createdByCompany: false
      },
      {
        id: 1,
        image: 'assets/images/logo_svg.svg',
        dateTime: '20/09/2019 17:21 (UTC+7)',
        employeeId: '12321',
        employeeName: 'Ryan Owen Thionanda',
        deviceName: 'Ryan Owen Thionanda',
        officeName: 'North Terrace Office',
        absenceBy: 'Device',
        logType: 'Finish Work',
        remarks: "Please accept my apology for my late arrival",
        latitude: '40.712776',
        longitude: '-74.005974',
        differ: true,
        createdByCompany: false,
      },
      {
        id: 2,
        image: 'assets/images/logo_svg.svg',
        dateTime: '20/09/2019 17:21 (UTC+7)',
        employeeId: '12321',
        employeeName: 'Ryan Owen Thionanda',
        deviceName: 'Ryan Owen Thionanda',
        officeName: 'North Terrace Office',
        absenceBy: 'Device',
        logType: 'Finish Work',
        remarks: "Please accept my apology for my late arrival",
        latitude: '40.712776',
        longitude: '-74.005974',
        differ: true,
        createdByCompany: true
      },
      {
        id: 4,
        image: 'assets/images/logo_svg.svg',
        dateTime: '20/09/2019 17:21 (UTC+7)',
        employeeId: '12321',
        employeeName: 'Ryan Owen',
        deviceName: 'Owen Thionanda',
        officeName: 'Terrace Office',
        absenceBy: 'Device',
        logType: 'Finish Work',
        remarks: "Apologize for my late arrival",
        latitude: '40.712776',
        longitude: '-74.005974',
        differ: false,
        createdByCompany: false
      },
      {
        id: 5,
        image: 'assets/images/logo_svg.svg',
        dateTime: '20/09/2019 17:21 (UTC+7)',
        employeeId: '12321',
        employeeName: 'Thionanda',
        deviceName: 'Ryan',
        officeName: 'Office',
        absenceBy: '-',
        logType: '-',
        remarks: "Thanks",
        latitude: '40.712776',
        longitude: '-74.005974',
        differ: false,
        createdByCompany: false
      }
    ]

    return(
      <>
        {!this.props.tableRows.length ? 
          <Rows rows={rows} amountOfRows={this.props.amountOfRows} /> : <h3 className="ta-ctr">There is no any absence log to show.</h3>
        }
      </>
    );
  }
}

const Rows = ({rows, amountOfRows}) => {
  const dataRows = rows.map((row, idx) => {
    if (idx < amountOfRows){
      return <Row row={row} key={row.id}/>
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

const Row = ({row, handleClick}) => {
  const color = row.createdByCompany ? "row-green" : row.differ ? "row-orange" : "row-normal";
  return(
    <div className={`container-row absence-row ${color}`}>
      <img src={row.image} alt="row.name" width="80px" height="80px"/>
      <div className="table-data">{row.dateTime}</div>
      <div className="table-data">{row.employeeId}</div>
      <div className="table-data">{row.employeeName}</div>
      <div className="table-data">{row.deviceName}</div>
      <div className="table-data">{row.officeName}</div>
      <div className="table-data">{row.logType}</div>
      <div className="table-data">{row.remarks}</div>
      <ButtonPrimary style={{width: "200px"}} text="VIEW LOCATION"/>
    </div>
  );
}