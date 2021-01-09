import React, { useEffect } from 'react';
import { Link } from '../../shared'
import styled from 'styled-components';
import * as SC from './style';
import Icon from '../../assets/svg/successIcon'
import { saveTransaction } from './controller';

const SuccessPayment = ({ ...props }) => {
    const notifyClosePage = () => {
		window.top.postMessage(
            JSON.stringify({
              error: false,
              message: "Close success page"
            })
        );
    };

    const saveSuccessfulTransaction = async (yaadId, hkId, amount) => {
        try {
            await saveTransaction({
                yaadId,
                hkId,
                amount
            });
        } catch (err) {
            // do not fail over this
            console.error('save transaction failed:', err);
        }
    };

    useEffect(() => {
        // read query string
        const qs = new URLSearchParams(props.location.search);
        const id = parseInt(qs.get('Id'));
        const hkid = parseInt(qs.get('HKId'));
        const ccode = qs.get('CCode');
        const amount = parseInt(qs.get('Amount'));

        // check that payment was successful
        if (ccode === '0' && !isNaN(id) && !isNaN(amount)) {
            saveSuccessfulTransaction(id, isNaN(hkid) ? null : hkid, amount);
        }
    });
    
    return (
        <>
            <SC.HeaderWrapper>
                <SC.CentredWrapper>
                    <Icon/>
                    <SC.CentredTitle>תמיכתך התקבלה בהצלחה, תודה רבה!</SC.CentredTitle>
                    <SC.CentredSubTitle>בעזרתך נמשיך להגביר את השקיפות התכנונית ולהרחיב את המעורבות האזרחית במערכת התכנון</SC.CentredSubTitle>
                    <Link onClick={()=>{notifyClosePage()}} text="סגור"/>
                </SC.CentredWrapper>
            </SC.HeaderWrapper>
        </>
    );
};

export default SuccessPayment;
