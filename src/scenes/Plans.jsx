import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

import api from '../services/api';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import t from '../locale/he_IL';
import './Plans.css';

class Plans extends Component {
  state = {
    error: false,
    loading: false,
    hasMore: true,
    pageNumber: 1,
    planStatuses: ['פרסום לאישור בעיתונים', 'בתהליך אישור', 'מאושרות'],
    filterStatuses: [],
    plans: []
  }

  constructor(props) {
    super(props);

    this.handleFilterToggle = this
      .handleFilterToggle
      .bind(this);
    
    this.loadPlans = this
      .loadPlans
      .bind(this);
    
    this.filterTimer = undefined;

    // bind scroll event
    window.onscroll = () => {
      const {error, loading, hasMore, filterStatuses, pageNumber} = this.state;

      if (error || loading || !hasMore) return;

      // check if page is scrolled to the bottom
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        this.loadPlans(pageNumber + 1, filterStatuses);
      }
    };
  }

  handleFilterToggle(values) {
    // make sure we don't send more than one request every half second
    if (this.filterTimer !== undefined) {
        clearTimeout(this.filterTimer);
    }

    this.setState({plans: []});
    this.filterTimer = setTimeout(this.loadPlans(1, values), 500); 
  }

  loadPlans(pageNumber, statuses) {
    this.setState({loading: true});

    api.get('/plan?page=' + pageNumber + '&status=' + statuses.join(','))
      .then(result => {
        this.setState({
          loading: false,
          hasMore: result.data.pagination.page < result.data.pagination.pageCount,
          filterStatuses: statuses,
          pageNumber: pageNumber,
          plans: [
            ...this.state.plans,
            ...result.data.records
          ]
        });
      })
      .catch(error => this.setState({error}));
  }

  componentDidMount() {
    const {filterStatuses, pageNumber} = this.state;
    this.loadPlans(pageNumber, filterStatuses);
  }

  render() {
    const {plans, planStatuses, error, loading} = this.state;  
    const {me} = this.props;

    return <React.Fragment>
      <Navigation me={me} />
      <div className="container">
        <ButtonToolbar>
          <ToggleButtonGroup type="checkbox" onChange={this.handleFilterToggle}>
            {planStatuses.map(status =>
              <ToggleButton value={status}>{status}</ToggleButton>
            )}
          </ToggleButtonGroup>
        </ButtonToolbar>
        <table id="alertTable">
          <thead>
            <tr>
              <th>שם תוכנית</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr>
                <td>
                  <Link className="nav-link" to={`/plan/${plan.id}/${plan.PL_NAME}`}>{plan.PL_NAME}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error &&
          <div style={{ color: '#900' }}>
            {error}
          </div>
        }
        {loading &&
          <div>טוען...</div>
        }
      </div>
      <Footer />
    </React.Fragment>
  }
}

export default Plans;
