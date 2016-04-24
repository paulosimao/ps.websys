/**
 * Created by paulo.simao on 22/04/2016.
 */
//region Requires
var multer        = require('multer');
var config        = require('../etc/config.json');
var async         = require('async');
var WSLog         = require('./WSLog');
var MongoClient   = require('mongodb').MongoClient;
var express       = require('express');
var bodyparser    = require('body-parser');
var cookieparser  = require('cookie-parser');
var session       = require('session');
var httpproto     = require('http');
var path          = require('path');
var wsapi         = require('./WSApi');
var wssession     = require('./WSSession');
var wspersistence = require('./WSPersistence');
var wsxloader     = require('./WSXLoader');
var wscrudmanager = require('./WSCrudManager');
//endregion


//region Startup Tasks
var starttasks = [];
//Setup logging
starttasks.push(function (cb) {
	global.websys     = {};
	global.websys.log = new WSLog();
	websys.log.log('Started logging');
	cb();
});
//Load Config
starttasks.push(function (cb) {
	global.websys.config = config;
	websys.log.log('Config loaded');
	cb();
});
//Connect to DB
starttasks.push(function (cb) {
	websys.log.log('Connecting to db:' + config.mongourl);
	MongoClient.connect(config.mongourl, function (err, db) {
		if (err) {
			websys.log.err(err);
			return cb(err);
		}
		websys.db = db;
		websys.log.log('Initiating Persistence Manager.');
		wspersistence();
		websys.log.log('Persistence Manager Up.');
		cb();
	});
});
//Setup Commander
starttasks.push(function (cb) {
	websys.api = new wsapi();
	cb();
});
//Setup Commander
starttasks.push(function (cb) {
	websys.crud = new wscrudmanager();
	cb();
});

//Setting up webserver
starttasks.push(function (cb) {
	websys.log.log('Setting up webserver');
	var app = express();

	app.use(cookieparser());

	var upload = multer({dest: config.upload.dstdir})
	app.use(bodyparser.json());
	app.use(bodyparser.urlencoded({extended: true}));
	app.use(upload.any());
	//app.use(multipart());
	app.use(wssession);

	app.set('view engine', 'ejs');
	app.set('jsonp callback name', 'cb');


	app.use('/c/:api', function (req, res) {
		websys.log.log('Calling api:' + req.params.api);
		websys.api.do(req.params.api, req, res);
	});

	app.use('/d/:crud', function (req, res) {
		websys.crud.handle(req, res);
	});


	app.use(express.static('webroot'));
	websys.app = app;

	cb();


});
//loading extensions
starttasks.push(function (cb) {

	websys.packages = {};

	wsxloader();
	cb();
});
//Open up webserver
starttasks.push(function (cb) {
	websys.app.listen(config.web.port, function () {
		websys.log.log('Server up on port:' + config.web.port);
		cb();
	});
});
//endregion

function WSSserver() {

}

WSSserver.prototype.load = function () {
	async.series(starttasks, function (err, res) {
		if (err) {
			return websys.log.err(err);
		} else {
			websys.log.log('System up.')
		}
	})
}

module.exports = WSSserver;