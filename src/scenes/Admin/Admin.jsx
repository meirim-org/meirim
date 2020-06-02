import React, { Component } from 'react';

import { Admin as RAAdmin, Resource } from 'react-admin';

import Wrapper from "../../components/Wrapper";
import { PlanList, PlanIcon } from '../../components/Admin/PlanAdmin';
import { CommentList, CommentIcon } from '../../components/Admin/CommentAdmin';

import adminDataProvider from '../../services/adminDataProvider';

import './Admin.css';

const config = require('../../config.json');

class Admin extends Component {
    render() {
        const { me } = this.props;

        return (
            <Wrapper me={me}>
                <div className="container">
                    <RAAdmin dataProvider={adminDataProvider(config.axios.baseURL)}>
                        <Resource name="admin/plans" options={{ label: 'תוכניות' }} list={PlanList} icon={PlanIcon}/>
                        <Resource name="admin/comments" options={{ label: 'תגובות' }} list={CommentList} icon={CommentIcon}/>
                        <Resource name="admin/rates"/>
                    </RAAdmin>
                </div>
            </Wrapper>
        );
    }
}

export default Admin;
