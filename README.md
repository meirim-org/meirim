Citizens for Municipalities Repo
-------------------------------------

The goal of this project is to enable citizens to effectively organize for their quality of life in their cities and to ensure information about protests is accessible.

[Public Knowledge Workshop](http://www.hasadna.org.il/)

### Contributing

The project is built in a way where nothing has to be done to start working. Open a [Static HTTP Server](https://gist.github.com/willurd/5720255) in the project folder and it should work.

The JavaScript is in the `script.js` file.
The styling is in the `style.css` file.

The code uses Materialize as a CSS framework and Google Maps API for maps.

(The package.json is used for adding typing in editors that support it like VSCode and WebStorm but is entirely optional).

### Adding Data

Auditing data is managed by [Hasadna](https://github.com/hasadna) and Eyal in particular. If you notice a data issue - please open an issue.

The data itself is hosted on a Google Spreadsheet and is proxied by Hasadna's nginx is managing the authorization. The Python code can be found in `/server.js`.

### Maintenance manual

https://docs.google.com/document/d/1Rl3bJOHu2QZP0oY685V1Kf3TNvRhMSwaRyCR_LWAO9Q/edit?usp=sharing

### License

Source code: MIT

The rest is licensed under a Creative Commons Attribution 4.0 International License.
