import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopNav from './topNav/';
import HomePage from './HomePage/';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <TopNav/>
          <HomePage/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
