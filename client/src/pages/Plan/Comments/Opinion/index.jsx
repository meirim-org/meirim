import React from 'react';
import {Button, TabBox, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
import {Badge, Radio} from '@material-ui/core';
import {useTheme} from "@material-ui/styles";
import PropTypes from "prop-types";

const daysPassed = (date) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = Date.now();

    return ` ${Math.round(Math.abs((today - date) / oneDay))} `;
}

const Opinion = ({
    opinion,
    disabled,
    key
}) => {
    const theme = useTheme();

    return (
        <TabBox isOpinion={true} disabled={disabled} key={key}>
            <SC.Header>
                <SC.FirstSide>
                    <Typography
                        variant="menuTitle"
                        mobileVariant="menuTitle"
                        component="span"
                        color={theme.palette.green['text2']}
                    >
                        {opinion.type}
                    </Typography>
                    <Typography
                        variant="highlightedText"
                        mobileVariant="highlightedText"
                        component="span"
                        color={theme.palette.black}
                    >
                        {opinion.name}
                    </Typography>
                </SC.FirstSide>
                <SC.SecondSide>
                    <Typography
                        variant="light"
                        mobileVariant="light"
                        component="span"
                        color={theme.palette.gray['main']}
                    >
                        לפני
                        {daysPassed(opinion.timeStamp)}
                        ימים
                    </Typography>
                </SC.SecondSide>
            </SC.Header>
            <SC.Text>
                <Typography
                    variant="paragraphText"
                    mobileVariant="paragraphText"
                    component="p"
                    color={theme.palette.black}
                >
                    {opinion.text}
                </Typography>
            </SC.Text>
            <SC.Like>
                <Button
                    id={"like-" + key}
                    textColor={theme.palette.black}
                    text={t.iLike}
                    onClick={() => ''}
                    simple
                    iconBefore={<SC.LikeIcon/>}
                />
                <Badge
                    badgeContent={opinion.likes.toString()}
                />
            </SC.Like>
            <SC.AddComment>
                <Button
                    id={"add-response-" + key}
                    textColor={theme.palette.black}
                    text={t.addAResponse}
                    onClick={() => ''}
                    simple
                    iconBefore={<SC.CommentIcon/>}
                />
            </SC.AddComment>
        </TabBox>
    )
};

Opinion.defaultProps = {
    disabled: false,
};

Opinion.propTypes = {
    opinion: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    key: PropTypes.string.isRequired,
};

export default Opinion;
