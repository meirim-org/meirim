import styled from 'styled-components';
import { colors } from 'style';

export const BadgeWrapper = styled.div`
    border-radius: 50%;
    background-color: ${colors.orange.contrast};
    text-align: center;
    width: 18px;
    height: 18px;
    cursor: pointer;
`;