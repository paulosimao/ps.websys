var url = require('url');

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
				var newobj = new websys.pm[crudname];
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
		var query  = req.query.q;
		var jquery = JSON.parse(query);
		websys.pm[crudname].find(query, function (err, ret) {
			var ret2 = []
			for (r of ret) {
				ro    = r.toObject();
				ro.id = ro._id;
				delete ro._id;
				delete ro.__v;
				ret2.push(ro);
			}
			res.json(ret2);
			res.end();

		});
	}


}

module.exports = WSCrudManager;