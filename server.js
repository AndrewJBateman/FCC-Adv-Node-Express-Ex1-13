'use strict';
const dotenv = require('dotenv').config();
const routes = require('./Routes.js'); //challenge 13: Clean Up Your Project with Modules
const auth = require('./Auth.js'); //challenge 13: Clean Up Your Project with Modules
const express = require('express');
const bodyParser = require('body-parser');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const mongo = require('mongodb').MongoClient; //challenge 5: Implement the Serialization of a Passport User
const passport = require('passport'); //challenge 3: Set up Passport
const session = require('express-session'); //challenge 3: Set up Passport
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt'); //challenge 12: Hashing Your Passwords

const app = express();
app.set('view engine', 'pug'); //challenge 1, Set up a Template Engine
fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas Database Access Credentials
const dbUserName = process.env.USER_NAME;
const dbUserPass = process.env.USER_PASSWORD;
const dbName = process.env.DB_NAME;
const dbCluster = process.env.DB_CLUSTER;
const dbUrl = `mongodb+srv://${dbUserName}:${dbUserPass}@${dbCluster}/${dbName}?retryWrites=true&w=majority`;

//challenge 5: Implement the Serialization of a Passport User
// mongo.connect(process.env.DATABASE, { useNewUrlParser: true }, (err, db) => {
//   if (err) console.log('Database error: ' + err);
//   else {
//     console.log('Successful database connection');
mongo.connect(
	dbUrl,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, db) => {
		if (err) {
			console.log('Database error: ' + err);
		} else {
			console.log(
				'Successful connection to Mongoose Atlas database named: ',
				dbName
			);
			auth(app, db); //challenge 13: Clean Up Your Project with Modules
			routes(app, db); //challenge 13: Clean Up Your Project with Modules
			app.listen(process.env.PORT || 3000, () => {
				console.log('Listening on port ' + process.env.PORT);
			});
		}
	}
);
