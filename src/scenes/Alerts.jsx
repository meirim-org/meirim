import React, {Component} from 'react';
import {Map, Marker, Popup, TileLayer, GeoJSON, FeatureGroup, Circle} from 'react-leaflet';
import _ from 'lodash';
import leaflet from 'leaflet';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AlertTable from '../components/AlertTable';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import api from '../services/api';

import t from '../locale/he_IL';
import logo from '../assets/logo.png';
import './Alerts.css';
import "../../node_modules/leaflet/dist/leaflet.css";

class Alerts extends Component {
    state = {
        error: false,
        loading: false,
        alerts: [],
        form: {
            radius: 3,
            address: ''
        }
    }
    constructor(props) {
        super(props);
        this.handleAddress = this
            .handleAddress
            .bind(this);
        this.handleSlide = this
            .handleSlide
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        this.handleDelete = this
            .handleDelete
            .bind(this);
    }
    handleSlide(value) {
        const {form} = this.state;
        form.radius = value;
        this.setState({form, error:false});
    }

    handleAddress(e) {
        const {form} = this.state;
        form.address = e.target.value;

        this.setState({form, error:false});
    }

    handleSubmit(e){
        const {address, radius} = this.state.form;
        e.preventDefault();
        
        this.setState({loading:true});
        
        api.post('/alert',{
            address, radius
        })
        .then(() => this.getAlerts())
        .then(() => this.setState({loading:false}))
        .catch(error => {
            this.setState({error})
            console.error(error);
        })
    }

    handleDelete(alertId) {
        api.delete('/alert/'+alertId)
        .then(() => this.getAlerts())
    }

    componentDidMount() {
        this.getAlerts();
        document.getElementById('homeAddress').focus();
    }

    getAlerts() {
        return api
        .get('/alert')
        .then(result => this.setState({alerts: result.data}))
        .catch(error => this.setState({error}))
    }
    
    render() {
        const {alerts, form, error, loading} = this.state;
        const {me} = this.props;

        return <React.Fragment>
            <Navigation me={me}/>
            <div className="container">
                <img className='large_eyelashes' src={logo} alt={t.name}/>
                <div className="goodMorning">ברוכים הבאים למעירים!</div>
                <div className="selectAreaAndInterest">
                    כדי לקבל התראות רלבנטיות הזינו כתובת ורדיוס:
                    <small>*כתובת מגורים, שיש בה דירה בבעלותכם, או כל כתובת שיש לכם עניין לגבי הסביבה שלה</small>
                    <small>**ניתן להוסיף יותר מכתובת אחת</small>
                </div>
                
                <form className="rectangle" onSubmit={this.handleSubmit}>
                    <h5 className="container-title">ההתראה חדשה</h5>
                    {error && <div className="alert alert-danger" role="alert">הכתובת לא נמצאה</div>}

                    <div className="row">
                        <div className="col">
                            <label id="homeLabale">כתובת:</label>
                            <input
                                id="homeAddress"
                                type="text"
                                value={form.address}
                                required
                                onChange={this.handleAddress}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label id="radiusLabale">רדיוס:</label>
                            <Slider
                                min={1}
                                max={5}
                                onChange={this.handleSlide}
                                marks={{
                                1: '1 ק"מ',
                                2: '2 ק"מ',
                                3: '3 ק"מ',
                                4: '4 ק"מ',
                                5: '5 ק"מ'
                            }}
                                trackStyle={[{
                                    backgroundColor: 'blue'
                                }
                            ]}
                                handleStyle={[{
                                    backgroundColor: 'blue',
                                    border: "1px solid blue"
                                }
                            ]}
                                railStyle={{
                                backgroundColor: 'grey'
                            }}
                                dots={true}
                                defaultValue={form.radius}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button id="submitButton" disabled={loading}>הוספה</button>
                        </div>
                    </div>
                </form>

                <div className="rectangle">
                    <h5 className="container-title">ההתראות שלי</h5>
                    <div className="row">
                        <div className="col col-sm-6">
                            <AlertTable alerts={alerts} onDelete={this.handleDelete}/>
                        </div>
                        <div className="col col-sm-6">
                        { <Mapa alerts={alerts} /> }
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </React.Fragment>
    }
}



function Mapa(props) {

    //= RaduisCircleLayer(props.alerts);
//     // getting all the current alerts and putting them into two layers
//    const transparentLayer = leaflet.geoJSON();
// //    const layer = leaflet.featureGroup();

    //const layer1 = props.alerts.map(alert=>{
    //    var polygon = leaflet.geoJSON(alert.geom).addTo(transparentLayer);
        // creating a circle from the box to display it
      //  var center = polygon.getBounds().getCenter();
       // var c = leaflet.circle([center.lat, center.lng], {
         //   radius: (alert.radius * 1000)
        //});

        // c.alertId = alert.id;
        // c.transparentLayerId = polygon['_leaflet_id'];
        // c.bindTooltip(alert.address+", "+ alert.radius+" "+' ק"מ').openTooltip();
     //   c.addTo(layer);

  // adding the box to the transaparent layer
  // getting the id of the polygon in the t.layer
//   map.fitBounds(transparentLayer.getBounds());
  // });
    return <Map
    // bounds = {layer}
    center={[34, 34]}
    zoom={11}
    style={{
    height: "300px",
    width: "100%"
    }}>
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
      {props.alerts.map((alert, idx) =>{
        let center = leaflet.geoJSON(alert.geom).getBounds().getCenter();
        // let circle = leaflet.circle([center.lat, center.lng], {
        //       radius: (alert.radius * 1000)
        //   });
         return (<Circle radius={alert.radius * 1000} center={center}/>) 
    })}
    </Map>
}

export default Alerts;
