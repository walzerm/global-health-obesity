var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var knex = require('./db/knex');

//Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//Set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set router
var router = require('./controllers/router');
app.use(router);

app.listen(process.env.PORT || 8000, function() {
    console.log('Server going at 8000...');
})
