var express = require('express');
var connect = require('connect');
var scores = require('./routes/scores_mongoose');
var path = require('path');
var application_root = __dirname;

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(allowCrossDomain);
	app.use(express.bodyParser());
	app.use(connect.compress());
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(app.router);
});

app.get("/api/v1/score", scores.listAllScores);
//app.get("/api/v1/score/:email", scores.getScoreInfo);
app.post("/api/v1/score", scores.insertScore);
app.get("/api/v1/score/:level_name", scores.listScoreByLevel);
//app.post("/api/v1/score", scores.insertScore);

app.listen(3000);