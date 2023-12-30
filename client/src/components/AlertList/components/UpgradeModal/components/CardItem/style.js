import styled from 'styled-components';

export const CardItemWrapper = styled.div`
    ${({ active }) => active && `
    background: #652dd0;
    border-radius: 16px;
    border: 1px solid #652dd0;

    .Mui-disabled {
        background: #bebebe !important;
        border: none !important;
        color: #fff !important;
    }
    `}
`;

export const CardItemWrapper__active = styled.div`
    color: #fff;
    text-align: center;
    font-family: Assistant;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
`;

export const CardItem = styled.li`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0px 1.96475px 9.74074px 0px rgba(0, 0, 0, 0.02),
        0px 4.72157px 23.40836px 0px rgba(0, 0, 0, 0.03),
        0px 8.8903px 44.07586px 0px rgba(98, 0, 238, 0.04),
        0px 15.85878px 78.62381px 0px rgba(0, 0, 0, 0.04),
        0px 29.6621px 147.05719px 0px rgba(0, 0, 0, 0.05);

    p {
        margin: 0;
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .MuiButtonBase-root {
        margin-top: 24px;

        @media screen and (max-width: 768px) {
            margin-top: 14px;
        }
    }
`;

export const Key = styled.span`
    color: #000;
    text-align: center;
    font-family: Assistant;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px;
`;

export const Value = styled.span`
    color: #000;
    font-family: Assistant;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px;
`;
