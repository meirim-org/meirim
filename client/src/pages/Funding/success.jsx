import React from 'react';
import styled from 'styled-components';
import { resendActivationLinkToEmail } from './controller'
import { device } from '../../style';
import Wrapper from '../../components/Wrapper';
import * as SC from './style';
import Icon from '../../assets/svg/successIcon'

const SuccessPayment = ({ ...props }) => {
	
	return (
        <>
            <SC.RoadmapItemIcon><Icon/></SC.RoadmapItemIcon>
            <SC.HeaderWrapper>
                <SC.CentredWrapper>
                    <SC.CentredTitle>תמיכתך התקבלה בהצלחה, תודה רבה!</SC.CentredTitle>
                    <SC.CentredSubTitle>בעזרתך נמשיך להגביר את השקיפות התכנונית ולהרחיב את המעורבות האזרחית במערכת התכנון</SC.CentredSubTitle>
                </SC.CentredWrapper>
            </SC.HeaderWrapper>
        </>
	)
};

export default SuccessPayment;
