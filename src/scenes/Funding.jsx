import React, { Fragment, Component } from "react";
import Wrapper from "../components/Wrapper";
import ReactPlayer from 'react-player'
import {Form, Button, ButtonGroup, ToggleButton, ProgressBar} from 'react-bootstrap'

import "./Funding.css";

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
                                    <div>
                                    <ProgressBar animated now={funding.currentSum} max={funding.fundingMonthlyTarget} min="0" label={`₪${funding.currentSum}`} />
                                    </div>
                                    <div className="empty_rectangle">
                                        <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="empty_rectangle">
                                        <h4>תמיכה חודשית</h4>
                                        <Form>
                                            <Form.Group controlId="formBasicName">
                                                <Form.Label>שם מלא</Form.Label>
                                                <Form.Control type="text" placeholder="" />
                                                <Form.Text className="text-muted">
                                                </Form.Text>
                                            </Form.Group>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>כתובת אימייל</Form.Label>
                                                <Form.Control type="email" placeholder="" />
                                                <Form.Text className="text-muted">
                                                </Form.Text>
                                            </Form.Group>
                                            <Form.Group controlId="formBasicMobile">
                                                <Form.Label>מספר טלפון</Form.Label>
                                                <Form.Control type="text" placeholder=""  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required></Form.Control>
                                                <Form.Text className="text-muted">
                                                </Form.Text>
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                            </Form.Group>
                                            <Form.Group controlId="formAmount">
                                            {/* <div className="single-line"> */}
                                                <Form.Label>סכום לתמיכה חודשית</Form.Label>
                                                <ButtonGroup toggle>
                                                    {funding.monthlyAmounts.map((amount, idx) => (
                                                    <ToggleButton
                                                        key={idx}
                                                        type="radio"
                                                        variant="secondary"
                                                        name="radio"
                                                        value={amount}
                                                        checked={20 === amount}
                                                        // onChange={(e) => setRadioValue(e.currentTarget.value)}
                                                    >
                                                        {amount} 
                                                    </ToggleButton>
                                                    ))}
                                            </ButtonGroup>
                                            </Form.Group>
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Check type="checkbox" label="     אני מסכימ/ה לתנאי התקנון" />
                                            </Form.Group>
                                            <Button variant="primary" type="submit" size="lg" block>
                                                לתשלום מאובטח
                                            </Button>
                                            </Form>
                                    </div>
                                    
                                    <div className="empty_rectangle">
                                        <h4>שאלות נפוצות</h4>
                                        <div className="single-line">
                                           <h5>מדוע?</h5>
                                           <p> טקסט טקסט טקסט טקסט. </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        </Wrapper>
    );
                                                    }
}

export default Funding;
