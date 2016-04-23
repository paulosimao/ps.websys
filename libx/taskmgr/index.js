/**
 * Created by paulo.simao on 22/04/2016.
 */
var express  = require('express');
var mongoose = require('mongoose');
var path     = require('path')

websys.app.use('/task', express.static(path.join(__dirname, 'webroot')));

var TaskSchema = new mongoose.Schema({
	name    : String,
	desc    : String,
	dueby   : Date,
	type    : mongoose.Schema.ObjectId,
	complete: {type: Boolean, default: true}
});

var TaskModel      = mongoose.model('Task', TaskSchema);
var TaskTypeSchema = new mongoose.Schema({
	desc: String,
});

var TaskTypeModel = mongoose.model('TaskType', TaskSchema);
websys.pm.add('tasktype', TaskTypeModel);
websys.pm.add('task', TaskModel);