var express = require("express");
var moment = require('moment');
var app = express();
var port = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/:timestamp', function (req, res) {

    var timestamp = req.params.timestamp;
    var unixTimestamp;
    var wordTimestamp;

    if (!isNaN(timestamp)) {
        unixTimestamp =  parseInt(timestamp);
        wordTimestamp = moment.unix(timestamp).utc().format('MMMM DD, YYYY');
        res.send({unix: unixTimestamp, natural: wordTimestamp});
    }
    else if (moment(timestamp, ['MMMM DD, YYYY', 'MMMM D, YYYY', 'MMM DD, YYYY', 'MMM D, YYYY', 'MMMM DD YYYY', 'MMMM D YYYY', 'MMM DD YYYY', 'MMM D YYYY', 'MM-DD-YYYY', 'M-DD-YYYY', 'M-D-YYYY'], true).isValid()) {
        unixTimestamp = moment.utc(timestamp,  ['MMMM DD, YYYY', 'MMMM D, YYYY', 'MMM DD, YYYY', 'MMM D, YYYY', 'MMMM DD YYYY', 'MMMM D YYYY', 'MMM DD YYYY', 'MMM D YYYY', 'MM-DD-YYYY', 'M-DD-YYYY', 'M-D-YYYY']).unix();
        wordTimestamp = moment(timestamp,  ['MMMM DD, YYYY', 'MMMM D, YYYY', 'MMM DD, YYYY', 'MMM D, YYYY', 'MMMM DD YYYY', 'MMMM D YYYY', 'MMM DD YYYY', 'MMM D YYYY', 'MM-DD-YYYY', 'M-DD-YYYY', 'M-D-YYYY']).format( 'MMMM DD, YYYY');
        res.send({unix: unixTimestamp, natural: wordTimestamp});
    } else {
        res.send({unix: null, natural: null});
    }
});

app.listen(port, function () {
  console.log('App listening on port:' + port);
});
