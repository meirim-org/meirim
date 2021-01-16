import React, { useEffect } from 'react';
import { Link } from '../../shared'
import * as SC from './style';
import Icon from '../../assets/svg/successIcon'
import { saveTransaction } from './controller';
import { startUsing } from './constants'
import { successPageCloseMessage, successPageTransactionCompleteMessage } from './constants';
import ManWithHeart from '../../assets/funding/ManWithHeart';

const SuccessPayment = ({ ...props }) => {
    const notifyClosePage = () => {
        window.top.postMessage(
            JSON.stringify({
                error: false,
                message: successPageCloseMessage
            })
        );
    };

    const notifyTransactionComplete = () => {
		window.top.postMessage(
            JSON.stringify({
                error: false,
                message: successPageTransactionCompleteMessage
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

        notifyTransactionComplete();
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
                <SC.SucessPaymeBackground>
                    <div className={'layer'}>
                        <ManWithHeart/>
                    </div>
                    <div className={'layer center'}>
                    <SC.CentredThankYouTitle>תודה רבה!</SC.CentredThankYouTitle>
                    <SC.CentredThankYouSubTitle>{startUsing}</SC.CentredThankYouSubTitle>
                    <Link onClick={()=>{notifyClosePage()}} text="סגירה" url="#"/>
                    </div>
                </SC.SucessPaymeBackground>
            </SC.HeaderWrapper>
        </>
    );
};

export default SuccessPayment;
