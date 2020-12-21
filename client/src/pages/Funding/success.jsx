import React, {useEffect} from 'react';
import { Link } from '../../shared'
import styled from 'styled-components';
import * as SC from './style';
import Icon from '../../assets/svg/successIcon'

const SuccessPayment = ({ ...props }) => {
    
    const notifyClosePage = () => {
		window.top.postMessage(
            JSON.stringify({
              error: false,
              message: "Close success page"
            }))
	}
    
	return (
        <>
            <SC.RoadmapItemIcon><Icon/></SC.RoadmapItemIcon>
            <SC.HeaderWrapper>
                <SC.CentredWrapper>
                    <SC.CentredTitle>תמיכתך התקבלה בהצלחה, תודה רבה!</SC.CentredTitle>
                    <SC.CentredSubTitle>בעזרתך נמשיך להגביר את השקיפות התכנונית ולהרחיב את המעורבות האזרחית במערכת התכנון</SC.CentredSubTitle>
                    <Link onClick={()=>{notifyClosePage()}} text="סגור"/>
                </SC.CentredWrapper>
            </SC.HeaderWrapper>
        </>
	)
};

export default SuccessPayment;
