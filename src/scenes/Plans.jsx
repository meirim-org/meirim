import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import InfiniteScroll from 'react-infinite-scroll-component';

import api from '../services/api';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Mapa from '../components/Mapa'
import UnsafeRender from '../components/UnsafeRender';
import FilterAutoCompleteMultiple from '../components/FilterAutoCompleteMultiple';

import t from '../locale/he_IL';
import './Plans.css';

class Plans extends Component {
  state = {
    error: false,
    loading: false,
    hasMore: true,
    noData: false,
    pageNumber: 1,
    planCounties: [],
    filterCounties: [],
    plans: []
  }

  constructor(props) {
    super(props);
    
    this.loadPlans = this
      .loadPlans
      .bind(this);
    
    this.loadNextPage = this
      .loadNextPage
      .bind(this);
    
    this.filterTimer = undefined;
  }

  handleCountyFilterChange(selectedCounties) {
    this.setState({
      plans: []
    });

    this.loadPlans(1, selectedCounties);
  }

  loadPlans(pageNumber, filterCounties) {
    this.setState({
      loading: true,
      noData: false
    });
    
    api.get('/plan?page=' + pageNumber + '&PLAN_COUNTY_NAME=' + filterCounties.join(','))
      .then(result => {
        this.setState({
          loading: false,
          hasMore: result.pagination.page < result.pagination.pageCount,
          noData: this.state.plans.length + result.data.length == 0,
          pageNumber: pageNumber,
          filterCounties: filterCounties,
          plans: [
            ...this.state.plans,
            ...result.data
          ]
        });
      })
      .catch(error => this.setState({error}));
  }

  loadNextPage() {
    const {pageNumber, filterCounties} = this.state;
    this.loadPlans(pageNumber + 1, filterCounties);
  }

  componentDidMount() {
    const {pageNumber, filterCounties} = this.state;
  
    api.get('/plan_county')
      .then(result => {
        this.setState({
          planCounties: result.data.map(county => {return {label: county.PLAN_COUNTY_NAME};})
        });
      })
      .catch(error => this.setState({error}));
    
    this.loadPlans(pageNumber, filterCounties);
  }

  render() {
    const {plans, planCounties, error, loading, noData, hasMore} = this.state;
    const {me} = this.props;

    return <React.Fragment>
      <Navigation me={me} />
      <div className="container">
        <FilterAutoCompleteMultiple 
          classes=""
          placeholder="בחרו רשויות"
          inputSuggestions={planCounties}
          onFilterChange={this.handleCountyFilterChange.bind(this)}
        />
        <br />
        <GridList cellHeight={500} cellWidth={335} className="gridList" cols={1}>
          {plans.map(plan => (
            <Card className="card" raised={true}>
              <Link className="card-link" to={`/plan/${plan.id}/${plan.PL_NAME}`}>
                <CardActionArea className="card-action-area">
                  <CardMedia
                    className="card-media"
                    title={plan.PL_NUMBER}>
                    <Mapa geom={plan.geom} hideZoom={true} disableInteractions={true} title={plan.PLAN_COUNTY_NAME}/>
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
        {noData &&
          <div>אין כאן כלום</div>
        }
      </div>
      <InfiniteScroll
        dataLength={plans.length}
        next={this.loadNextPage}
        hasMore={hasMore}
        loader={<h4>טוען</h4>}
        endMessage={
          <p style={{textAlign: 'center'}}>
            <b>Yay! You have seen it all</b>
          </p>
        }>
      </InfiniteScroll>
      <Footer />
    </React.Fragment>
  }
}

export default Plans;
