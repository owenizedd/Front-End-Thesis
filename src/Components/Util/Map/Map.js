import React from 'react'
import GoogleMapReact from 'google-map-react'
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
export default class Map extends React.Component{
  
  state = {
    latitude: 3.58333,
    longitude: 98.66667,
    positions: [],
    marks: [],
    notCreated: true,
  }
  
  handleMapDrag = (map) => {

    let lat = map.center.lat();
    let lng = map.center.lng();
    if (!this.props.positions) this.props.onChange({lat, lng});
    this.setState({
      latitude: lat,
      longitude: lng
    })
  }

  savePosition = () => {
    let pos = [...this.state.positions];

    pos.push({
      lat: this.state.latitude,
      lng: this.state.longitude
    });
    if (this.props.positions) this.props.onChange(pos)
    this.setState({
      positions: pos
    })

    let polygon = new this.state.maps.Polygon({
      paths: pos,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    })
    
    let lastPolygon = this.state.lastPolygon;
    if (lastPolygon) lastPolygon.setMap(null);
    
    this.setState({
      lastPolygon: polygon  
    })
    
    polygon.setMap(this.state.map)
    
    
    let marks = [...this.state.marks];
    let lat = this.state.latitude;
    let lng = this.state.longitude;

    marks.push( 
    <Marker
      lat={lat}
      lng={lng}
      icon="fa-map-marker-alt"/> 
    );
    this.setState({
      marks: marks
    })
  }

  handleApiLoaded = ( map) =>{
    this.setState({ map: map.map, maps: map.maps});

  }

  handleRemovePositions = () => {
    let lastPolygon = this.state.lastPolygon;
    if (lastPolygon) lastPolygon.setMap(null);

    this.setState({marks: [], positions: [], lastPolygon: null});
  }

  componentDidUpdate = () => {

    if (this.props.positions && this.props.positions.length > 0 && this.state.notCreated && this.state.maps) {

      console.log(this.props.positions)
      let marks = this.props.positions.map(pos => {
        
        return <Marker
            lat={+pos.latitude}
            lng={+pos.longitude}
            icon="fa-map-marker-alt"/> 
          
      })
      let positions = this.props.positions.map(pos => {
        return {lat: +pos.latitude, lng: +pos.longitude}
      })
      
      let polygon = new this.state.maps.Polygon({
        paths: positions,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      })
      polygon.setMap(this.state.map);
      let lastPolygon = this.state.lastPolygon;
      if (lastPolygon) lastPolygon.setMap(null);
      
      this.setState({
        lastPolygon: polygon,
        positions: positions, 
        marks: marks, 
        notCreated: false
      })
    }
  }
  render(){
    return(
      <div style={{ height: '30vh', width: '60%', margin: '70px auto' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBVtXZctg2ms2KiPOqxnPr7wxDQuY5zTFw' }}
          defaultCenter={{lat: 3.58333, lng: 98.66667}} 
          defaultZoom={12}
          // onChange={this.handleMapChange}
          onDrag={this.handleMapDrag}
          onGoogleApiLoaded={(map, maps) => this.handleApiLoaded(map,maps)}
          ref="googleMaps"
        >

          {this.state.marks}

          <Marker
            lat={this.state.latitude}
            lng={this.state.longitude}
            icon="fa-map-marker-alt"/>

        </GoogleMapReact>

        {
          this.props.positions 
          
          && 
          
          <div className="container-row container-ctr spc-ev">
            <ButtonPrimary text="REMOVE POSITIONS"    style={{marginTop: '15px'}} onClick={this.handleRemovePositions}/>
            <ButtonPrimary text="SAVE POSITION" style={{marginTop: '15px'}} onClick={this.savePosition}/>
            
            <span className="mt-15 ml-15"> {this.state.positions.length} positions saved.</span>
          </div>
        }
      </div>
    )
  }

}

const Marker = ({ icon }) => (
  <div style={{
    color: '#251A3C', 
    padding: '5px 5px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)',
    fontSize: '3em',
    position: 'relative',
    top: '-15px'
  }}>
    <i className={"fa " + icon} style={{color: '#31254B', textShadow: '1px 1px 3px rgba(0,0,0,.3)'}}></i>
  </div>
);