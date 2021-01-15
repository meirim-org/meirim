import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { members } from './constants';
import * as SC from './style'
import * as Photos from '../../assets/team'

const useStyles = makeStyles((theme) => ({
	root: {
	  flexGrow: 1,
	}
  }));

const TeamMembers = (props) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
      <Grid container spacing={3}>
	  {
		  members.map(m=>{
			  return (<Grid item xs>
				  <SC.Member>
					<img src={Photos[m.photo]}></img>
				  <div className="name">{m.name} </div>
				  <div className="title"> {m.title} </div>
				  </SC.Member>
			</Grid>)
		  })
	  }
      </Grid>
    </div>
	);
};

export default TeamMembers;
