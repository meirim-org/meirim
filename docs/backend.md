# Backend

The Meirim backend is written in Javascript (Node.js, we currently use release 14.x), using [Express](https://expressjs.com) and [Bookshelf](https://bookshelfjs.org), with [Knex](http://knexjs.org) used for database migrations. We currently use [MySQL](https://mysql.com) as our database.

The backend code lives under the [server](../server) folder.

## Executing

To run the code after resolving dependencies and configuring as explained in the [main readme](../README.md), use:

```bash
$ npm start
```

The service will then be available on port 3001 (configurable using environment variable "PORT", eg. `PORT=1337 npm start`).

## Caveats

### Static app and routes

You may have noticed that our main serve script used for production (`npm run serve`) creates an Express instance and binds two apps to it - the backend app (from [apiApp.js](../server/api/apiApp.js)) under the '/api' path and a static app (from [staticApp.js](../server/api/staticApp.js)) under the root '/' path.

This is used in production to enable a little bit of server-side rendering for rendering our Open Graph tags.

Basically, the static app simply points to the static website files (built using react-scripts) from the client package which can also be served as-is (but will contain unrendered template tags), and registers a Handlebars templating engine which will be used to render html files served under this app.
