import React, { Fragment, Component } from "react";
import Wrapper from "../components/Wrapper";
import ReactPlayer from 'react-player'
import paymentService from '../services/payment'

import './Funding.css'

class Funding extends Component {
    state = {
        error: false,
        loading: false,
        funding : {
            monthlyAmounts: [10, 20, 50, 100, 200],
        },
        paymnet:{
            status:'none'
        }
    }
   
    constructor(props) {
        super(props);
        this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this);
    }

    handlePaymentSubmit(amount) {
        let payRequest={}
        const { form } = this.state;

        let payment={status : "external"}
        let res =  paymentService.getPaymentURL({amount}).then(url=>{
            this.setState({
                payment:{status:'loadingExternalPayment'}
            })
            // redirecting to external payment
            window.location.href = url

        }).catch(e=>{
            console.log(e)

            this.setState({
                payment:{status:'errorExternalPayment'},
                error:true
            })
        })
    }

    render() {
        const { me } = this.props;
        const { funding } = this.state;
    return (
        <Wrapper me={me}>
           <div className="container" className="container">
                        <div className="container">
                            <h1>תמיכה במעירים</h1>
                            <div className="row">
                                <div className="col">
                                    <div className="empty_rectangle">
                                        <h4>רוצים לעשות שינוי? הצטרפו עכשיו לקבוצה של מתכנני ערים ומתכנתים </h4>
                                        ורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קוואזי במר מודוף. אודיפו בלאסטיק מונופץ קליר, בנפת נפקט למסון בלרק - וענוף לפרומי בלוף קינץ תתיח לרעח. לת צשחמי צש בליא, מנסוטו צמלח לביקו ננבי, צמוקו בלוקריה שיצמה ברורק.

גולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, להאמית קרהשק סכעיט דז מא, מנכם למטכין נשואי מנורךגולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט. קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי לפרומי בלוף קינץ תתיח לרעח. לת צשחמי צש בליא, מנסוטו צמלח לביקו ננבי, צמוקו בלוקריה שיצמה ברורק. נולום ארווס סאפיאן - פוסיליס קוויס, אקווזמן קוואזי במר מודוף. אודיפו בלאסטיק מונופץ קליר, בנפת נפקט למסון בלרק - וענוף קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי קונדימנטום קורוס בליקרה, נונסטי קלובר בריקנה סטום, לפריקך תצטריק לרטי.

קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי סחטיר בלובק. תצטנפל בלינדו למרקל אס לכימפו, דול, צוט ומעיוט - לפתיעם ברשג - ולתיעם גדדיש. קוויז דומור ליאמום בלינך רוגצה. לפמעט
                                    </div>
                                    <div className="empty_rectangle">
                                        <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />
                                    </div>
                                </div>
                            
                                <div className="col">
                                <div className="container" className="container">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                        <div className="empty_rectangle">
                                            <div className="donate-options-boxes">
                                            <div className="col">
                                                <div className="donate-options-box">
                                                    <h4>תמיכה חודשית</h4>
                                                    <div className="donation-container">
                                                        {funding.monthlyAmounts.map((amount, idx) => (
                                                            <div>
                                                                <div className="donate-options" onClick={()=>this.handlePaymentSubmit(amount)}>
                                                                    <h2>
                                                                        ₪{amount}/ חודש
                                                                    </h2>
                                                                    <h3>
                                                                        תקבלו תיק
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                            <div className="donate-options-box">
                                                <h4>תמיכה חד פעמית</h4>
                                                <div className="donation-container">
                                                    {funding.monthlyAmounts.map((amount, idx) => (
                                                        <div>
                                                            <div className="donate-options">
                                                                <h2>
                                                                    ₪{amount}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    <hr/>
                                    <div className="empty_rectangle">
                                        <h4>שאלות נפוצות</h4>
                                        <div className="single-line">
                                           <h5>מדוע?</h5>
                                           <p> טקסט טקסט טקסט טקסט. </p>
                                        </div>
                                    </div>
                                    <hr/>
                                </div>
                            </div>
                        </div>
                    </div>
        </Wrapper>
    );                                        }
}

export default Funding;
