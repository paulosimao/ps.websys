var mongoose = require('mongoose');
var uuid     = require('uuid');
var ObjectId = mongoose.Schema.Types.ObjectId;

function WSPersistence() {

	mongoose.connect(websys.config.mongourl);

//region PLUGIN
	function plugit(schema, options) {
		schema.add({modifiedat: Date});
		schema.add({recowner: String});

		schema.pre('save', function (next) {
			this.modifiedat = new Date();
			next();
		});

		schema.virtual('recid').get(function () {
			return this._id;
		});


		if (options && options.index) {
			schema.path('modifiedat').index(options.index)
		}
	}

//endregion

//region User
	var UserSchema = new mongoose.Schema({
		login   : String,
		password: String,
		name    : String,
		email   : String,
		enabled : {type: Boolean, default: true}

	});

	UserSchema.plugin(plugit);

	var UserModel = mongoose.model('User', UserSchema);
//endregion
//region UserSession
	var UserSessionSchema = new mongoose.Schema({
		login    : String,
		sessionid: String,
		createdat: Date,
		data     : {}
	});

	UserSessionSchema.statics.findBySessionID = function (sessionid, cb) {
		return this.findOne({sessionid: sessionid}, cb);
	};

	UserSessionSchema.statics.findByLogin = function (login, cb) {
		return this.findOne({login: login}, cb);
	};
	UserSessionSchema.statics.auth        = function (user, pass, cb) {

		pm.user.findOne({
				login: user, password: pass, enabled: true
			},
			function (err, user) {
				if (err) {
					return cb(err, null);
				}
				if (user) {
					session           = new UserSessionModel();
					session.login     = user.login;
					session.sessionid = uuid.v4();
					session.createdat = new Date();
					session.save(function (err) {
						if (err) {
							return cb(err);
						} else {
							return cb(null, session);
						}
					})
				} else {
					return cb(null, null);
				}

			}
		)
	};

	UserSessionSchema.plugin(plugit);

	var UserSessionModel = mongoose.model('UserSession', UserSessionSchema);
//endregion


	var pm    = {
		user       : UserModel,
		usersession: UserSessionModel
	}
	pm.add    = function (name, crud) {
		if (pm[[name]]) {
			throw new Error('Crud:' + name + ' already registered');
		} else {
			websys.log.log('Registering CRUD:' + name);
			crud.schema.plugin(plugit);
			pm[name] = crud;
		}
	}
	websys.pm = pm;

}

module.exports = WSPersistence;