import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as QuestionMarkIcon } from 'assets/svg/question-mark.svg';
import { BadgeWrapper } from './InfoBadge.styled';
import { colors } from 'style';

const StyledTooltip = withStyles({
    arrow: {
        color: colors.black,
    },
    tooltip: {
        backgroundColor: colors.black,
        fontSize: '14px',
        padding: '9px 11px',
        textAlign: 'center',
        whiteSpace: 'pre-line'
    },
})(Tooltip);

function InfoBadge(props) {
    const { text } = props;
    return (<StyledTooltip title={text} arrow>
        <BadgeWrapper>
            <QuestionMarkIcon />
        </BadgeWrapper>
    </StyledTooltip>);
}

export default InfoBadge;