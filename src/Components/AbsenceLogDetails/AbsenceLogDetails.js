import React from 'react'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary';
import Modal from '../Util/ModalAndLogin/Modal';
import Loading from '../Util/ModalAndLogin/Loading';
import Searchbar from '../Util/Searchbar/Searchbar';
import AbsenceTable from '../Util/AbsenceTable/AbsenceTable';
import FormInputDate from '../Util/FormInputDate/FormInputDate';
import Map from '../Util/Map/Map';
import Cookie from 'js-cookie';
import FormInputDropdown from '../Util/FormInputDropdown/FormInputDropdown';
import {API} from '../Util/common'


export default class AbsenceLogDetails extends React.Component{
  api = API;
  
  state={
    showDateRange: false,
    showFilter: false,
    viewLocation: false,
    viewLatitude: 0,
    viewLongitude: 0,
    searchValue: '',

    tableRows: [
      //uncomment these lines to show dummy rows
      // { 
      //   // Dummy Rows
      //   attendance_no: 0, 
      //   image_url: 'assets/images/logo_svg.svg',
      //   log_date_time: '20/09/2019 17:21',
      //   employee_no: '12321',
      //   employee_name: 'Ryan Owen Thionanda',
      //   device_employee_name: 'Ryan Owen Thionanda',
      //   device_employee_no: '12321',
      //   office_name: 'North Terrace Office',
      //   log_type: 'Finish Work',
      //   remarks: "Please accept my apology for my late arrival",
      //   latitude: 3.597031,
      //   longitude: 98.678513,
      //   timezone: '(UTC+7)',
        
      // },
      // {
      //   attendance_no: 1,
      //   image_url: 'assets/images/logo_svg.svg',
      //   log_date_time: '20/09/2019 17:21',
      //   employee_no: '12323',
      //   employee_name: 'Riady Yoslim',
      //   device_employee_name: 'Zen Dharma',
      //   device_employee_no: '12320',
      //   office_name: 'North Terrace Office',
      //   log_type: 'Finish Work',
      //   remarks: "Please accept my apology for my late arrival",
      //   latitude: 3.597031,
      //   longitude: 98.678513,
      //   timezone: '(UTC+7)',
        
      // },
    
    ]
  }
  onSearch = (searchValue) => {
    this.setState({searchValue: searchValue})
  }

  onChange = (evt) =>{
    const {name, value} = evt.target;

    this.setState({
      [name]: value
    })
  }
  
  toggleDateRangeModal = () => this.setState({showDateRange: !this.state.showDateRange})
  toggleFilterModal = () => this.setState({showFilter: !this.state.showFilter})

  filterAbsencesByDate = () => {
    this.toggleDateRangeModal();
    this.toggleLoading();
    if (this.state.start_range > this.state.end_range){
      this.setState({info: "The start range shouldn't precede the end range."})
    }
    else{
      this.fetchNewRows();
    }
  }
  resetFilterByDate = () => {
    this.setState({start_range: null, end_range: null, tableRows: []})
    // this.fetchNewRows();
    this.toggleDateRangeModal()
  }

  miscFilterAbsences = () => {
    this.setState({ filterEmployeeValue: null, filterOfficeValue: null, filterPositionValue: null})
    this.toggleFilterModal()

    this.fetchNewRows()
  }
  resetMiscFilter = () => {
    this.toggleFilterModal()
    this.setState({ filterEmployeeValue: null, filterOfficeValue: null, filterPositionValue: null})
    this.fetchNewRows()
  }


  showMap = (lat, lng) => {
    this.setState({viewLatitude: lat, viewLongitude: lng})
    this.toggleShowMap()
  }
  toggleShowMap = () => {
    this.setState({viewLocation: !this.state.viewLocation})
  }

  toggleLoading = () => this.setState({isLoading: !this.state.isLoading})  
  componentDidMount= async() => {
    //fetch pos, fetch office for filter
    this.toggleLoading()
    await fetch(`${this.api}/api/position`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        let positions = []
        data.data.forEach(pos => {
          positions.push({
            value: pos.position_no,
            label: pos.position_name
          })
        })
        this.setState({listPositions: positions})
      }
      else this.setState({info: data.message})
    })
    .catch( err => this.setState({ info: err.toString()}))

    await fetch(`${this.api}/api/office`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        let offices = [];
        data.data.forEach(ofc => {
          offices.push({
            value: ofc.office_no,
            label: ofc.office_name
          })
        })
        this.setState({listOffices: offices})
      }
      else this.setState({info: this.state.info + ' ' + data.message })
    })
    .catch(err => this.setState({ info: err.toString()}));


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
        this.setState({listEmployee: employees})
      }
      else this.setState({info: this.state.info + ' ' + data.message })
    })
    .catch(err => this.setState({ info: err.toString()}));

    this.setState({isLoading: false})

    //fetch tableRows data absences
    // this.fetchNewRows();
  }


  
  fetchNewRows = async() => {
    this.setState({isLoading: true});

    //make sure it is not undefined before accessing further property such as function or key
    // by using && operator
    let params = {
      from_date: this.state.start_range && this.state.start_range.toISOString().slice(0,10),
      until_date: this.state.end_range && this.state.end_range.toISOString().slice(0,10),
      employee_no: this.state.filterEmployeeValue && this.state.filterEmployeeValue.value,
      office_no: this.state.filterOfficeValue && this.state.filterOfficeValue.value,
      position_no: this.state.filterPositionValue && this.state.filterPositionValue.value,

    }
    for(let key in params){
      if (!params[key]) delete params[key];
    }
    
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    queryString.length > 0 && (queryString = '?' + queryString);
    console.warn(queryString)
    await fetch(`${this.api}/api/absence${queryString}`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.data){
        // this.setState({info: data.message}))
        this.setState({tableRows: data.data})
      }
      else this.setState({info: data.message})
    })
    .catch(err => this.setState({info: err.toString()}))
    this.setState({isLoading: false});
  }

  showImage = (img) =>{
    this.setState({info: 'Image Details', info_image: img})
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
        {this.state.showDateRange && <DateRangeModal onClearFilter={this.resetFilterByDate} onChange={this.onChange} onClick={this.filterAbsencesByDate} /> }
        {this.state.showFilter && <FilterModal officeOptions={this.state.listOffices} positionOptions={this.state.listPositions} employeeOptions={this.state.listEmployee} onChange={this.onChange} onClick={this.miscFilterAbsences}  onClearFilter={this.resetMiscFilter}/> }
        
        <h1 className="ta-ctr">Absence Log Details</h1>
        <div className="container-row container-header">

          <Searchbar  onSearch={this.onSearch} placeholder="Search on any fields..."/>
          <ButtonPrimary text="SET DATE RANGE" style={{width: '90%'}} onClick={ this.toggleDateRangeModal } />
          <ButtonPrimary icon="filter" style={{width: '30%'}} onClick={this.toggleFilterModal} />
        </div>
        <AbsenceTable onClickImage={this.showImage} tableRows={this.state.tableRows} showMap={this.showMap} />
      </>
    )
  }
}


const DateRangeModal = ({onChange, onClick, onClearFilter}) => (
  <Modal>
    <div className="container-col container-ctr">
      <h1>Choose Date Range to Filter the Absences</h1>
      <h4>Note: The timezone is your timezone.</h4>
      <FormInputDate onChange={onChange} icon="fa-calendar" name="start_range" className="date-modal"/> to
      <FormInputDate onChange={onChange} icon="fa-calendar" name="end_range"  className="date-modal"/>
      <ButtonPrimary text="FILTER" onClick={onClick} style={{marginTop: '15px'}}/>
      <ButtonPrimary text="CLEAR FILTER" onClick={onClearFilter} style={{marginTop: '15px'}}/>
    </div>
  </Modal>
)

const FilterModal = ({onChange, onClick, onClearFilter, positionOptions, officeOptions, employeeOptions}) => (
  <Modal>
    <div className="container-col container-ctr">
      <h1>Miscellaneous Filters</h1>
        <FormInputDropdown options={positionOptions} className="mt-15" onChange={onChange} placeholder="Select a Position to Filter by" name="filterPositionValue"/>
        
        <FormInputDropdown options={officeOptions} className="mt-15" onChange={onChange} placeholder="Select an Office to Filter by" name="filterOfficeValue"/>
        <FormInputDropdown options={employeeOptions} className="mt-15" onChange={onChange} placeholder="Select an Employee to Filter by" name="filterEmployeeValue"/>
      
      <ButtonPrimary text="FILTER" onClick={onClick} style={{marginTop: '15px'}}/>
      <ButtonPrimary text="CLEAR FILTER" onClick={onClearFilter} style={{marginTop: '15px'}}/>
    </div>
  </Modal>
)


const MapModal = ({onClose, lat, lng}) => (
  <Modal>
    <div className="container-col container-ctr">
      <Map viewMode latitude={lat} longitude={lng} mapHeight='50vh' mapWidth='100%'/>
      <ButtonPrimary text="CLOSE" onClick={onClose}/>
    </div>
  </Modal>
)