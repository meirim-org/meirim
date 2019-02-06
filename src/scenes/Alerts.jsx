
import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import api from '../services/api';

import t from '../locale/he_IL';
import logo from '../assets/logo.png';
import './Alerts.css';

class Alerts extends Component {
  state = {
    alerts : [],
  }

  componentDidMount() {
    api.get('/alert')
      .then(result => this.setState({alerts: result.data}));
  }
  render() {
    const { alerts } = this.state;
    const { me } = this.props;
    return <React.Fragment>
      <Navigation me={me} />
      <div className="container">
      <div className="row">
        <div className="col">
          <div className="group">
            <img className='large_eyelashes' src={logo} alt={t.name}/>
            <div className="goodMorning">
              ברוכים הבאים למעירים!
            </div>
            <div className="selectAreaAndInterest">
              כדי לקבל התראות רלבנטיות הזינו כתובת ורדיוס:
              <small>*כתובת מגורים, שיש בה דירה בבעלותכם, או כל כתובת שיש לכם עניין לגבי הסביבה שלה</small>
              <small>**ניתן להוסיף יותר מכתובת אחת</small>
            </div>     
          </div>
        </div>
      </div>
      <div className="rectangle" id="container">
        <div className="row">
          <div className="col">
            <AlertTable alerts={alerts} />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="group">
              <label id="homeLabale" >כתובת:</label>
              {/* style="position:relative;" */}
              <input id="homeAddress" type="text" required placeholder="לדוגמה: מאז״ה 9, תל אביב"/>
              <form id="addNewAlert">
                <label id="radiusLabale">רדיוס:</label>
                <div className="row">
                {/* style="display:inline-block; color: #a3a3a3;position:relative;right :0" */}
                  <span id="rangeCurrentNumber" >1</span>
                  {/* style="display:inline-block;color: #a3a3a3;position:relative;right : 0" */}
                  <p id="rangeTextSMrightSide" >ק"מ</p>
                  <input id="radiusRange" type="range" min="1" max="5" value="3" step="1" className="radiusRange"/>
                  {/* style="display:inline-block;color: #a3a3a3;position:relative;right : 0" */}
                  <p id="rangeTextSMleftSide" >5 ק"מ</p>
                  <button id="submitButton">הוספה</button>
                </div>
              </form> 
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </React.Fragment>
  }
}

function AlertTable(props) {
  const { alerts } = props;
  return <table id="alertTable">
    <thead>
      <tr>
        <th>כתובת</th>
        <th>רדיוס</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {alerts.map(alert => {
        return <tr>
          <td>{alert.address}</td>
          <td>{alert.radius+" "+t.km}</td>
          <td><button>Delete</button></td>
        </tr>
      })}
    </tbody>
  </table>
}

export default Alerts;
