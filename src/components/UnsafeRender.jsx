import React, { Component } from 'react';

class UnsafeRender extends Component {
  state = {
    html: this.props.html,
  };

  render() {
    return <div dangerouslySetInnerHTML={this.createMarkup(this.state.html)} />;
  }
  createMarkup(html) {
    return { __html: html };
  }
}

export default UnsafeRender;
