import React, { Component } from "react";
import api from "../../services/api";
import t from "../../locale/he_IL";

const lang = t.publicParticipation;


class AddIdea extends Component {

    state = {
        description: '',
        benefits: '',
        drawbacks: ''

    }
    create = () => {
        const {
            description,
            benefits,
            drawbacks

        } = this.state;

        api.post('/idea/', {
            description,
            benefits,
            drawbacks
        })
            .then(() => {

            }).catch((e) => {
                this.error(e)
            })
        return false
    }

    change = (event) => this.setState({ [event.target.id]: event.target.value });

    error = (error) => {
        alert(error)
    }

    render() {
        const { parent } = this.props;
        const { description, benefits, drawbacks } = this.state;

        return (
            <div className="card  w-100">
                <div className="card-header">
                    {lang.addIdea}
                    <button type="button" className="close float-left" aria-label="Back" onClick={parent.switchMain}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="card-body">
                    <form onSubmit={this.create}>

                        <div className="form-group">
                            <label htmlFor="description">{lang.descriptionLabel}</label>
                            <textarea required className="form-control" id="description" rows="5" onChange={this.change} value={description}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="benefits">{lang.benefitsLabel}</label>
                            <textarea className="form-control" id="benefits" rows="3" onChange={this.change} value={benefits}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="drawbacks">{lang.drawbacksLabel}</label>
                            <textarea className="form-control" id="drawbacks" rows="3" onChange={this.change} value={drawbacks}></textarea>

                        </div>
                        <div className="form-group">
                            <button className="btn btn-success">{lang.submit}</button>

                        </div>
                    </form>
                </div>
            </div>)
    }


}

export default AddIdea;