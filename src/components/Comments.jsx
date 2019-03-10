import React, {Component} from 'react';
import _ from 'lodash';

import api from '../services/api';

import avatar from '../assets/logo.png';
import '../assets/bootstrap.css';
import './Comments.css';

import Moment from 'react-moment'

import t from '../locale/he_IL';

class SinglePlan extends Component {
    state = {
       comments: [],
       isLoading: true,
       id: this.props.planId,
       me:  {},
       form: {
        content:'',
        plan_id: this.props.planId,
        parent_id:0
    }
    }
    constructor(props) {
        super(props);
       
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
       
    }
    componentDidMount() {
        const {id} = this.state;

         return api.get('/comment/' + id)
            .then((comments)=>{
                this.setState({comments:comments.data})
                this.setState({me:comments.me})
                this.setState({isLoading:false})
            })
            .catch(error => this.setState({error}))
    }

    render() {
        const {me, id, comments } = this.state || {};

        return <React.Fragment>
            {!this.state.me.id && ( 
                 <div class="text-center container">
                    מה דעתך על התוכנית?<br />
                    <small>יש להירשם כדי להגיב ולהשתתף בדיון</small><br />
                    <a href="/"  class="btn btn-success">חשבון חדש</a> 
                    או   
                    <a href="/sign/in/" class="btn btn-primary">חשבון קיים</a>
                </div> 
            )}
            {this.state.me.id && ( 
            <form class="add-comment"  id="newCommentform" method="post" onSubmit={this.handleSubmit}>    
                <input type="hidden" name="parent_id" value="0"/>
                <input type="hidden" name="plan_id" value="{id}"/>
                <div class="form-group">
                    <br></br>
                     <label for="exampleInputPassword1" class="sr-only">Password</label>
                     <textarea  value={this.state.form.content} required placeholder="מה דעתך על התוכנית?"  name="content" class="form-control" rows="1" onChange={this.handleChange}></textarea>
                </div>
                {!this.state.me.alias && !this.state.me.alias !=='' (
                    <div class="form-group" hidden>
                    <label for="exampleInputEmail1" class="sr-only">כינוי</label>
                    <input type="text" class="form-control" required name="alias" placeholder="כינוי" value="{this.state.me.alias}"/>
                    </div>
                ) }
  
                <button type="submit" class="btn btn-success float-left">שליחה</button>
            </form>
            )}
                <ul id="comments-list" class="comments-list ">
                    {this.state.comments.map((comment, idx) => {
                        return ( <li class="comment-main-level">
                                        <div class="comment-avatar">
                                            <img src={avatar} alt="avatar"></img>
                                        </div>
                                        <div class="comment-box">
                                            <div class="comment-head">
                                                <h6 class="comment-name"><a href={'/profile/'+comment.person.id}>{comment.person.alias || 'אנונימי'} </a></h6>
                                            </div>
                                            <div class="comment-content">  {comment.content} </div>
                                        </div>
                                    </li>)
                    })}
                </ul> 
        </React.Fragment>
    }

    handleSubmit(e){
        let newComment = this.state.form;
        newComment.alias = this.state.me.alias;
        newComment.person_id = this.state.me.person_id;
        
        e.preventDefault();
        api.post('/comment/' + this.state.id, newComment)
        .then((res) => {
            this.setState({done:true})
            this.handleCommentPublished(res.data);
        })
        .catch(error => this.setState( { error }));
    }

    handleCommentPublished(data){
        var newComment = _.merge(data, {
                 person:{
                      alias:this.state.me.alias, 
                     id: this.state.me.id
                   }});
        this.setState({comments:this.state.comments.concat([newComment])});
        let {form }= this.state;
        form.content = '';
        this.setState({form});
        document.getElementByName("newCommentform").reset()
    }

    handleChange(event) {
        event.preventDefault();
        let {form} = this.state;
        const target = event.target;
        form[target.name] = target.value;
    
        this.setState({form});
    
        event.preventDefault();
      }
}


export default SinglePlan;
