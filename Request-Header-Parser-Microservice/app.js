var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||  req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var language = req.get('accept-language');
    var operatingSystem = req.get('user-agent');
    var userInfo = {
        "ip": ip,
        "language": language.split(',')[0],
        "operatingSystem": operatingSystem.split(/[(,)]+/)[1]
     };
    res.send(userInfo);
});

app.listen(port, function () {
  console.log('App listening on port:' + port);
});
