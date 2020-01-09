import React from 'react'
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary'
import './PositionsTable.css'
import { Link } from 'react-router-dom'
import Cookie from 'js-cookie'
import { API } from '../common'

export default class PositionsTable extends React.Component{
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
    
    return(
      <>
        {this.props.rows ? 
          <Rows rows={this.props.rows} onClick={this.handleClick}  onDelete={this.handleDelete} amountOfRows={this.props.amountOfRows} /> : <h3 className="ta-ctr">There is no any position to show.</h3>
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
      return <Row row={row} onClick={onClick} key={row.position_no} onDelete={onDelete}/>
    }
    else return null;
  }) 
  
  return(
    <>
      <div className="container-row positions-head">
            <div className="ml-5">
            <div className="table-head ml-15">Position's ID</div>
            </div>
            <div className="table-head">Position's Name</div>
            <div className="table-head">Superior No.</div>
            <div className="table-head">Maximum Days Leave Anually</div>
            <div className="table-head">Maximum Leave Valid after Days</div>
            <div className="table-head">Late Tolerance (Minutes)</div>
            <div className="table-head">Maximum Leave Valid For Days</div>
      </div>
      {dataRows}
    </>
  )
}

const Row = ({row, onClick, onDelete}) => {
  console.info(row);
  const color = row.createdByCompany ? "row-green" : row.differ ? "row-orange" : "row-normal";
  return(
    <div className={`container-row positions-row ${color}`}>
      <div className="table-data">{row.position_id}</div>
      <div className="table-data">{row.position_name}</div>
      <div className="table-data">{row.superior_position_no ? row.superior_position_no : '-'}</div>
      <div className="table-data">{row.leave_quota}</div>
      <div className="table-data">{row.leave_valid_after_days}</div>
      <div className="table-data">{row.late_tolerance_mins}</div>
      <div className="table-data">{row.leave_valid_for_days}</div>

      <Link  to={`/positions/edit/${row.position_no}`}>
       <ButtonPrimary onClick={onClick} style={{width: "150px"}} text="EDIT"/>
      </Link>
      <ButtonPrimary onClick={() => onDelete(row.position_no)} style={{width: "125px"}} className="button-danger" text="DELETE"/>
    </div>
  );
}