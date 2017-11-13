import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import {BrowserRouter as Router, Link, Route}    from 'react-router-dom';
import LoginContainer           from '../LoginContainer/LoginContainer';

const { Header, Content, Footer } = Layout;

class AppLayout extends Component {
    render() {

        return (
            <div>
            <Router>
                <Layout>
                    <Header style={{textAlign: 'right', position: 'fixed', width: '100%', background: 'white', height: '72px'}}>
                        <div className="logo" style={{
                            width: '120px',
                            height: '40px',
                            background: '#333',
                            borderRadius: '6px',
                            margin: '16px 56px 16px 0',
                            float: 'right',
                        }}>
                        <img className='make-it-fit' src="https://i.imgur.com/tKuuok6.png" alt="äúîåðä çñøä" />
                        </div>
                        <Menu
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{lineHeight: '24px', display: 'inline-flex'}}
                        >
                            <Menu.Item>תרמו לנו</Menu.Item>
                            <Menu.Item>השותפים שלנו</Menu.Item>
                            <Menu.Item>איך עושים שינוי</Menu.Item>
                            <Menu.Item>צור קשר</Menu.Item>
                            <Menu.Item>מי אנחנו</Menu.Item>
                            <Menu.Item>הרשמה</Menu.Item>
                            <Menu.Item>
                              <Link to={'/login'}>כניסה</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{padding: '0 50px', marginTop: 64}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{background: '#fff', padding: 24, minHeight: 380}}>
                            <Route path='/login' component={LoginContainer } />
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        Ant Design ©2016 Created by Ant UED
                    </Footer>
                </Layout>
            </Router>
            </div>
        );
    }
}

export default AppLayout;
