import React, { Component } from 'react';

import { Admin, Resource } from 'react-admin';

import Wrapper from "../../components/Wrapper";
import { PlanList, PlanIcon } from '../../components/Admin/PlanAdmin';
import { CommentList, CommentIcon } from '../../components/Admin/CommentAdmin';

import adminDataProvider from '../../services/adminDataProvider';

import './MeirimAdmin.css';

const config = require('../../config.json');

class MeirimAdmin extends Component {
    render() {
        const { me } = this.props;

        return (
            <Wrapper me={me}>
                <div className="container">
                    <Admin dataProvider={adminDataProvider(config.axios.baseURL)}>
                        <Resource name="admin/plans" options={{ label: 'תוכניות' }} list={PlanList} icon={PlanIcon}/>
                        <Resource name="admin/comments" options={{ label: 'תגובות' }} list={CommentList} icon={CommentIcon}/>
                        <Resource name="admin/rates"/>
                    </Admin>
                </div>
            </Wrapper>
        );
    }
}

export default MeirimAdmin;
