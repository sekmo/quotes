import React from 'react';
import { Link } from 'react-router-dom';
import queryStringParser from 'query-string';
import axios from 'axios';

class QuotesDisplayer extends React.Component {
  constructor() {
    super();
    this.state = {
      quote: {}
    };
  }

  // this method is invoked immediately before a component is mounted on the DOM and rendered
  componentWillMount() {
    this.setQuoteIdFromQueryString(this.props.location.search);
    this.setQuote();
  }

  // is invoked after receiving the props, and before rendering
  componentWillReceiveProps(newProps) {
    this.setQuoteIdFromQueryString(newProps.location.search);
    this.setQuote();
  }

  setQuoteIdFromQueryString(qs) {
    const queryStringParams = queryStringParser.parse(qs);
    if (queryStringParams.quote_id) {
      // assign quote ID from the URL's query string
      this.quoteId = Number(queryStringParams.quote_id);
    } else {
      this.quoteId = this.props.firstQuoteId;
      // update URL in browser
      this.props.history.push(`/?quote_id=${this.quoteId}`);
    }
  }

  setQuote() {
    axios.get(`api/quotes/${this.quoteId}`)
      .then(response => {
        this.setState({ quote: response.data });
      })
      .catch(error => {
        console.error(error);
      }
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // A component re-renders every time it receives a prop or when its state changes.
    // In this case when it receives the prop 'location' from Route, a re-render occurs by default
    // But we want to re-render this component only after we receive a response and we change the
    // state after the promise has been resolved
    return (this.state.quote != nextState.quote);
  }

  render() {
    const quote = this.state.quote;
    const nextQuoteId = quote.next_id;
    const previousQuoteId = quote.previous_id;

    return(
      <div>
        <div className='quote'>
          <p className='quote-body'>“{quote.text}”</p>
          <p className='quote-author'>– {quote.author}</p>
        </div>
        <div className='quotes__buttons'>
          {previousQuoteId ?
            <Link to={`/?quote_id=${previousQuoteId}`}>
              Previous
            </Link> :
            <Link onClick={e => e.preventDefault()} to={`javascript:void(0)`} className='disabled'>
              Previous
            </Link>
          }
          {nextQuoteId ?
            <Link to={`/?quote_id=${nextQuoteId}`}>
              Next
            </Link> :
            <Link onClick={e => e.preventDefault()} to={`javascript:void(0)`} className='disabled'>
              Next
            </Link>
          }
        </div>
      </div>
    );
  }
}

export default QuotesDisplayer;
