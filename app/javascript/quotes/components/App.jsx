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
      {/* Any component rendered by <Route> will get three objects as props:
        location, match, and history.
      */}
    </div>
  </Router>
);

export default App;
