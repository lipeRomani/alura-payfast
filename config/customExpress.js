var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');

module.exports = () => {
    var app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    consign()
        .then('controllers')
        .into(app)

    return app;
}