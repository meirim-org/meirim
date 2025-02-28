/**
 * Created by Carlos Leonardo Camilo Vargas HUuamán on 12/3/16.
 */

var express = require('express');
var router = express.Router();
var DataBaseHandler = require("../config/DataBaseHandler");
var dataBaseHandler = new DataBaseHandler();

var connection = dataBaseHandler.createConnection();

router.get('/', function (req, res, next) {
    connection.query('CALL sp_GetEmployee();', function (error, result, fields) {
        if (error) throw error;

        if(result[0].length== 0){
            res.status(404).send({
                status : "ERROR",
                message: "No existe usuario en Base de Datos"
            });
        }else{
            res.status(202).send({
                status : "SUCCESS",
                message: "User was found",
                data : result[0]
            });
        }
    });
});

module.exports = router;