import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Layout } from 'antd';
import TopNav from '../TopNav/TopNav';

require('./header.scss');
const { Header } = Layout;


const HeaderComp = () => {
	return (
		<Header className="main-header">
			<div className="logo">
				<NavLink to='/'><img className='make-it-fit' src="https://i.imgur.com/tKuuok6.png" alt="äúîåðä çñøä" /></NavLink>
			</div>
			<TopNav />
		</Header>
	)
}

export default withRouter(HeaderComp);
