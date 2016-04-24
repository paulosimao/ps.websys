var url    = require('url');
var util   = require('util');
var moment = require('moment');
var q2m    = require('query-to-mongo');
function WSCrudManager() {

}

WSCrudManager.prototype.handle = function (req, res) {
	var crudname = req.params['crud'];

	if (req.body.webix_operation) {
		switch (req.body.webix_operation) {
			case 'update':
				_id = req.body.id;
				websys.pm[crudname].findById(_id, function (err, ret) {
					for (r in req.body) {
						if (r != 'id' && r != '_id' && r != 'webix_operation') {
							ret[r] = req.body[r];
						}
					}
					ret.save(function (err) {
						if (err) {
							websys.log.err(err);
							res.json({id: req.body.id, status: 'error'});
						} else {
							res.json({id: req.body.id, status: 'success'})
						}
						res.end();
					});
				});
				break;
			case 'insert':
				var newobj = new websys.pm[crudname](req.body);
				newobj.save(function (err) {
					if (err) {
						websys.log.err(err);
						res.json({id: req.body.id, status: 'error'});
					} else {
						res.json({id: req.body.id, status: 'success', newid: newobj._id})
					}
					res.end();
				});
				break;
			case 'delete':
				websys.pm[crudname].findByIdAndRemove(req.body.id, function (err, ret) {
					if (err) {
						websys.log.err(err);
						res.json({id: req.body.id, status: 'error'});
					} else {
						res.json({id: req.body.id, status: 'success'})
					}
					res.end();
				});
				break;
		}
	} else {
		var query = req.query.q || '{}';
		var jq    = JSON.parse(query);


		// var myRegexp = /\{(^\}*)\}/g;
		// var match    = myRegexp.exec(query);
		// if (match && match[1]) {
		// 	q      = match[1];
		// 	jquery = q2m(query);
		// } else {
		// 	jquery = {};
		// }
		//

		var mode    = req.query.mode || 'flat';
		var lulabel = req.query.lulabel || '';

		websys.pm[crudname].find(jq, function (err, ret) {
			var ret2 = [];
			var ro   = {};
			for (r of ret) {
				if (mode == 'lu') {
					ro       = {};
					ro.id    = r._id;
					ro.value = r[lulabel];
				} else {
					ro = r.toObject();
					for (k in ro) {
						if (util.isDate(ro[k])) {
							//ro[k] = ro[k].getTime();
							ro[k] = moment(ro[k]).format("YYYY-MM-DD hh:mm:ss");

						}
					}
					ro.id = ro._id;
					delete ro._id;
					delete ro.__v;
				}
				ret2.push(ro);
			}
			if (mode == 'tree') {
				res.json(buildTree(ret2));
			} else {
				res.json(ret2);
			}

			res.end();

		});
	}

	function buildTree(src) {
		var tmp = {};
		var res = [];
		for (i in src) {
			tmp[src[i].id.toString()] = src[i];

			if ((src[i].id == src[i].parent_id) || (src[i].parent_id == null)) {
				res.push(src[i]);
			}
		}
		for (i in src) {
			if (src[i].parent_id && src[i].id != src[i].parent_id) {
				var parent = tmp[src[i].parent_id.toString()];
				if (!parent.data) {
					parent.data = [];
				}
				parent.data.push(src[i]);
			}
		}
		return res;
	}


}

module.exports = WSCrudManager;