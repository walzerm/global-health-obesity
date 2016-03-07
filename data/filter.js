/*
This is a function to reduce the data file down to a more managable size with only the
data from the desired age group
*/

var fs = require('fs');

var dataArr = [];
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.csv')
});

lineReader.on('line', function (line) {
    // var age = /,9,/;
    var lineArr = line.split(',');
    if (lineArr[4] === "9") {
        fs.appendFile('data.csv', line + '\n', function(err, data) {
            if (err) {
                console.log(err);
            }
        })
    }
})
