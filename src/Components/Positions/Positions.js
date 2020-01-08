import React from 'react'
import PositionsTable from '../Util/PositionsTable/PositionsTable'
import Searchbar from '../Util/Searchbar/Searchbar'
import { Link } from 'react-router-dom'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'
import Cookie from 'js-cookie'
import Loading from '../Util/ModalAndLogin/Loading'
import Modal from '../Util/ModalAndLogin/Modal'
import { API } from '../Util/common'

export default class Positions extends React.Component{
  api = API
  state={
    info :'',
    isLoading: false,
    dataRows: [],
    searchValue: '',
  }

  onSearch = (searchValue) =>{
    
    this.setState({searchValue: searchValue})
  }
  handleDelete = (message, no) => {
    this.setState({info: message});

    if (no){
      let newData = this.state.dataRows.filter(row => row.position_no !== no)
      this.setState({dataRows: newData});
    }
  }
  toggleLoading = () => {
    this.setState({isLoading: !this.state.isLoading})
  }
  componentDidMount = () => {
    this.toggleLoading()
    fetch(`${this.api}/api/position`, {
      headers: {
        'authorization': Cookie.get('JWT_token')
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({isLoading: false, dataRows: data.data})
    })
    .catch( err => this.setState({isLoading: false, info: err.toString()}))

  }
  render(){
    const filteredRows = this.state.dataRows.map( row =>{
      if ([row.position_id.toLowerCase(), row.position_name.toLowerCase(), row.superior_position_no, row.leave_quota, row.leave_valid_after_days, row.leave_valid_for_days, row.late_tolerance_mins].join(' ').indexOf(this.state.searchValue) !== -1) return row; 

    })
    return(
      
      <>
         {this.state.info && 
          
          <Modal onClick={() => {}}>
            <div className="container-col container-ctr" >
              <h1>{this.state.info}</h1>
              <ButtonPrimary onClick={(e) => {this.setState({info: ''}); e.stopPropagation(); }} text={ "CLOSE"}/>
            </div>
          </Modal>
        }
        {this.state.isLoading && <Loading/>}
        <div className="container-row container-header">
          <h1 className="mr-15">Positions</h1>
          
          <Searchbar  onSearch={this.onSearch} placeholder="Search offices name, ID or address"/>
          <Link  to="/positions/add">
            <ButtonPrimary text="ADD" style={{width: '70%'}} onClick={() => {}} />
          </Link>
        </div>
        <PositionsTable  rows={filteredRows} onDelete={this.handleDelete} onLoad={this.toggleLoading}/>
      </>
    )
  }
}