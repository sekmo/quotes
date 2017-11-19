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

  componentDidMount() {
    this.setQuoteIdFromQueryString(this.props.location.search);
    this.setQuote(this.quoteId);
  }

  setQuote(id) {
    axios.get(`api/quotes/${id}`)
      .then(response => {
        this.setState({ quote: response.data });
      })
      .catch(error => {
        console.error(error);
      }
    );
  }

  setQuoteIdFromQueryString(qs) {
    let queryStringParams = queryStringParser.parse(qs);
    if (queryStringParams.quote) {
      // assign quote ID from the URL's query string
      this.quoteId = Number(queryStringParams.quote);
    } else {
      this.quoteId = 1;
      // update URL in browser to reflect current quote in query string
      this.props.history.push(`/?quote=${this.quoteId}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setQuoteIdFromQueryString(nextProps.location.search);
    this.setQuote(this.quoteId);
  }

  render() {
    const quote = this.state.quote;
    const nextQuoteId = quote.next_id;
    const previousQuoteId = quote.previous_id;

    return(
      <div>
        <Link to={`/?quote=${nextQuoteId}`}>Next</Link>
        <p>{this.state.quote.text}</p>
        <p>{this.state.quote.author}</p>
      </div>
    );
  }
}

export default QuotesDisplayer;
