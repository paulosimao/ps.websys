/**
 * Created by paulo.simao on 22/04/2016.
 */
var express  = require('express');
var mongoose = require('mongoose');
var path     = require('path')
var fs       = require('fs');
websys.app.use('/ged', express.static(path.join(__dirname, 'webroot')));

var schemaOptions = {
	toObject: {
		virtuals: true
	}
	, toJSON: {
		virtuals: true
	}
};

var DocumentSchema = new mongoose.Schema({
	name        : String,
	desc        : String,
	path        : String,
	mimetype    : String,
	originalname: String,
	size        : Number,
	type        : mongoose.Schema.ObjectId,
	md          : Object
}, schemaOptions);
var DocumentModel  = mongoose.model('Document', DocumentSchema);

var DocumentTypeSchema = new mongoose.Schema({
	name      : String,
	desc      : String,
	code      : String,
	durability: Number,
}, schemaOptions);
DocumentTypeSchema.virtual('label').get(function () {
	return this.code + ' - ' + this.name;
});
var DocumentTypeModel = mongoose.model('DocumentType', DocumentTypeSchema);

var DocumentFilterSchema = new mongoose.Schema({
	value    : String,
	state    : String,
	filter   : String,
	parent_id: mongoose.Schema.ObjectId,

}, schemaOptions);
var DocumentFilterModel  = mongoose.model('DocumentFilter', DocumentFilterSchema);


websys.pm.add('document', DocumentModel);
websys.pm.add('documenttype', DocumentTypeModel);
websys.pm.add('documentfilter', DocumentFilterModel);

websys.api.addCommand('upload', function (req, res) {

	if (req.body) {
		if (req.body.cmd) {
			websys.api.do(req.body.cmd, req, res);
		} else {
			res.json({status: 'ok'});
			res.end();
		}

	}

});

websys.api.addCommand('gedupload', function (req, res) {

	for (f of req.files) {
		var d          = new websys.pm.document();
		d.type         = req.body.doctype;
		d.name         = req.body.docname;
		d.path         = f.path;
		d.mimetype     = f.mimetype;
		d.originalname = f.originalname;
		d.size         = f.size;
		d.save(function (err) {
			if (err) {
				websys.log.err(err);
			}
		});
		res.json({status: 'server', sname: d.path});
	}


	res.end();

});
websys.api.addCommand('geddownload', function (req, res) {

	id = req.query.id;

	websys.pm.document.findById(id, function (err, doc) {
		if (err) {
			websys.log.err(err);
		} else {

			var rstream = fs.createReadStream(doc.path);
			res.writeHead(200, {
				'Content-Type'  : doc.mimetype,
				'Content-Length': doc.size
			});
			rstream.pipe(res);

		}
	})
	
});