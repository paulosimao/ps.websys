/**
 * Created by paulo.simao on 22/04/2016.
 */
var express  = require('express');
var mongoose = require('mongoose');
var path = require('path')

websys.app.use('/task', express.static(path.join(__dirname, 'webroot')));

var TaskSchema = new mongoose.Schema({
	name    : String,
	desc    : String,
	dueby   : Date,
	complete: {type: Boolean, default: true}
});

var TaskModel = mongoose.model('Task', TaskSchema);
websys.pm.add('task', TaskModel);