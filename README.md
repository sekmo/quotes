# Quotes

Display awesome quotes with style! Visit the demo [here](http://quotes-on-rails.herokuapp.com).

## A little experiment

This simple project helped me to understand the basics of React and how Rails 5.1 works with Yarn and Webpacker.

I built this application following [this awesome article](https://x-team.com/blog/get-in-full-stack-shape-with-rails-5-1-webpacker-and-reactjs/).

## How it works

#### Backend

In our Rails app we have a [`Quote` ](https://github.com/sekmo/quotes/blob/master/app/models/quote.rb) model with the `text` and `author` fields. The model provides the `next_id` and `previous_id` methods, in addition to the "field methods" made available by `ActiveRecord`.

We are exposing a very simple API through the [`QuotesController` ](https://github.com/sekmo/quotes/blob/master/app/controllers/api/quotes_controller.rb), which is namespaced under `/api`. The controller provides the `show` [REST action](http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions), so we're able to make GET requests to (e.g). `/api/quotes/22`. Yes, the "RESTfullness" of `ActionPack` is quite amazing.

To return a JSON representation of a quote we use `jbuilder` (a gem that's included in Rails by default) for the [show](https://github.com/sekmo/quotes/blob/master/app/views/api/quotes/show.json.jbuilder) view, and in the [routes](https://github.com/sekmo/quotes/blob/master/config/routes.rb#L3-L5) config we set `json` as default format, so we don't need to specify `.json` on the GET requests.

#### Frontend

Thanks to the `webpacker` gem, we can use `webpack` to build javascript packs and drop them in a html view, in the same way we insert an image asset: we're using the `javascript_pack_tag` in the [template](https://github.com/sekmo/quotes/blob/master/app/views/pages/home.html.erb#L2) that corresponds to the `home` action of the `pages` controller (which is set as the [root](https://github.com/sekmo/quotes/blob/master/config/routes.rb#L2) of our Rails app).

We are declaring the `quotes` pack inside `app/javascript/packs`. A pack is made up of different modules, in our case `React`, `ReactDOM`, and `App`.

...
...
...


## Next steps

For this specific project it would be probably better to have a JSON response with an array with all the quotes, but I think that's a good example to work with multiple XHR calls. Actually, it would be interesting to integrate Redux to experiment with time travelling!
