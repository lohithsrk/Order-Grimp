if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/user.model');

const app = express();

mongoose
	.connect('mongodb://localhost:27017/order-grimp')
	.then(() => {
		console.log('DATABASE CONNECTED');
	})
	.catch((err) => {
		console.log(err);
	});

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

fs.readdirSync('./routes').map((route) =>
	app.use('/api', require(`./routes/${route}`))
);

app.listen(process.env.PORT, () =>
	console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`)
);
