import React, { Component } from "react";
import { Link } from "react-router-dom";


import { AddIdea, AddQuestion, Question, Idea, List } from '../components/PublicParticipation'
import api from "../services/api";

import Wrapper from "../components/Wrapper";

import t from "../locale/he_IL";

const lang = t.publicParticipation;

class PublicParticipation extends Component {
    state = {
        mode: '',
        data: {
            id: 1,
            title: 'taba 70',
            description: 'מינהל התכנון באמצעות אתר מעירים עושי משהו',
            explanation: '<div>HTML</div>',
            howitworks: 'בשלב הראשון עושים ככה ואז עושים אחרת',
            questions: true,
            improvements: true

        },
        improvements: [
            {
                id: 1,
                title: 'כותרת הצעה',
                description: 'תיאור',
                benefits: "benefit 1 \n benefit 2\n",
                drawbacks: "drawbacks \n drawbacks\n",
                replyCount: 4,
                score: 40
            },
            {
                id: 2,
                title: 'כותרת הצעה1',
                description: 'תיאור1',
                benefits: "benefit 1 \nbenefit 2\n",
                drawbacks: "drawbacks \ndrawbacks\n",
                replyCount: 4,
                score: 41
            }
        ],
        questions: [
            {
                id: 1,
                title: 'כותרת הצעה',
                description: 'תיאור',
                replyCount: 4,
                score: 43
            },
            {
                id: 2,
                title: 'כותרת הצעה1',
                description: 'תיאור1',

                score: 15
            }
        ],
        error: false,

    };

    switchIdea = () => {
        this.setState({ mode: 'idea' })
    }
    switchQuestion = () => {
        this.setState({ mode: 'question' })
    }
    switchMain = () => {
        this.setState({ mode: '' })
    }


    componentDidMount() {

        api.get("/publicParticipation")
            .then(result => {

            })
            .catch(error => this.setState({ error }));

    }

    mainPanelRenderHelper = (mode) => {
        const { improvements, questions, data } = this.state;
        switch (mode) {
            case 'question':
                return <AddQuestion parent={this} />
            case 'idea':
                return <AddIdea parent={this} />
            default:
                return <List parent={this} improvements={improvements} questions={questions} howitworks={data.howitworks} />
        }
    }

    render() {
        const { mode, data } = this.state;
        const { me } = this.props;


        return (
            <Wrapper me={me}>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1>{data.title}</h1>
                            <p>{data.description}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            {this.mainPanelRenderHelper(mode)}
                        </div>
                        <div className="col">
                            <h2>{lang.explanation}</h2>
                            <div dangerouslySetInnerHTML={{ __html: data.explanation }} />
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}







export default PublicParticipation;
