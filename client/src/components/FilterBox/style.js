import styled from 'styled-components';
import { colors } from 'style';

export const FilterBoxWrapper = styled.button`
    border-radius: 4px;
    border: 1px solid ${props => props.selected ? colors.purple[500] : colors.grey[500]};
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: ${colors.white};
    cursor: pointer;
    height: 44px;
    &:focus {
        outline: none;
    }
`;

export const Chip = styled.div`
    border-radius: 50%;
    width: 14px;
    height: 14px;
    background-color: ${props => props.fillColor}
`;