import React, { Component } from 'react'
import './App.css'
import { QMap, HeatMap, MarkerList, Marker, Info, Polygon, utils, config, Circle, ControlPosition } from './components'
import heatData from './data'
import CustomerControl from './CustomControl'

const heatMapOptions = {
  radius: 1,
  maxOpacity: 0.8,
  useLocalExtrema: true,
  valueField: 'cnt'
}

// 默认首都
const defaultCenter = {
  lat: 39.921984,
  lng: 116.418261
}

const roundFun = (value, n = 5) => {
  return parseFloat(value.toFixed(n))
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showInfo: false,
      center: heatData[0] || defaultCenter,
      infoPosition: heatData[0] || defaultCenter,
      polylineVisible: true,
      strokeDashStyle: 'solid',
      polygonPoints: [
        {lat: roundFun(22.53779845431509), lng: roundFun(113.93656424389837)},
        {lat: roundFun(22.540574807809087), lng: roundFun(113.93635769115447)},
        {lat: roundFun(22.542248168090907), lng: roundFun(113.93317359779837)},
        {lat: roundFun(22.540254259833006), lng: roundFun(113.93162700437068)},
        {lat: roundFun(22.538247172738405), lng: roundFun(113.93028937994002)},
        {lat: roundFun(22.53778185230437), lng: roundFun(113.93348019014356)}
      ],
      heatMapData: {
        max: 100,
        data: []
      },
      radius: 100,
      zoom: 16
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        polylineVisible: false,
        radius: 1000,
        strokeDashStyle: 'dash',
        heatMapData: {
          max: 100,
          data: heatData
        }
      })
    }, 3000)
  }

  handleMarkerClick = marker => {
    const { position } = marker
    console.log('marker click')
    utils.getAddressByLatLng(position).then(result => {
      const {
        detail: { nearPois, address }
      } = result
      this.setState({
        content: `${address}${nearPois[0].name}`,
        showInfo: true,
        infoPosition: {...position}
      })
    })
  }

  handleInfoClose = () => {
    this.setState({
      showInfo: false
    })
  }

  handlePolygonChange = e => {
    const { path: { elems } } = e
    if (elems && elems.length) {
      this.setState({
        polygonPoints: e.path.elems.map(el => ({
          lat: roundFun(el.lat),
          lng: roundFun(el.lng)
        }))
      })
    }
  }

  handleRadiusChange = (radius, circle) => {
    const { map } = this.state
    if (map) {
      map.fitBounds(circle.getBounds())
    }
  }

  handleMapIdle = map => {
    console.log('map idle')
    this.setState({
      map
    })
  }

  handleChange = val => {
    console.log(val)
  }

  handleEdit = () => {
    window.alert('编辑')
  }

  handleChoose = () => {
    window.alert('选择')
  }

  render () {
    const { showInfo, center, content, infoPosition, polygonPoints, radius, zoom, strokeDashStyle, heatMapData } = this.state
    const markerPosition = {
      ...center,
      lng: center.lng + 0.008
    }

    return (
      <div className='App'>
        <QMap center={center} style={{ height: '800px' }} zoom={zoom} events={{
          idle: map => this.handleMapIdle(map)
        }}>
          <HeatMap heatData={heatMapData} options={heatMapOptions} />
          <Marker
            position={markerPosition}
            draggable
            visible
            decoration={10}
            animation={config.ANIMATION_DROP}
            events={{
              click: this.handleMarkerClick
            }}
          />
          <MarkerList showDecoration animation={config.ANIMATION_DROP} data={heatData.slice(0, 10)} events={{
            click: this.handleMarkerClick
          }} visible />
          <Info content={content} visible={showInfo} position={infoPosition} events={{
            closeclick: () => this.handleInfoClose()
          }} />
          <Polygon visible points={polygonPoints} strokeDashStyle={strokeDashStyle} editable draggable events={{
            adjustNode: e => this.handlePolygonChange(e),
            removeNode: e => this.handlePolygonChange(e),
            insertNode: e => this.handlePolygonChange(e)
          }} />
          <Circle center={center} radius={radius} strokeColor='#666' strokeDashStyle='dash' strokeWeight={2} events={{
            radius_changed: (circle, e) => this.handleRadiusChange(radius, circle, e)
          }} />
          <CustomerControl
            position={ControlPosition.RIGHT_CENTER}
            style={{
              zIndex: 999
            }}
            onEdit={this.handleEdit}
            onChoose={this.handleChoose}
          />
        </QMap>
      </div>
    )
  }
}

export default App
