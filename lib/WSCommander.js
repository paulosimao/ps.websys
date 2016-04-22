/**
 * Created by paulo.simao on 22/04/2016.
 */
function WSCommander() {
	this.cmds = {};
}

WSCommander.prototype.addCommand = function (name, cmd) {
	if (this.cmds[name]) {
		throw new Error('Command:' + name + ' is already registered');
	} else {
		websys.log.log('Registering command:' + name);
		this.cmds[name] = cmd;
	}

}

WSCommander.do = function (name, req, res) {
	return this.cmds[name](req, res);
}

module.exports = WSCommander;