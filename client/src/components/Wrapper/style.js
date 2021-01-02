import styled from 'styled-components';
import { device } from '../../style';

export const ChildrenWrapper = styled.div`
    position: relative;
    z-index: 1;
    padding-top: 79px;
    @media ${device.tablet} {
       padding-top: 72px;
    }
`;
