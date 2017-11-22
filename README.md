# Quotes

Display awesome quotes with style! Visit the demo [here](http://quotes-on-rails.herokuapp.com).

## A little experiment

This simple project helped me to understand the basics of React and how Rails 5.1 works with Yarn and Webpack. I built this application following [this awesome article](https://x-team.com/blog/get-in-full-stack-shape-with-rails-5-1-webpacker-and-reactjs/), and I've made some small refactorings on the main React component.

## How it works

### Backend

In our Rails app we have a `pages` controller with a `home` action, which is set as [root](https://github.com/sekmo/quotes/blob/master/config/routes.rb#L2). The correspondent view renders a `<div class="quotes">` which will be hooked from the javascript and filled with some great quotes.



For keeping our data we have a [`Quote` ](https://github.com/sekmo/quotes/blob/master/app/models/quote.rb) model with the `text` and `author` fields. The model provides the `next_id` and `previous_id` methods, in addition to the "field methods" made available by `ActiveRecord`.

We are exposing a very simple API through the [`QuotesController` ](https://github.com/sekmo/quotes/blob/master/app/controllers/api/quotes_controller.rb), which is namespaced under `/api`. The controller provides the `show` [REST action](http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions), so we're able to make GET requests to (e.g). `/api/quotes/22`. And yes, the "RESTfullness" of `ActionPack` is adorable.

To return a JSON representation of a quote we use `jbuilder` (a gem that's included by default in Rails) for the [show](https://github.com/sekmo/quotes/blob/master/app/views/api/quotes/show.json.jbuilder) view, and in the [routes](https://github.com/sekmo/quotes/blob/master/config/routes.rb#L3-L5) config we set `json` as default format, so we don't need to specify `.json` on the GET requests.

### Frontend

When Webpack is [installed and configured](https://github.com/rails/webpacker#installation) to your Rails app, we're able to build javascript packs and drop them into a html view, in the same way we insert an image asset (the `webpacker` gem makes this magic happen).

Every file in `app/javascript/packs/` will be compiled into a standalone pack: in our case we will find the build of `app/javascript/packs/quotes.js` at (e.g.) `/packs/quotes-0123abc.js` (`0123abc` is a made-up content hash - more on fingerprinting [here](http://guides.rubyonrails.org/asset_pipeline.html#what-is-fingerprinting-and-why-should-i-care-questionmark)).

In production the `javascript_pack_tag` helper that we used in the `pages#home` [view](https://github.com/sekmo/quotes/blob/master/app/views/pages/home.html.erb#L2) will refer to the compiled pack `/packs/quotes-0123abc.js`, while in development mode it will be served by the Webpack dev server, which does some magic tricks, like hot reloading. That's why is handy to run `foreman` (`foreman start -f Procfile -p 3000`), instead of manually starting Puma and the Webpack server.

(if we go to the source page when in development mode, and we peak in the js file, we will get presented a huge file: that is webpack that is giving us the magic - in production we will get a reasonable-sized compiled file).

### React components

[`quotes.js`](https://github.com/sekmo/quotes/blob/master/app/javascript/packs/quotes.js) imports the `React` and `ReactDOM` modules from `node_modules` (which are installed by Yarn when the `webpacker:install` task is run), as well as the `App` component from the `components` folder (we don't need to specify the `.jsx` extension).


#### App

The `Router` is the main part of our project. It renders React components depending on the current URL in our browser.

`App` is basically a wrapper for `Router`: it just passes `firstQuoteId` to it, so techically is the root of our application. It's rendered by `ReactDOM` in our page, inside `<div class="quotes">` that we can find in [`home.html.erb`](https://github.com/sekmo/quotes/blob/master/app/views/pages/home.html.erb#L1).

#### Props

React components can render other components, passing them some arguments called `props`. A `prop` is an object property that is shared between a parent component and a child, and the changes on the parent propagate down to the child (that can in turn can share it with some of its children).

Basically, `props` are just read-only piece of data sent to a component by its parent: most of the components in our applications should simply read `props` that they receive, and render them.

In our case we need to to pass the id of the first quote in our database, from the Rails backend to the Frontend: instead of passing it trough the API, it's convenient to pass it through the data attribute of the`<div class="quotes">`. We store it on the constant `firstQuoteId`, then, when the `ReactDOM` renders the `App` component, it passes the `firstQuoteId` prop to it.


#### Router

The Router, in addition to keep an eye on the browser address, renders a Route, which renders the `QuoteDisplayer` component. The Route passes to the `QuoteDisplayer` all its props (thanks to `{...routeProps}`), plus the `firstQuoteId` prop, made accessible by `App`.


#### QuotesDisplayer

This component is rendered by `App`. More specifically: it's rendered by the Route that is rendered by the Router. The Router is exported as `App` , imported in `quotes.js` and rendered by `ReactDOM`.

This object extends the "React Component" object, and its state is initialized with an empty `quote` property.

Before `QuotesDisplayer` is mounted on the DOM, it runs its constructor method and `componentWillMount`, which calls `setQuoteIdFromQueryString()` and `setQuote()`.

After running `componentWillMount` the component is rendered on the DOM (the first time it renders nothing because `this.state.quote` has not been set yet).

`setQuoteIdFromQueryString` parses the query string and stores the id of the quote on its `quoteId` property (it gets the query string from the `search` property of the `location` prop, which is passed by the `Route` object)

`setQuote`, thanks to the `axios` library, makes a GET request referencing the quote id we set before. When the promise will be resolved, `setState()` will store the quote object described on the JSON on the `quote` property of the component state - which is readable through `this.state.quote`.

After running `componentWillMount()` the component will render, but since the promise has not been fulfilled, the quote property in our state is still an empty object, and the first time we render the component we will just render an empty template.

When we receive the response from the Rails server we set the state of our component with `this.setState`, and every time the state of the component mutates, it is re-rendered. Since this time `this.state.quote` has been set, we're able to correctly display the content of our quote. Yay!!!

#### Link and Route

When we click on the "next" link, the `Route` detects a new location, and since it sends the `location` prop to `QuotesDisplayer`, this said component should be re-rendered. When it receives a prop, (and before re-rendering) it will run `componentWillReceiveProps()`, which sets the new quote id with `setQuoteIdFromQueryString`, and runs `setQuote` to make another GET request and set a new quote object in our state.

#### Updating with props and state changes

React components will re-render every time they receives a new prop or when their internal state mutates. In our case we want `QuoteDisplayer` to update the DOM only when its state mutates after we receive the JSON object, and not when it receives the `location` prop from the Route.

To avoid extra renderings we can override the `shouldComponentUpdate` method, which lets us compare the new state we are getting with the current state we are in. The `shouldComponentUpdate` is not invoked when the component is mounted and appears for the fist time on the DOM.

## Considerations

For this specific project it would be probably better to have a JSON response with an array with all the quotes, but I think that's a good example to work with multiple XHR calls. Actually, it would be interesting to integrate Redux to experiment with time travelling!
