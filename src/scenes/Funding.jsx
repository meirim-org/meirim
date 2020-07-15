import React, { Fragment, Component } from "react";
import Wrapper from "../components/Wrapper";
import ReactPlayer from 'react-player'
import {Form, Button, ButtonGroup, ToggleButton} from 'react-bootstrap'

import './Funding.css'

class Funding extends Component {
    state = {
        error: false,
        loading: false,
        form:{
            fullName: undefined,
            email:undefined, 
            phone: undefined,
            amount:undefined,
        },
        funding : {
            monthlyAmounts: [10, 20, 50, 100, 200],
            fundingMonthlyTarget:2000,
            currentSum: 780
        }
    }
   
    constructor(props) {
        super(props);
        this.handleAddress = this.handleAddress.bind(this);
        this.handleSlide = this.handleSlide.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSlide(value) {
        const { form } = this.state;
        form.radius = value;
        this.setState({ form, error: false });
    }

    handleAddress(e) {
        const { form } = this.state;
        form.address = e.target.value;

        this.setState({ form, error: false });
    }

    render() {
        const { me } = this.props;
        const { funding, form, error, bounds, added, deleted } = this.state;
    // need to perform a request to get current data
    return (
        <Wrapper me={me}>
           <div className="container" className="container">
                        <div className="container">
                            <h1>תמיכה במעירים</h1>
                            <div className="row">
                                <div className="col">
                                    <div className="empty_rectangle">
                                        <h4>רוצים לעשות שינוי? הצטרפו עכשיו לקבוצה של מתכנני ערים ומתכנתים </h4>
                                        ₪
                                    </div>
                                    <div className="empty_rectangle">
                                        <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />
                                    </div>
                                </div>
                                <div className="col">
                                        <div className="empty_rectangle">
                                        <div className="donate-options-boxes">
                                            <div className="donate-options-box">
                                                <h4>תמיכה חודשית</h4>
                                                <div className="donation-container">
                                                    {funding.monthlyAmounts.map((amount, idx) => (
                                                        <div>
                                                            <div className="donate-options">
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
    );
                                                    }
}

export default Funding;
