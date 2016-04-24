/**
 * Created by paulo.simao on 22/04/2016.
 */
var express  = require('express');
var mongoose = require('mongoose');
var path     = require('path')
var cronjob  = require('cron').CronJob;

websys.app.use('/cron', express.static(path.join(__dirname, 'webroot')));
var crontasks = {};

var CronTaskSchema = new mongoose.Schema({
	name    : String,
	pattern : String,
	timezone: String,
	enabled : {type: Boolean, default: true},
	code    : String
});

var CronTaskModel = mongoose.model('CronTask', CronTaskSchema);
websys.pm.add('crontask', CronTaskModel);

websys.api.addCommand('cronreload', function (req, res) {
	try {
		loadCron();
		res.json({cmd: 'cronreload', status: 'ok'});
		res.end();
	} catch (e) {
		websys.log.err(e);
		res.setStatCode = 500;
		res.json({cmd: 'cronreload', status: 'err', error: e.toString()});
		res.end();
	}
})

function loadCron() {
	websys.pm.crontask.find({enabled: true}, function (err, docs) {
		for (c in crontasks) {
			crontasks[c].stop();
		}
		for (d of docs) {
			try {
				var func = eval('(function(){' + d.code + '})');

				crontasks[d._id.toString()] = new cronjob(d.pattern, func,
					true, /* Start the job right now */
					d.timezone /* Time zone of this job. */
				);
			} catch (e) {
				websys.log.err(e);
			}
		}
	});
}

websys.packages.starttasks.push(loadCron);