/**
 * Created by paulo.simao on 22/04/2016.
 */
function WSSession(req, res, next) {
	

	function parseCookies(request) {
		var list = {},
		    rc   = request.headers.cookie;
		
		rc && rc.split(';').forEach(function (cookie) {
			var parts                  = cookie.split('=');
			list[parts.shift().trim()] = decodeURI(parts.join('='));
		});
		
		return list;
	}
	
	function authmw(req, res, next) {
		var COOKIE_NAME = websys.config.web.cookiename;
		console.log(req.originalUrl);
		
		var cookies = parseCookies(req);
		
		if (cookies[COOKIE_NAME]) {
			console.log('Cookie found');
			session = cookies[COOKIE_NAME];
			websys.pm.usersession.findBySessionID(session, function (err, session) {
				if (err) {
					console.log('Normal URL - DB ERROR - AUTH required');
					console.error(err);
					res.render('login');
				}
				
				if (!session) {
					console.log('Normal URL - No Session Found - AUTH required');
					doAuth();
				}
				else {
					console.log('Normal URL - Session Found - AUTH OK');
					req.session = session;
					next();
					//console.log(session);
				}
			});
		} else {
			console.log('Cookie NOT FOUND');
			doAuth();
			
		}
		
		
		function doAuth() {
			// console.log(req.body);
			if (req.body && req.body.login && req.body.login.user && req.body.login.pass) {
				websys.pm.usersession.auth(req.body.login.user, req.body.login.pass, function (err, session) {
					if (err) {
						console.log('Normal URL - DB ERROR - AUTH required');
						return console.error(err);
					}
					
					if (session) {
						console.log('Normal URL - AUTH OK');
						console.log('Redir to:' + req.p);
						res.cookie(COOKIE_NAME, session.sessionid, {path: '/'});
						req.session = session;
						res.render('redir', {path: req.path});
						;
					} else {
						console.log('Normal URL - AUTH NOT FOUND');
						res.render('login');
					}
				});
				
			} else {
				res.render('login');
			}
			
		}
		
	}

	try {
		authmw(req, res, next);
	} catch (e) {
		websys.log.err(e);
	}

}


module.exports = WSSession;