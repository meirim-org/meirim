import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import MainPage from './components/MainPage/MainPage';

ReactDOM.render(<MainPage />, document.getElementById('root'));
registerServiceWorker();
