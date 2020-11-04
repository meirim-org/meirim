# Frontend

The Meirim frontend is written in Javascript using [React](https://reactjs.org) and [Material-UI](https://material-ui.com).

The frontend code lives under the [client](../client) folder.

## Executing

To run the code after resolving dependencies and configuring as explained in the [main readme](../README.md), use:

```bash
$ npm start
```

The website will then be available on port 3000 (configurable using environment variable "PORT", eg. `PORT=1337 npm start`).

## Building

For production-use the code should be built, uglified, minified etc. This can be done using react-scripts:

```bash
$ npm run build
```

This will result in static files (html, js and others) being prepared under a folder named "build", ready to be served by any HTTP service.

## Caveats

### Open Graph tags

In order to provide Open Graph values for our pages (meaning links shared on social media platforms such as Facebook or WhatsApp will appear with a page title, description and thumbnail instead of just a simple url) we had to add meta og html tags which must be populated by the server and not the client (it can't be browser-run Javascript code since the Open Graph crawlers usually do not run Javascript when they access a page).

We solved this using [Handlebars](https://handlebarsjs.com) to render the templates embedded in our [index.html file](../client/public/index.html). The rendering takes place in the backend by our [static app](../server/api/staticApp.js) which is served alongside the API's app.

The rendered values are currently either plan details for plan pages or default values for all the rest.

This caused issues with the default react-scripts' development server as these templates were not rendered by it and resulted in tags appearing as part of the page, messing up our design and preventing some functionality from working properly. We solved this by using [customize-cra](https://github.com/arackaf/customize-cra) and [react-app-rewired](https://github.com/timarney/react-app-rewired) to add a Handlebars loader to webpack-dev-server, resulting in the template's default values being rendered when developing.

To test the non-default template values (the ones which will be rendered in production) the frontend must be built and served alongside the backend as it is served in production, using the server's serve script:

```bash
$ npm run serve
```

### Backend proxy

Since in production we serve the frontend under [https://meirim.org/](https://meirim.org/) and the backend under [https://meirim.org/api/](https://meirim.org/api/), and despite it being easy to configure the frontend in development to work with a service on another port, we wanted to preserve this behaviour and are using react-scripts' proxy (specifically in [setupProxy.js](../client/src/setupProxy.js)) to proxy requests so the frontend can still communicate through `http://localhost:3000/api/`.
