var express = require('express');
var app = express();
var path = require('path');
var knex = require('./db/knex.js');

//Middleware
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

//Set router
var router = require('./map');
app.use(router);

app.listen(process.env.PORT || 8000, function() {
    console.log('Server going at 8000...');
})
