import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { device } from '../../style';
import { style } from '@material-ui/system';

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
  padding: 1.5em 1.5em;
  @media ${device.laptop} {
    width:40%;
  }
  background-color:#FBFBFB;
  width:350px;
  @media screen and (min-width:400px){
    .leftPanel{
      width:460px;
    }
  }
`;

export const PaymnetModalWrapper = styled.div`
  width:100%;
  height:600px;

  .payment-popup{
    width:100%;
    height:100%;
  }

  @media ${device.laptop} {
    height:920px;
    width:800px;

    .payment-popup{
      width:800px;
      height:920px;
    }
  }
`;

export const RoadmapDetails = styled.div`
    float:right; 
    width:100%; 
    display: grid;
    padding: 1.5em 1.5em;
    @media ${device.laptop} {
      width:60%;
    }
    background-color:#FBFBFB;
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

export const CentredTitle = styled.h1`
  font-weight: 400;
  text-align: center;
  font-family: Assistant !important; 
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  margin-bottom: 1.3em;
  letter-spacing: normal;
  color: #29244A;
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

export const CentredSubTitle = styled.h2`
  font-family: Assistant !important;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  line-height: 1.5;
  text-align: center;
  color: #000000;
  margin-bottom: 0;
   >  span {
     font-family: Assistant !important;
   }
`;

export const CentredWrapper = styled.div`
   padding:100px;
`;

export const ThirdTitle = styled.h1`
  font-family: Assistant !important;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  font-size:36px;
  line-height: 1.5;
  color: #270E78;
  margin-bottom: 0;
  padding-top:80px;
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

export const TermsOfPaymentText = styled.span`
  font-family: Assistant !important;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  line-height: 1.5;
  text-align: center;
  color: #000000;
  margin: 50px;
   >  span {
     font-family: Assistant !important;
   }
`;


export const InputsWrapper = styled.div`
  width:100%
`;

export const MainWrapper = styled.div`
  text-align:right;
`;

export const PaymnetWrapper = styled.div`
  text-align:right;
  background-color:red;
  width:800px;
  height:940px;
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
  border-radius: 12px;
  width:342px;
  height:465px;
  user-select:none;
`;

export const PaymentOption= styled.span`
  border-radius: 2px;
  font-family: Assistant; !important;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #51465E;
  cursor:pointer;
  padding:10px;
  margin:10px;
  display: inline-block;
  height:55px;
  width:110px;
  float:right;
  padding-top: 10px;
  text-align: -webkit-center;
  border:1px solid #652DD0;
  overflow-y:auto;
  transition: background-color 200ms;
  user-select:none;
  &:hover, &.active {
    background-color:#FBFBFB;
  };
  &.active {
    background-color:#F0E3FD;
    opacity:(100-12)%;
    transition: background-color 50ms;
  };
  &.longer{
    width:90%;
    overflow-y:hidden;
  }

  label ,input{
    position:absolute;
    margin: 20px;
  }
`;

export const Amount =styled.span`
  font-size:26px;
  font-weight: bold;
  line-height: 28px;
  color: #391695
`;

export const Monthly =styled.span`
  font-weight: normal;
`;

export const RoadMapTitle= styled.span`
  font-family: Assistant;!important;
  font-style: normal;
  font-weight: normal;
  font-size: 28px;
  line-height: 48px;
  text-align: right;
  color: #270E78;
  margin-top: -50px;
  margin-bottom: 30px
  padding-right: 300px;
  padding-right: 40%;
`;

export const FundUsTitle= styled.span`
  font-family: Assistant; important!
  font-style: normal;
  font-weight: normal;
  font-size: 28px;
  line-height: 48px;
  text-align: right;
  color: #270E78;
  margin-top: -100px;
  margin-bottom: 30px;
  padding-right: 30%;
`;

export const RoadmapItemTitle= styled.div`
  font-family: Assistant SemiBold;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: center;
  color:#270E78;

  @media ${device.tablet} {
    text-align: right;
  }
`;

export const RoadmapItemDescription= styled.div`
  font-family: Assistant;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;

  @media ${device.tablet} {
    text-align: right;
  }
`;

export const RoadmapItemIcon= styled.div`
  // border: 1px solid #E4E4E4;
  height: 130px;
  margin: 0 1em;

  svg {
    display: block;
    margin: auto;
  }

  @media ${device.tablet}{
    float: right;
    width: 136px;
  }
`;

export const RoadmapItemWrapper= styled.div`
  max-width: ${device.tablet-100}px;

  @media ${device.tablet} {
    max-width: 767px;
    height: 136px;
  }
`;

export const TermsOfUseWrapper= styled.div`
  padding: 1em;
  margin: 1em 0;
  border-radius: 12px;
  font-family: Assistant !important;
  width:340px%;
  padding-bottom: ${props => props.smallPadding ? '1em' : '2.45em'};
  @media ${device.tablet} {
   max-width: initial;
  }
  >  span {
    font-family: Assistant !important;
  }
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
  max-width:300px;
  display:grid;
  padding-bottom: ${props => props.smallPadding ? '1em' : '2.45em'};
    @media ${device.tablet} {
     max-width: 340px;
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

export const FundingStatsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.25rem .75rem;
`;

export const FundingStatsNumbersWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 1rem -.25rem .75rem;
    width: 100%;
`;

export const FundingStatsNumberWrapper = styled.div`
    position: static;
    border-radius: 12px;
    padding: 0.75rem;
    margin-bottom: 1.3rem;
    box-shadow: 5px 5px 5px 5px #eaeaea;
    -webkit-box-shadow: 5px 5px 5px 5px #eaeaea;
`;

export const FundingStatsGoalBubble = withTheme(styled.div`
    position: relative;
    border-radius: 12px;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    width: 21%;
    left: -87%;
    background-color: ${props => props.theme.palette.primary['100']};

    &:after {
        content: '';
        border: 10px solid transparent;
        border-top-color: ${props => props.theme.palette.primary['100']};
        border-bottom: 0;
        position: absolute;
        bottom: -10px;
        left: 50%;
        margin-left: -10px;
    }

    div {
        text-align: center;
    }
`);

export const PaymentTypeButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 1rem -.25rem .75rem;
  width: 100%;
`;

export const PaymentTypeButton = withTheme(styled.div`
  position: static;
  padding: 0.75rem;
  margin-bottom: 1.3rem;
  cursor: pointer;
  background-color: ${props => props.theme.palette.white};

  span {
    color: ${props => props.theme.palette.primary['main']};
  }

  ${({ selected, theme }) => selected && `
    background-color: ${theme.palette.primary['main']};

    span {
      color: ${theme.palette.white};
    }
  `}

  ${({ side, selected }) => (side === 'right') && `
    border-radius: 0 12px 12px 0;

    ${selected && `
      box-shadow: 5px 5px 5px 5px #eaeaea;
      -webkit-box-shadow: 5px 5px 5px 5px #eaeaea;
    `}
  `}

  ${({ side, selected }) => side === 'left' && `
    border-radius: 12px 0 0 12px;

    ${selected && `
      box-shadow: -5px 5px 5px 5px #eaeaea;
      -webkit-box-shadow: -5px 5px 5px 5px #eaeaea;
    `}
  `}
`);
