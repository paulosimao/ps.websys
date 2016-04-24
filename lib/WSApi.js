/**
 * Created by paulo.simao on 22/04/2016.
 */
function WSApi() {
	this.cmds = {};
}

WSApi.prototype.addCommand = function (name, cmd) {
	if (this.cmds[name]) {
		throw new Error('Command:' + name + ' is already registered');
	} else {
		websys.log.log('Registering command:' + name);
		this.cmds[name] = cmd;
	}

}

WSApi.prototype.do = function (name, req, res) {
	return this.cmds[name](req, res);
}

module.exports = WSApi;