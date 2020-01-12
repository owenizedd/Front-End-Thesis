import React from 'react'
import ReportTable from '../Util/ReportTable/ReportTable'
import Modal from '../Util/ModalAndLogin/Modal'
import Loading from '../Util/ModalAndLogin/Loading'
import FormInputDate from '../Util/FormInputDate/FormInputDate'
import FormInputDropdown from '../Util/FormInputDropdown/FormInputDropdown'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import Cookie from 'js-cookie'
import { API } from '../Util/common'
export default class Report extends React.Component{
  api = API
  state ={
    showDateRange: false,
    isLoading: false,
    showEmployeeSelect: false,
    rows: [],
    listEmployee: []
  }

  toggleDateRangeModal = () => this.setState({showDateRange: !this.state.showDateRange})
  toggleEmployeeModal = () => this.setState({showEmployeeSelect: !this.state.showEmployeeSelect})
  
  handleChange = (evt) =>{
    
    const {name, value} = evt.target;

    this.setState({
      [name]: value
    })
  }
  

  filterReportByDate = () => {
    this.toggleDateRangeModal();

    if (this.state.start_range > this.state.end_range){
      this.setState({info: "The start range shouldn't precede the end range."})
    }
    else{
      this.fetchNewRows();
      //fetch
    }
  }
  resetFilterByDate = async() => {
    await this.setState({start_range: null, end_range: null, rows: []})
    this.toggleDateRangeModal()
    this.fetchNewRows();
  }

  filterReportByEmployee = () => {
    this.toggleEmployeeModal();
    this.fetchNewRows();
  }

  resetFilterByEmployee = async() => {
    await this.setState({selected_employee: null, rows: []})
    this.toggleEmployeeModal()
    this.fetchNewRows();
  }

  fetchNewRows = async() => {
    this.setState({isLoading: true});

    //make sure it is not undefined before accessing further property such as function or key
    // by using && operator
    let params = {
      from_date: this.state.start_range && this.state.start_range.toJSON(),
      until_date: this.state.end_range && this.state.end_range.toJSON(),
      employee_no: this.state.selected_employee && this.state.selected_employee.value,
      
    }

    //delete if undefined
    for(let key in params){
      if (!params[key]) delete params[key];
    }
    
    //make sure all filter selected
    console.info(Object.entries(params));

    if (Object.entries(params).length < 3){
      this.setState({showFilterInfo: true, isLoading: false});
      return;
    }
    else this.setState({showFilterInfo: false});
    
    //show employee detail if filter will be fetched

    this.setState({showEmployeeDetail: true })



    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    queryString.length > 0 && (queryString = '?' + queryString);

    await fetch(`${this.api}/api/absence/report${queryString}`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        // this.setState({info: data.message})
        
        this.setState({rows: data.data})
      }
      else this.setState({info: data.message})
    })
    .catch(err => this.setState({info: err.toString()}))
    this.setState({isLoading: false});
  }


  async componentDidMount(){
    this.setState({isLoading:true })
    await fetch(`${this.api}/api/employee`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        let employees = [];
        data.data.forEach(emp => {
          employees.push({
            value: emp.employee_no,
            label: emp.employee_name
          })
        })
        this.setState({listEmployee: employees, employeeData: data.data})
      }
      else this.setState({info: this.state.info + ' ' + data.message })
    })
    .catch(err => this.setState({ info: err.toString()}));

    this.fetchNewRows()

  }
  render(){
    if (this.state.rows.length){
      //accumulate late_mins
      savedPermission={}
      let lateDays = this.state.rows.filter(row => row.late_mins).length
      let permissionDays = this.state.rows.reduce((previousValue, currentValue) => previousValue + (currentValue.permissions !== null ? 1 : 0 ), 0);
      //jika  start_time dan finish_time null dan tidak didalam jangkauan permission days yang terdafatar maka absent.
      let absentDays = this.state.rows.reduce( (previousValue, currentValue) => previousValue + (!currentValue.start_working && !currentValue.finish_working && currentValue.permissions===null ? 1 : 0), 0 )
      var employeeDetail = this.state.employeeData.map( emp => {
        console.info(emp)
        if (!this.state.selected_employee) return;
        if (emp.employee_no === this.state.selected_employee.value ){
          return(
            <div>
              <h2 className="ml-15">Summaries</h2>
              <div className="mb-15" style={{background: '#5F4B8B', borderRadius: '15px', padding: '50px', display: 'inline-block'}}>
                
                <h3>Employee's Name: {emp.employee_name}</h3>
                <h3>{ (this.state.start_range && this.state.start_range.toLocaleDateString('en-GB')) + " - " + (this.state.end_range && this.state.end_range.toLocaleDateString('en-GB')) }</h3>
                <h3>Accumulation of late(days): {lateDays}</h3>
                <h3>Accumulation of permission (days): {Math.round(permissionDays)}</h3>
                <h3>Accumulation of absent (days): {absentDays}</h3>
                
              </div>
            </div>
          )
        }
      })
    }
    return(
      <>
        {this.state.isLoading && <Loading/>}
        {this.state.info && 
          
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              <ButtonPrimary onClick={(e) => this.setState({info: ''})} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        {this.state.showDateRange && <DateRangeModal onClearFilter={this.resetFilterByDate} onChange={this.handleChange} onClick={this.filterReportByDate} /> }
        {this.state.showEmployeeSelect && <EmployeeModal listEmployee={this.state.listEmployee} onClearFilter={this.resetFilterByEmployee} onChange={this.handleChange} onClick={this.filterReportByEmployee} />}
        <h1 className="ta-ctr">Report</h1>
        <div className="container-row spc-ev">
          <ButtonPrimary text="SELECT AN EMPLOYEE" onClick={this.toggleEmployeeModal}/>
          <ButtonPrimary text="SET DATE RANGE" onClick={this.toggleDateRangeModal}/>
        </div>
        {this.state.showFilterInfo && <h3 className="ta-ctr">Please fill all filters</h3>}
        {this.state.showEmployeeDetail && employeeDetail}
        <ReportTable rows={this.state.rows}/>
      
      </>
    )
  }
}


const DateRangeModal = ({onChange, onClick, onClearFilter}) => (
  <Modal>
    <div className="container-col container-ctr">
      <h1>Choose Date Range to filter the report</h1>
      <h4>Note: The timezone is your timezone.</h4>
      <FormInputDate onChange={onChange} icon="fa-calendar" name="start_range" className="date-modal"/> to
      <FormInputDate onChange={onChange} icon="fa-calendar" name="end_range"  className="date-modal"/>
      <ButtonPrimary text="FILTER" onClick={onClick} style={{marginTop: '15px'}}/>
      <ButtonPrimary text="CLEAR FILTER" onClick={onClearFilter} style={{marginTop: '15px'}}/>
    </div>
  </Modal>
)


const EmployeeModal = ({listEmployee, onChange, onClick, onClearFilter}) => (
  <Modal>
    <div className="container-col container-ctr">
      <h1>Choose Employee to filter the report</h1>
      <FormInputDropdown options={listEmployee} onChange={onChange} name="selected_employee"/>
      <ButtonPrimary text="FILTER" onClick={onClick} style={{marginTop: '15px'}}/>
      <ButtonPrimary text="CLEAR FILTER" onClick={onClearFilter} style={{marginTop: '15px'}}/>
    </div>
  </Modal>
)


let savedPermission={};
const getDays = (dateString1, dateString2) =>{
  //push, but reset all time from permission to 00.00 on that day to allow avoid bugs on time when checking
  if (savedPermission[dateString1] && savedPermission[dateString2]) return 0;

  savedPermission[dateString1]=true;
  savedPermission[dateString2]=true;

  let d1 = new Date(dateString1);
  let d2 = new Date(dateString2);
  return (d2-d1) / 1000 / 60 / 60 / 24
}

const isInsidePermission = (dateString, allRows) => {

  let d = new Date(dateString);
  allRows.forEach( row => {
    if (row.permissions !== null){
      let start = new Date(row.permissions.from_date_time).toLocaleDateString('en-US');
      let end = new Date(row.permissions.until_date_time).toLocaleDateString('en-US');
      let startD = new Date(start)
      let endD = new Date(end)
      if (d >= startD && d <= endD) return true
    }
  })
  return false;

}