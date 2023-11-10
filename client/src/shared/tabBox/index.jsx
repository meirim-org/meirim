import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

const StyledTabBox = withTheme(styled.div`
    position: ${(props) => props.position};
    background-color: ${(props) => props.bgColor};
    border-radius: 12px;
    border: solid 1px ${(props) => props.borderColor};
    padding: 1.5rem;
    margin-bottom: 1.3rem;

    ${({ isComment }) =>
		isComment &&
        `
        overflow: hidden;
        border-radius: 10px;
        background: #FFF;
        border: 0;
        box-shadow: 0px 4.721572399139404px 23.40835952758789px 0px rgba(0, 0, 0, 0.03), 0px 8.890301704406738px 44.075862884521484px 0px rgba(0, 0, 0, 0.04), 0px 15.858778953552246px 78.62380981445312px 0px rgba(0, 0, 0, 0.04), 0px 29.66210174560547px 147.05718994140625px 0px rgba(0, 0, 0, 0.05);
        display: grid;
        padding: 0;
        grid-template-columns: 1fr 1fr;
        // grid-template-areas:
        //     'header header'
        //     'text text'
        //     'like add-comment'
        //     'form form'
        //     'comments comments';
    `}

    ${({ disabled }) =>
		disabled &&
        `
        pointer-events: none;
        user-select: none;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            opacity: 0.7;
            z-index: 1;
            top: 0;
            left: 0;
        } 
    `}
`);

const TabBox = ({
	isComment,
	disabled,
	bgColor,
	position,
	borderColor,
	children,
}) => (
	<StyledTabBox
		isComment={isComment}
		disabled={disabled}
		bgColor={bgColor}
		borderColor={borderColor}
		position={position}
	>
		{children}
	</StyledTabBox>
);

TabBox.defaultProps = {
	isComment: false,
	disabled: false,
	bgColor: '#ffffff',
	borderColor: '#E4E4E4',
	position: 'static',
};

TabBox.propTypes = {
	isComment: PropTypes.bool,
	children: PropTypes.any,
	bgColor: PropTypes.string,
	borderColor: PropTypes.string,
	disabled: PropTypes.bool,
	position: PropTypes.string,
};

export default TabBox;
