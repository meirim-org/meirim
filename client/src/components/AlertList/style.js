import styled from 'styled-components';

export const Ul = styled.div`
    padding: 32px 80px;
    list-style: none;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media screen and (max-width: 1024px) {
        padding: 0 16px;
        background: transparent;
    }
`;
