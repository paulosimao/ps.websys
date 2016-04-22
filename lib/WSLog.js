/**
 * Created by paulo.simao on 22/04/2016.
 */
function WSLog() {
	
}
WSLog.prototype.log = function (l) {
	console.log(l);
}
WSLog.prototype.err = function (e) {
	console.error(e);
}

module.exports = WSLog;