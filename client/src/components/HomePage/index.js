import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';


const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

function HomePage(props) {
  const classes = props.classes;
  return (
    <div>
      
      <Grid container spacing={24} className={classes.root}>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
      </Grid>
    </div>
  );
};

HomePage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomePage);
