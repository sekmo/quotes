import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import QuotesDisplayer from './QuotesDisplayer';

const App = (props) => (
  <Router firstQuoteId={props.firstQuoteId}>
    <Route
      path='/'
      firstQuoteId={props.firstQuoteId}
      render={(routeProps) => <QuotesDisplayer {...props} {...routeProps} />}
    />
    {/* Any component rendered by <Route> will get three props:
      location, match, and history.
    */}
  </Router>
);

export default App;
