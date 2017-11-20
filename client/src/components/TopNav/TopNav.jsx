import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu } from 'antd';

const TopNav = () => {
	return (
		<Menu
			mode="horizontal"
			defaultSelectedKeys={['2']}
			style={{ lineHeight: '24px', display: 'inline-flex' }}
		>
			<Menu.Item>תרמו לנו</Menu.Item>
			<Menu.Item>השותפים שלנו</Menu.Item>
			<Menu.Item>איך עושים שינוי</Menu.Item>
			<Menu.Item>צור קשר</Menu.Item>
			<Menu.Item>מי אנחנו</Menu.Item>
			<Menu.Item>הרשמה</Menu.Item>
			<Menu.Item>
				<NavLink to={'/login'}>כניסה</NavLink>
			</Menu.Item>
		</Menu>
	)
}

export default withRouter(TopNav);
