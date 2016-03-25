var express = require('express');
var router = express.Router();
var knex = require('./db/knex');

router.get('/', function(req, res, next) {
    res.render('./index');
})

router.get('/datareq', function(req, res, next) {
    knex('obesity_data').where('age_group_id', 9).then(function(data) {
        res.send(data);
    })
})

router.get('/dataupdate', function(req, res, next) {
    knex('obesity_data').where('age_group_id', 34).then(function(data) {
        res.send(data);
    })
})

module.exports = router;
