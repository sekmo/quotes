import React from 'react';
import ReactDOM from 'react-dom';
import App from '../quotes/components/App';

const quotesDiv = document.querySelector('.quotes');
const firstQuoteId = quotesDiv.dataset.firstQuoteId;
ReactDOM.render(<App firstQuoteId={firstQuoteId} />, quotesDiv);
