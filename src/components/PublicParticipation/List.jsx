
import React, { Component } from "react";
import {Idea, Question} from "./index"

import t from "../../locale/he_IL";

const lang = t.publicParticipation;

const ItemList = ({ parent, improvements, questions, howitworks }) => {

    // merge and sort by score
    const listItems = improvements.concat(questions).sort((a,b) => a.score > b.score)
    return <div>
        <h2>{lang.improvements}</h2>
        <div className="alert alert-info">{howitworks}</div>
        <div className="btn-toolbar" role="toolbar" aria-label="Actions">
            <div className="btn-group mr-2" role="group" aria-label="First group">
                <button onClick={parent.switchIdea} className="btn btn-success" to='/public-participation/idea/'>{lang.iHaveIdea}</button>
            </div>
            <div className="btn-group mr-2" role="group" aria-label="Second group">
                <button onClick={parent.switchQuestion} className="btn btn-secondary" to='/public-participation/question/'>{lang.iHaveQuestion}</button>
            </div>
        </div>
        {listItems.map(item => item.benefits ? <Idea {...item} /> : <Question {...item} />)}
    </div>

}

export default ItemList