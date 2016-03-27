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

router.get('/dataupdate/:ageID', function(req, res, next) {
    var ages = req.params.ageID.split("_");
    for (var i = 0; i < ages.length; i++) {
        ages[i] = parseInt(ages[i]);
    };
    knex('obesity_data').whereIn('age_group_id', ages).then(function(data) {
        res.send(data);
    })
})

module.exports = router;
