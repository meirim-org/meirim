import styled from 'styled-components';

export const Tumbler = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    right: 32px;
    bottom: 32px;
    z-index: 1000;
    padding: 8px;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;

    .circle {
        display: inine-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid black;
        margin-left: 8px;

        &_blue {
            border-color: #1976d2;
            background: rgba(25, 118, 210, 0.24);
        }

        &_green {
            border-color: #006141;
            background: rgba(0, 133, 88, 0.36);
        }
    }
`;

export const Label = styled.div`
    display: flex;
    align-items: center;
`;

export const InputName = styled.div`
    color: #1f1c21;
    text-align: right;
    font-family: Assistant;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
`;

export const CloseIconWrapper = styled.div`
    position: absolute;
    left: 10px;
    top: 10px;

`