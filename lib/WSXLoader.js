/**
 * Created by paulo.simao on 22/04/2016.
 */
var fs          = require('fs-extra');
var path_module = require('path');
function WSXLoader() {

	function LoadModules(path) {
		files = fs.readdirSync(path);
		for (f of files) {
			stat = fs.lstatSync(path_module.join(path, f));
			if (!stat.isDirectory()) {
				websys.log.log('Loading extension:' + path + '/' + f);
				require(path_module.join(__dirname, '..', path, f));
			}
		}
	}


	var DIR = path_module.join('libx');
	LoadModules(DIR);
}

module.exports = WSXLoader;