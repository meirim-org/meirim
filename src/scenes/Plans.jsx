import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import api from '../services/api';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Mapa from '../components/Mapa'
import UnsafeRender from '../components/UnsafeRender';

import t from '../locale/he_IL';
import './Plans.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class Plans extends Component {
  state = {
    error: false,
    loading: false,
    hasMore: true,
    noData: false,
    pageNumber: 1,
    planStatuses: [],
    filterStatuses: [],
    planCounties: [],
    filterCounties: [],
    plans: []
  }

  constructor(props) {
    super(props);

    this.handleStatusToggle = this
      .handleStatusToggle
      .bind(this);
    
    this.handleCountyToggle = this
      .handleCountyToggle
      .bind(this);
    
    this.loadPlans = this
      .loadPlans
      .bind(this);
    
    this.filterTimer = undefined;

    // bind scroll event
    window.onscroll = () => {
      const {error, loading, hasMore, filterStatuses, filterCounties, pageNumber} = this.state;

      if (error || loading || !hasMore) return;

      // check if page is scrolled to the bottom
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        this.loadPlans(pageNumber + 1, filterStatuses, filterCounties);
      }
    };
  }

  handleStatusToggle(event) {
    // make sure we don't send more than one request every half second
    if (this.filterTimer !== undefined) {
      clearTimeout(this.filterTimer);
    }

    const values = [];
    for (let i = 0, l = event.target.value.length; i < l; i += 1) {
      values.push(event.target.value[i]);
    }

    this.setState({
      plans: [],
      filterStatuses: values
    });

    this.filterTimer = setTimeout(this.loadPlans(1, values, this.state.filterCounties), 500); 
  }

  handleCountyToggle(event) {
    // make sure we don't send more than one request every half second
    if (this.filterTimer !== undefined) {
      clearTimeout(this.filterTimer);
    }

    const values = [];
    for (let i = 0, l = event.target.value.length; i < l; i += 1) {
      values.push(event.target.value[i]);
    }

    this.setState({
      plans: [],
      filterCounties: values
    });

    this.filterTimer = setTimeout(this.loadPlans(1, this.state.filterStatuses, values), 500); 
  }

  loadPlans(pageNumber, filterStatuses, filterCounties) {
    this.setState({loading: true, noData: false});

    api.get('/plan?page=' + pageNumber + '&status=' + filterStatuses.join(',') + '&PLAN_COUNTY_NAME=' + filterCounties.join(','))
      .then(result => {
        this.setState({
          loading: false,
          hasMore: result.pagination.page < result.pagination.pageCount,
          noData: this.state.plans.length + result.data.length == 0,
          pageNumber: pageNumber,
          plans: [
            ...this.state.plans,
            ...result.data
          ]
        });
      })
      .catch(error => this.setState({error}));
  }

  componentDidMount() {
    const {pageNumber, filterStatuses, filterCounties} = this.state;

    api.get('/plan_status')
      .then(result => {
        this.setState({
          planStatuses: result.data.map(status => {return status.status;})
        });
      })
      .catch(error => this.setState({error}));
  
    api.get('/plan_county')
      .then(result => {
        this.setState({
          planCounties: result.data.map(county => {return county.PLAN_COUNTY_NAME;})
        });
      })
      .catch(error => this.setState({error}));
    
    this.loadPlans(pageNumber, filterStatuses, filterCounties);
  }

  render() {
    const {plans, planStatuses, filterStatuses, planCounties, filterCounties, error, loading, noData} = this.state;  
    const {me} = this.props;

    return <React.Fragment>
      <Navigation me={me} />
        <div className="container">
          <GridList cellHeight={500} className="gridList" cols={3}>
            {plans.map(plan => (
              <Card className="card" raised={true}>
                <Link className="card-link" to={`/plan/${plan.id}/${plan.PL_NAME}`}>
                  <CardActionArea className="card-action-area">
                    <CardMedia
                      className="card-media"
                      title={plan.PL_NUMBER}>
                      <Mapa geom={plan.geom} hideZoom={true} disableInteractions={true} />
                    </CardMedia>
                    <CardContent className="card-content">
                      <Typography gutterBottom variant="h5" component="h2">
                        {plan.PL_NAME}
                      </Typography>
                      <Typography component="p">
                      <UnsafeRender html={plan.main_details_from_mavat}></UnsafeRender>
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            ))}
          </GridList>

          {error &&
            <div className="error-container">
              {error}
            </div>
          }
          {loading &&
            <div>טוען...</div>
          }
          {noData &&
            <div>אין כאן כלום</div>
          }
        </div>
        <Footer />
      </React.Fragment>
  }
}

export default Plans;
