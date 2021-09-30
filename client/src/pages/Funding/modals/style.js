import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { device, colors } from '../../../style';
import successBackgroundImage from '../../../assets/funding/man.svg';
import SuccessIcon from '../../../assets/svg/successIcon';

export const MainWrapper = styled.div`
  text-align:right;
`;

export const PaymnetModalWrapper = styled.div`
  width:100%;
  height: 80vh;

  .payment-popup{
    width:100%;
    height:100%;
  }

  @media ${device.laptop} {
    width: 800px;

    .payment-popup{
      width: 800px;
    }
  }
`;

export const SuccessWindowWrapper = styled.div`
  background-image: url(${successBackgroundImage});
  background-size: auto;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 10%;

  min-height: 420px;
  width: 95vw;

  @media ${device.laptop} {
    min-width: 30vw;
    width: 500px;
  }
`;

export const PaymentSuccessIcon = styled(SuccessIcon)`
  width: 100%;
`;

export const CentredThankYouTitle = styled.h1`
  font-weight: 400;
  text-align: center;
  font-family: Assistant !important;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  margin-bottom: 1.3em;
  letter-spacing: normal;
  color: #29244A;
  margin: 0.5em;
`;

export const CentredThankYouSubTitle = styled.h2`
  font-family: Assistant !important;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  line-height: 1.5;
  text-align: center;
  color: #000000;
  font-size: 18px;
  width: 60%;
  margin: auto;

   >  span {
     font-family: Assistant !important;
   }
`;

export const SuccessCloseWrapper = withTheme(styled.div`
  width: 100%;
  margin-top: 4em;

  a {
    font-size: 18px;
    display: block;
    width: 100%;
    margin-top: 1em;
  }

  button {
    font-size: 18px;
    display: block;
    margin: 0.5em auto;
    padding: 0.03rem 0.6rem !important;
    min-height: 1em;
    width: 8em;
    border-radius: 12px;

    span {
      text-align: center;
    }
  }

  #button-home {
    color: ${colors.purple[500]} !important;
    background-color: transparent !important;
  }
`);

export const CentredWrapper = styled.div`
  max-width: 80vw;
  max-height: 90vh;
  overflow-y: auto;
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

export const TermsOfPaymentText = styled.span`
  font-family: Assistant !important;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  line-height: 1.5;
  text-align: right;
  color: #000000;
  margin: 0 0.5em 0.5em 0.5em;
  display: inline-block;

  @media ${device.tablet} {
    margin: 0 3em 3em 3em;
  }

   >  span {
     font-family: Assistant !important;
   }
`;
