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
    var intAges = [];
    for (var i = 0; i < ages.length; i++) {
        intAges.push(parseInt(ages[i]));
    };
    console.log(intAges);
    knex('obesity_data').whereIn('age_group_id', intAges).then(function(data) {
        res.send(data);
    })
})

module.exports = router;
