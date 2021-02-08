import React, { useEffect } from "react";
import { CircularProgress } from "shared";
import { saveTransaction } from "./controller";
import { successPageTransactionCompleteMessage } from "./constants";

const SuccessPayment = ({ ...props }) => {
    const notifyTransactionComplete = () => {
        window.top.postMessage(
            JSON.stringify({
                error: false,
                message: successPageTransactionCompleteMessage,
            }),
            window.location.origin
        );
    };

    const saveSuccessfulTransaction = async (
        yaadId,
        hkId,
        amount,
        redirectParams
    ) => {
        try {
            await saveTransaction({
                yaadId,
                hkId,
                amount,
                redirectParams,
            });
        } catch (err) {
            // do not fail over this
            console.error("save transaction failed:", err);
        }

        notifyTransactionComplete();
    };

    useEffect(() => {
        // read query string
        const qs = new URLSearchParams(props.location.search);
        const id = parseInt(qs.get("Id"));
        const hkid = parseInt(qs.get("HKId"));
        const ccode = qs.get("CCode");
        const amount = parseInt(qs.get("Amount"));

        // check that payment was successful
        if (ccode === "0" && !isNaN(id) && !isNaN(amount)) {
            // build redirect params object
            let redirectParams = {};
            qs.forEach((value, key) => (redirectParams[key] = value));

            saveSuccessfulTransaction(
                id,
                isNaN(hkid) ? null : hkid,
                amount,
                redirectParams
            );
        }
    });

    return <CircularProgress />;
};

export default SuccessPayment;
