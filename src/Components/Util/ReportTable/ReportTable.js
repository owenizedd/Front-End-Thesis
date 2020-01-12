import React from 'react'
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary'
import './ReportTable.css'
import { Link } from 'react-router-dom'
import Cookie from 'js-cookie'
import { API, getTimeStringToTimezone } from '../common'

export default class ReportTable extends React.Component{
  api = API
  state = {

  }
  handleClick = () => {
    
    this.props.onLoad()

  }
  handleDelete = (no) => { 
    this.props.onLoad()
    fetch(`${this.api}/api/position/${no}`, {
      method: 'DELETE',
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      this.props.onDelete(data.message, no);
      this.props.onLoad();
    })
    .catch(err => {
        this.props.onDelete(err.toString());
        this.props.onLoad()
      }
    );
  }
  render(){
    console.warn(this.props.rows)
    return(
      <>
        {this.props.rows && this.props.rows.length ? 
          <Rows rows={this.props.rows} onClick={this.handleClick}  onDelete={this.handleDelete} amountOfRows={this.props.amountOfRows} /> : <h3 className="ta-ctr">There is no any report to show.</h3>
        }
      </>
    )
  }
}

const Rows = ({rows, amountOfRows, onClick, onDelete}) => {
  if (!amountOfRows) amountOfRows = rows.length;
  if (amountOfRows > rows.length) amountOfRows = rows.length
  const dataRows = rows.map((row, idx) => {
    if (idx < amountOfRows && row){
      return <Row key={row.date} row={row} onClick={onClick} onDelete={onDelete}/>
    }
    else return null;
  }) 
  
  return(
    <>
      <div className="container-row report-head">
        <div className="table-head ml-15">Date Time</div>
        <div className="table-head">Start Work</div>
        <div className="table-head">Finish Work</div>
        <div className="table-head">Start Break</div>
        <div className="table-head">Finish Break</div>
        <div className="table-head">Late</div>
        <div className="table-head">Overtime</div>
        {/* <div className="table-head">Remarks</div> */}
      </div>
      {dataRows}
    </>
  )
}

const Row = ({row, onClick, onDelete}) => {
  // let day = new Date(row.date).toLocaleDateString('default', {weekday: 'long'});
  const color = row.permissions !== null ? "row-green" : row.late_mins > 0 ? "row-orange" : "row-normal";
  const weekend = new Date(row.date).getDay()===6 || new Date(row.date).getDay()===0
  return(
    <div className={`container-row report-row ${color}`}>
      <div className={"table-data" + (weekend? " red" : '')}>{new Date(row.date).toString().slice(0,15)}</div>
      {
        row.permissions === null ? 
          (
            row.start_working || row.finish_working || row.start_break || row.finish_break || row.late_mins || row.overtime ?
              <>
                <div className="table-data">{row.start_working ? getTimeStringToTimezone(row.start_working.local_time, row.start_working.timezone).slice(16,32) : '-'}</div>
                <div className="table-data">{row.finish_working ? getTimeStringToTimezone(row.finish_working.local_time, row.finish_working.timezone).slice(16,32) : '-'}</div>
                <div className="table-data">{row.start_break ? getTimeStringToTimezone(row.start_break.local_time, row.start_break.timezone).slice(16,32) : '-'}</div>
                <div className="table-data">{row.finish_break ? getTimeStringToTimezone(row.finish_break.local_time, row.finish_break.timezone).slice(16,32) : '-'}</div>
                <div className="table-data">{row.late_mins ? row.late_mins + ' minutes' : '-'}</div>
                <div className="table-data">{row.overtime_mins ? row.overtime_mins  + ' minutes' : '-'}</div>
                {/* <div className="table-data">{row.remarks ? row.remarks : '-' }</div> */}
              </>
              :
              <div className="container-col" style={{width: '100%'}}>
                <p>No Absence Data</p>
              </div>
          )
        :
        
          <div className="container-col" style={{width: '100%'}}>
            <h3 style={{margin: 0, marginBottom: '5px'}}>{row.permissions.permission_reason_name}</h3>
            <h4  style={{margin: 0}}>{row.permissions.description ? row.permissions.description : '-'}</h4>
          </div>
        
      }
    </div>
  )
}

// day: "1"
// date: "2020-01-27"
// start_time: "07:15:00"
// end_time: "18:15:00"
// start_working: null
// finish_working: null
// start_break: null
// finish_break: null
// late_mins: 0
// overtime_mins: 0