import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import QuotesDisplayer from './QuotesDisplayer';

const App = (props) => (
  <Router>
    <div>
      <Route
        path='/'
        component={QuotesDisplayer}
      />
    </div>
  </Router>
);

export default App;
