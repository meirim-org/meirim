import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Layout } from 'antd';
import TopNav from '../TopNav';

const { Header } = Layout;


const HeaderComp = () => {
	return (
		<Header style={{ textAlign: 'right', position: 'fixed', width: '100%', background: 'white', height: '72px' }}>
			<div className="logo" style={{
				width: '120px',
				height: '40px',
				background: '#333',
				borderRadius: '6px',
				margin: '16px 56px 16px 0',
				float: 'right',
			}}>
				<NavLink to='/'><img className='make-it-fit' src="https://i.imgur.com/tKuuok6.png" alt="äúîåðä çñøä" /></NavLink>
			</div>
			<TopNav />
		</Header>
	)
}

export default withRouter(HeaderComp);
