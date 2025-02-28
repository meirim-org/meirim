/**
 * Created by Carlos Leonardo Camilo Vargas HUuamán on 11/20/16.
 */

var mysql = require("mysql");

function DataBaseHandler() {
    this.connection = null;
}

DataBaseHandler.prototype.createConnection = function () {

    this.connection = mysql.createConnection({
        host: process.env.DATABASE_HOST || '127.0.0.1',
        user: 'root',
        password: '123',
        database: 'CHIRINOS',
	    port: 3306
    });

    this.connection.connect(function (err) {
        if (err) {
            console.error("error connecting " + err.stack);
            return null;
        }
        console.log("connected as id " + this.threadId);
    });
    return this.connection;
};

module.exports = DataBaseHandler;
