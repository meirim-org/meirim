import styled from 'styled-components';
import tooltipIcon from '../../assets/icons/tooltip.svg';

export const VerifiedTooltipBox = styled.div`
    position: absolute;
    padding: ${(props) => props.padding || '4px 8px'};
    background: #fdfdfd;
    bottom: ${(props) => props.bottom || '5px'};
    right: ${(props) => props.right || '-87px'};
    color: #222;
    text-align: center;
    font-size: ${(props) => props.fontSize || '14px'};
    font-weight: 400;
    line-height: 24px;
    opacity: 0;
    transition: 0.5s;
    border-radius: 4px;

    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15),
        0 8px 16px 0 rgba(0, 0, 0, 0.08);

    &:before {
        content: '';
        width: 6px;
        height: 8px;
        background: url(${tooltipIcon});
        position: absolute;
        left: ${(props) => props.beforeLeft || '-6px'};
        top: ${(props) => props.beforeTop || 'calc(50% - 4px)'};
        bottom: ${(props) => props.beforeBottom || 'initial'};
        transform: ${(props) => props.beforeTransform};
    }
`;
