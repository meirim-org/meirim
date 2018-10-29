import React from "react";
import db from '../../services/db';


class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {email: '',password:'' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    $('.hpForm button').attr('disabled', true);
    
    db.post('sign/up/', {
        email: $('form.hpForm input[type="email"]').val(),
        password: $('form.hpForm input[type="password"]').val()
      })
      .done(function (response) {
        alert("שלחנו לכם אי מייל עם לינק לסיום ההרשמה.");
      })
      .fail(function errorHandler(xhr, status, errorThrown) {
        switch (xhr.status) {
          case 409:
            errorMessage('כתובת המייל כבר קיימת.');
            break;
  
          default:
            errorMessage("Sorry, there was a problem!\n"+xhr.responseJSON.data);
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
            break;
        }
      })
      .always(function () {
        $('.hpForm button').attr('disabled', false);
      });
  }

  render() {
    return (<form className="hpForm" onSubmit={this.handle}>
    <strong className="d-d-block text-center">הרשמו עכשיו:</strong>
    <div className="form-group">
      <label for="loginEmail">כתובת מייל:</label>
      <input
        required
        type="email"
        name="email"
        id="loginEmail"
        placeholder="yourname@mail.com"
        onChange={this.handleChange} />
    </div>
    <div className="form-group">
      <label for="loginPassword">סיסמה:</label>
      <input
        className=""
        required
        type="password"
        name="password"
        id="loginPassword"
        onChange={this.handleChange} />
    </div>
    <div className="form-group text-center">
      <button type="submit">הרשמה</button>
    </div>
  </form>);
  }
};

export default Register;