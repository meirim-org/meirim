const fs = require("fs");
exports.up = function (knex) {
	let sql = fs.readFileSync("./meirim.sql").toString();
	return knex
		.raw("CREATE DATABASE IF NOT EXISTS meirim")
		.then(() => knex.raw("USE meirim"))
		.then(() => knex.raw(sql));
};

exports.down = function (knex) {};
