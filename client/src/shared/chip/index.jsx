import React from 'react';
import styled from 'styled-components';

const StyledChip = styled.div`
  display: inline-block;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  color: #4D20B2;
  border: 1px solid #4D20B2;
  border-radius: 100px;
  padding: 8px 16px;
  cursor: pointer;
`;

const Chip = ({ text }) => (
	<StyledChip> {text} </StyledChip>
);

export default Chip;
