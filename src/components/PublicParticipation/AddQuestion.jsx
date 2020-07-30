import React, { Component } from "react";
import api from "../../services/api";
import t from "../../locale/he_IL";

const lang = t.publicParticipation;

class AddQuestion extends Component {

    state = {
        description: '',
        title: '',

    }
    create = () => {
        const {
            description,
            title

        } = this.state;

        api.post('/idea/', {
            description,
            title
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
        const { description,title } = this.state;

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
                            <label htmlFor="benefits">{lang.questionTitleLabel}</label>
                            <input className="form-control" id="title"  onChange={this.change} value={title}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">{lang.questionDescriptionLabel}</label>
                            <textarea required className="form-control" id="description" rows="5" onChange={this.change} value={description}></textarea>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-success">{lang.submit}</button>

                        </div>
                    </form>
                </div>
            </div>)
    }


}
export default AddQuestion