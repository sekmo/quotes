import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import QuotesDisplayer from './QuotesDisplayer';

const App = (props) => (
  <Router>
    <Route
      path='/'
      render={(routeProps) => <QuotesDisplayer {...routeProps} firstQuoteId={props.firstQuoteId} />}
    />
    {/* Any component rendered by <Route> will get three props:
      location, match, and history.
    */}
  </Router>
);

export default App;
