import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
			  return (<Grid item xs key={`team-member-${m.order}`}>
				  <SC.Member>
					<img src={Photos[m.photo]} alt=""></img>
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
