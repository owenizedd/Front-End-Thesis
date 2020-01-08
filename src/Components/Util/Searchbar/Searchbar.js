import React from 'react'
import './Searchbar.css';

export default class Searchbar extends React.Component{
  state = {
  }
  handleChange = (evt) =>{
    const {name, value} = evt.target;
    this.setState({
      [name]: value
    })
    this.props.onSearch(value)
  }
  render(){
    const {onSearch, placeholder, className} = this.props;
    return(
      <div className={`searchbar ${className || ' '}`}>
        <input type="text" name="searchbar" id="searchbar"  placeholder={placeholder} value={this.state.searchbar} onChange={this.handleChange}/>
        <i className="fa fa-search search-icon" onClick={() => onSearch(this.state.searchbar)}></i>
      </div>
    )
  }
}
