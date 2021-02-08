import styled from "styled-components";
import { device } from "../../style";

export const Member = styled.div`
    text-align: center;
    width: "100px";
    height: "150px";
    font-size: 15px;
    img {
        height: 90px;
        width: 90px;
    }
    .name {
        color: #391695;
        text-align: center;
    }
    .title {
        color: black;
        text-align: center;
    }

    @media ${device.tablet} {
        width: "400px";
        height: "400px";
        padding: 15px;
        font-size: 20px;
        img {
            height: 126px;
            width: 126px;
        }
    }
`;
