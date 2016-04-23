/**
 * Created by paulo.simao on 22/04/2016.
 */
function WSRouter() {
	var router = express.Router();

	router.use('/c/:cmd', function (req, res) {
		websys.log.log('Calling cmd:' + req.params.cmd);
		var cmd = require('./cmds/' + req.params.cmd);
		cmd(req, res);
		//res.render('index-pagelets', {cmd: req.params.cmd});
	});


	router.use('/d/:crud', function (req, res) {
		//var cmd = require('./cmds/' + req.params.cmd);
		crudserver(req, res);
		//res.render('index-pagelets', {cmd: req.params.cmd});
	});

	
	return router;
}

module.exports = WSRouter();