import React from 'react'
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary'
import './PositionsTable.css'
export default class PositionsTable extends React.Component{
  state = {

  }
  handleClick = () => {

  }
  render(){
    
    return(
      <>
        {true ? 
          <Rows onClick={this.handleClick}  amountOfRows={this.props.amountOfRows} /> : <h3 className="ta-ctr">There is no any absence log to show.</h3>
        }
      </>
    )
  }
}

const Rows = ({rows, amountOfRows, onClick}) => {
  if (parseInt(amountOfRows) < 0 || !amountOfRows ) amountOfRows = Number.MAX_VALUE;
  // const dataRows = rows.map((row, idx) => {
  //   if (idx < amountOfRows){
  //     return <Row row={row} onClick={onClick} key={row.id}/>
  //   }
  //   else return null;
  // }) 
  let dataRows = [];
  for(let i = 0 ; i< 20 ; i++ ){

    let myobj={
      id: 12321,
      name: 'UI/UX Designer',
      superior: 7854,
      maximumDaysLeave: 30,
      maximumLeaveValidAfter: 15,
      lateTorelance: 15,
      maximumLeaveValidFor: 12
    }
    dataRows.push(<Row row={myobj} onClick={onClick} key={myobj.id}/>)
  }
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

const Row = ({row, onClick}) => {
  const color = row.createdByCompany ? "row-green" : row.differ ? "row-orange" : "row-normal";
  return(
    <div className={`container-row positions-row ${color}`}>
      <div className="table-data">{row.id}</div>
      <div className="table-data">{row.name}</div>
      <div className="table-data">{row.superior}</div>
      <div className="table-data">{row.maximumDaysLeave}</div>
      <div className="table-data">{row.maximumLeaveValidAfter}</div>
      <div className="table-data">{row.lateTorelance}</div>
      <div className="table-data">{row.maximumLeaveValidFor}</div>

      <ButtonPrimary onClick={onClick} style={{width: "150px"}} text="EDIT"/>
      <ButtonPrimary onClick={onClick} style={{width: "125px"}} className="button-danger" text="DELETE"/>
    </div>
  );
}