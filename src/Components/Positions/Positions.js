import React from 'react'
import PositionsTable from '../Util/PositionsTable/PositionsTable'
import Searchbar from '../Util/Searchbar/Searchbar'
import { Link } from 'react-router-dom'
import ButtonPrimary from '../Util/ButtonPrimary/ButtonPrimary'

export default class Positions extends React.Component{

  render(){
    return(
      
      <>
        <div className="container-row container-header">
          <h1 className="mr-15">Positions</h1>
          
          <Searchbar  onSearch={this.onSearch} placeholder="Search offices name, ID or address"/>
          <Link to="/positions/add">
            <ButtonPrimary text="ADD" style={{width: '70%'}} onClick={() => {}} />
          </Link>
        </div>
        <PositionsTable/>
      </>
    )
  }
}