import React from "react";
import { useTheme } from "@material-ui/styles";
import ShareIcon from "@material-ui/icons/Share";
import { openModal } from "redux/modal/slice";
import { useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import { Text } from "shared";
import t from "locale/he_IL";

const SharePlan = () => {
    const dispatch = useDispatch();
    const theme = useTheme();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(openModal({ modalType: "share" }))}
            startIcon={<ShareIcon />}
        >
            <Text
                size="14px"
                text={t.sharing}
                component="span"
                color={theme.palette.gray["800"]}
            />
        </Button>
    );
};

export default SharePlan;
