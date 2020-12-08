import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MUIDivider from '@material-ui/core/Divider';

const StyledLink = styled(RouterLink)`
  font-family: Assistant !important;
  font-size: 16px;
  font-weight: ${(props) => (props.bold ? '700' : '400')} ;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  text-decoration: underline;
  color: #652dd0;
  cursor: pointer;
  
  .MuiTypography-body1 {
      font-family: Assistant !important;
  }
  
    ${({ withicon }) => withicon  && `
    .MuiListItemIcon-root {
        margin: 0 .25rem;
        min-width: auto;
    }
    &:hover {
     color: #652dd0 !important;
    }
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #1a2d66;
        &:focus, &:hover, &:visited, &:link, &:active {
         text-decoration: none;
         color: none !important;
        }
    `}
`;

const Divider = ({ orientation}) => (
	<MUIDivider orientation={orientation} flexItem="true" variant='fullWidth'></MUIDivider>
);

Divider.defaultProps = {
	orientation: 'vertical',
}

Divider.propTypes = {
	orientation: PropTypes.string,
};

export default Divider;
