import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import api from "../../services/api";
import t from "../../locale/he_IL";

const lang = t.publicParticipation;


class Question extends Component {

    state = {
        score: false
    }

    up = () => {
        const { id } = this.props;
        api.post('/vote/up/', {
            id
        })
            .then(() => {
                alert('success')
            }).catch((e) => {
                // todo error handler
                this.error(e)
            })
    }
    down = () => {
        const { id } = this.props;
        api.post('/vote/up/', {
            id
        })
            .then(() => {
                alert('success')
            }).catch((e) => {
                // todo error handler
                this.error(e)
            })
    }
 

    error = (error) => {
        alert(error)
    }

    renderScoreHelder = () => {
        return this.state.score || this.props.score
    }
    render() {
        const { title, description, benefits, drawbacks, replyCount, score } = this.props;

        return <div className="card  mb-3">
            <div className="card-header">
                {lang.question}
            </div>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>

                <div className="row">
                    <div className="col-2">
                        <FontAwesomeIcon icon="angle-up" onClick={this.up} />
                        {score}
                        <FontAwesomeIcon icon="angle-down" onClick={this.down} />
                    </div>
                    <div className="col-10">
                        <p className="card-text">
                            {description}
                        </p>
                    </div>
                </div>


            </div>
        </div>
    }
}

export default Question