/**
 * Created by paulo.simao on 22/04/2016.
 */
var express  = require('express');
var mongoose = require('mongoose');
var path     = require('path');
var ical     = require('ical-generator'),
    http     = require('http'),
    cal      = ical({domain: 'github.com', name: 'my first iCal'});

websys.app.use('/personalschedule', express.static(path.join(__dirname, 'webroot')));

var ScheduleItemSchema = new mongoose.Schema({
	name       : String,
	start      : Date,
	end        : Date,
	timestamp  : {type: Date, defautl: new Date()},
	summary    : String,
	organizer  : String,
	description: String,
	location   : String,
	url        : String
});
var ScheduleItemModel  = mongoose.model('ScheduleItem', ScheduleItemSchema);

websys.pm.add('scheduleitem', ScheduleItemModel);

websys.api.addCommand('ical', function (req, res) {

	websys.pm.scheduleitem.find({}, function (err, docs) {
		if (err) {
			websys.log.err(err);
		} else {
			for (var doc of docs) {
				cal.createEvent(doc.toObject());
			}
			cal.serve(res);
		}
	});
});
