import styled from 'styled-components';
import {device} from '../../style';

export const HeaderWrapper = styled.div`
  background-color:white;
  height:500px;
  text-align:right;
  padding: 1em;  
`;
export const Titles = styled.span`
  float:right; 
    width:100%; 
    background-color:white;
    @media ${device.laptop} {
      width:50%;
   }
`;

export const MediaContent = styled.span`
    float:left; 
    width:100%; 
    @media ${device.laptop} {
      width:50%;
    }
    position:center;
    padding:1em;
`;

export const PaymentWrapper = styled.div`
  float:left; 
  width:100%; 
  padding: 6em 1.5em;
  @media ${device.laptop} {
    width:40%;
  }
`;

export const RoadmapDetails = styled.div`
    float:right; 
    width:100%; 
    padding: 1.5em 1.5em;
    @media ${device.laptop} {
      width:60%;
    }
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  font-family: Assistant !important; 
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  margin-bottom: 1.3em;
  letter-spacing: normal;
  color: #270E78;
  @media ${device.tablet} {
    font-size: 2em;
    font-weight: 600;
    margin-bottom: 1em;
  }
`;

export const SubTitle = styled.h2`
  font-family: Assistant !important;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  line-height: 1.5;
  text-align: right;
  color: #000000;
  margin-bottom: 0;
   >  span {
     font-family: Assistant !important;
   }
`;

export const ThirdTitle = styled.h1`
  font-family: Assistant !important;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  font-size:48px;
  line-height: 1.5;
  color: #270E78;
  margin-bottom: 0;
   >  span {
     font-family: Assistant !important;
   }
`;

export const SubTitleWrapper = styled.div`
    padding-bottom: 3em;
    @media ${device.tablet} {
     padding-bottom: 2.5em;
    }
`;

export const TermsOfUse = styled.span`
  font-family: Assistant !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  line-height: 1.5;
  text-align: center;
  color: #000000;
  margin: 10px;
   >  span {
     font-family: Assistant !important;
   }
`;

export const InputsWrapper = styled.div`
  width:100%
`;

export const MainWrapper = styled.div`
  text-align:right
`;

export const InputWrapper = styled.div`
  margin-bottom: 1.5em;
  .MuiFormControl-root {
    width: 100%;
  }
`;

export const PaymentOptions= styled.div`
  padding: 1.5em;
  background: #CFABFA;
  box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  width:342px;
  height:465px;
`;

export const PaymentOption= styled.span`
  background:${props => !props.selected ? '#FFFFFF' : '#391695'};
  box-shadow: 0px 31.371px 155.529px rgba(0, 0, 0, 0.0503198), 0px 16.7724px 83.1534px rgba(0, 0, 0, 0.0417275), 0px 9.40248px 46.6151px rgba(0, 0, 0, 0.035), 0px 4.99359px 24.7569px rgba(0, 0, 0, 0.0282725);
  border-radius: 12px;
  font-family: Assistant;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #51465E;
  cursor:pointer;
  padding:10px;
  margin:10px;
  display: inline-block;
  height:120px;
  width:120px;
  float:right;
  padding-top: 30px;
  text-align: -webkit-center;
  &:hover, &.active {
    background-color:#FBFBFB;
  };
  overflow-y:auto;
`;

export const Amount =styled.span`
  font-size:26px;
  font-weight: bold;
  line-height: 28px;
`;

export const Monthly =styled.span`
  font-weight: normal;
`;

export const RoadMapTitle= styled.span`
  font-family: Assistant;
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 48px;
  text-align: right;
  color: #270E78;
`;

export const RoadmapItemTitle= styled.div`
  font-family: Assistant SemiBold;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: right;
  color:#270E78;
`;

export const RoadmapItemDescription= styled.div`
  font-family: Assistant;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: right;
`;

export const RoadmapItemIcon= styled.div`
  border: 1px solid #E4E4E4;
  box-sizing: border-box;
  border-radius: 12px;
  float:right;
  height:130px;
  margin:0 1em;
`;

export const RoadmapItemWrapper= styled.div`
 height:136px;
 width: ${device.tablet}px;
 @media ${device.tablet}{
   width:767px;
 }
`;

export const TermsOfUseWrapper= styled.div`
  padding: 1em;
  margin: 1em 0;
  border-radius: 12px;
  font-family: Assistant !important;
  width:100%;
`;

export const InputsTitle = styled.div`
  font-family: Assistant !important;
  font-size: 20px;
  font-weight: normal;
  padding-bottom: 0;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #3e385c;
  margin-bottom: 1.2em;
`;

export const ButtonWrapper = styled.div`
  border-radius:0 0 12px 12px;
  background-color: #f1eef2;
  display: grid;
  padding-right: 1.5em;
  padding-left: 1.5em;
  padding-bottom: ${props => props.smallPadding ? '1em' : '2.45em'};
    @media ${device.tablet} {
     max-width: initial;
     padding-right: 3.7em;
     padding-left: 3.7em;
  }
`;

export const ButtonWrapperVer2 = styled(ButtonWrapper)`
  padding-bottom: 1em;
`;

export const Label = styled.div`
  font-family: Assistant !important;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: right;
  color: #665d71;
`;
