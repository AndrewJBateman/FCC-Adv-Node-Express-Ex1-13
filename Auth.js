//challenge 13: Clean Up Your Project with Modules
//separate authorization file referenced in server.js using 'auth( app, db )'
const session = require('express-session'); //challenge 3: Set up Passport
const passport = require('passport'); //challenge 3: Set up Passport
const localStrategy = require('passport-local'); //challenge 6: Authentication Strategies
const objectID = require('mongodb').ObjectID; //challenge 4: Serialization of a User Object
const bcrypt = require('bcrypt'); //challenge 12: Hashing Your Passwords

module.exports = function (app, db) {
	app.use(
		session({
			//challenge 3: Set up Passport
			secret: process.env.SESSION_SECRET,
			resave: true,
			saveUninitialized: true,
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	// challenge 4: Serialization of a User Object
	passport.serializeUser((user, done) => done(null, user._id));

	passport.deserializeUser((id, done) => {
		db.collection('users').findOne({ _id: new objectID(id) }, (err, doc) =>
			done(null, doc)
		);
	});

	// challenge 6: Authentication Strategies & challenge 12: Hashing Your Passwords
	passport.use(
		new localStrategy((username, password, done) => {
			db.collection('users').findOne({ username: username }, (err, user) => {
				if (err) done(err);
				if (!user) done(null, false);
				if (!bcrypt.compare(password, user.password)) return done(null, false);
				return done(null, user);
			});
		})
	);
};
