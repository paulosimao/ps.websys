/**
 * Created by paulo.simao on 22/04/2016.
 */
var fs          = require('fs-extra');
var path_module = require('path');
function WSXLoader() {

	function LoadModules(path) {
		files = fs.readdirSync(path);
		for (d of files) {
			stat = fs.lstatSync(path_module.join(path, d));
			if (stat.isDirectory()) {
				var desc = null;
				try {
					desc = fs.lstatSync(path_module.join(path, d, 'package.json'));
				} catch (e) {

				}

				if (desc) {
					websys.log.log(`Loading extension: ${path_module.join(path, d, 'package.json')}`);
					var package = JSON.parse(fs.readFileSync(path_module.join(path, d, 'package.json')));
					websys.log.log(`Loading extension: ${package.name || ''}`);
					websys.log.log('\t Src Path:' + path_module.join(path, d, 'package.json'));
					websys.log.log(`\t Description: ${package.desc || ''} `);
					websys.log.log(`\t Version ${package.version || ''}`);
					require(path_module.join(__dirname, '..', path, d, package.main));
					websys.log.log(`\tPackage ${package.name || ''}  loaded`);
					websys.packages[package.name] = package;
				}
			}
		}
	}


	var DIR = path_module.join('libx');

	LoadModules(DIR);
}

module.exports = WSXLoader;