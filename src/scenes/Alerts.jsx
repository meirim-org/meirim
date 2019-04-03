import React, {Component} from 'react';

import {Map, Marker, Popup, TileLayer, GeoJSON, FeatureGroup, Circle} from 'react-leaflet';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {BrowserRouter as Router, Redirect, Link} from 'react-router-dom';

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
        },

        // it does not use it, no map when there is no alerts
        bounds:[{
            lat:35,
            lng:35
        },{
            lat:25,
            lng:25
        }],
        slider:{
            min:1,
            max:10
        },
        signInURL:{
            pathname:'/sign/in',
            state:{
                redirectTo: window.location.pathname
            }
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
            address, 
            // we make the calculation as the slider is LTR, and the value 
            // is the opposite in RTL
            radius: this.state.slider.max + this.state.slider.min- radius
        })
        .then(() => this.getAlerts())
        .finally(()=>{
            this.setState({
                loading: false,
                 form:{
                    radius: 3,
                    address: ''
            }});
        })
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
        .then(result => {
            let transparentLayer = leaflet.geoJSON();
            let fixedBounds = this.state.bounds;
            if(result.data.length > 0){
                result.data.map((alert)=>{
                    leaflet.geoJSON(alert.geom).addTo(transparentLayer);    
                  })
                  const layerBounds = transparentLayer.getBounds();
                  fixedBounds= [layerBounds._southWest, layerBounds._northEast];
                }
         this.setState({bounds: fixedBounds, alerts:result.data});
         
        })
        .catch(error => this.setState({error}))
    }
    
    render() {
        const {alerts, form, error, loading, bounds} = this.state;
        const {me} = this.props;

        const sliderText = {};
        _.map(new Array(this.state.slider.max), (obj, i)=>{
            sliderText[i+1]= this.state.slider.max- i  + " ק״מ";
        })
        // unauthenticatd
        if (error && error.response && error.response.status === 403) {
            return <Redirect to={this.state.signInURL} />
        }
        return <React.Fragment>
            <Navigation me={me}/>
            <div className="container widedialog">
                <form className="rectangle" onSubmit={this.handleSubmit}>
                    <h5 className="container-title">התראה חדשה</h5>
                    {error && <div className="alert alert-danger" role="alert">הכתובת לא נמצאה</div>}
                    <div className="selectAreaAndInterest">
                    כדי לקבל התראות רלבנטיות הזינו כתובת ורדיוס
                    <small>*כתובת מגורים, שיש בה דירה בבעלותכם, או כל כתובת שיש לכם עניין לגבי הסביבה שלה</small>
                    <small>**ניתן להוסיף יותר מכתובת אחת</small>
                </div>
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
                                min={this.state.slider.min}
                                max={this.state.slider.max}
                                onChange={this.handleSlide}
                                marks={sliderText}
                                trackStyle={[{
                                    backgroundColor: 'gray'
                                }
                            ]}
                                handleStyle={[{
                                    backgroundColor: 'blue',
                                    border: "1px solid blue"
                                }
                            ]}
                                railStyle={{
                                backgroundColor: 'blue'
                            }}
                                dots={true}
                                defaultValue={form.radius}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        <br></br><br></br>
                            <button id="submitButton" loading={this.state.loading} title="הוסף התראה" disabled={this.state.loading}>הוספה
                            { this.state.loading && 
                                <FontAwesomeIcon icon="spinner" spin />
                            }
                            </button>
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
                        {
                            alerts.length > 0 &&
                             <Mapa alerts={alerts} bounds={bounds}/> 
                             }
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </React.Fragment>
    }
}



function Mapa(props) {

    return <Map
    bounds = {props.bounds}
    style={{
    height: "300px",
    width: "100%"
    }}>
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
     {props.alerts.map((alert, idx) =>{
        let center = leaflet.geoJSON(alert.geom).getBounds().getCenter();
                return (<Circle radius={alert.radius * 1000} center={center}/>) 
     })}
    </Map>
}

export default Alerts;
