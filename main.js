const fs = require('fs');
const express = require('express');
const db = require('./lib/db.js');
const html = require('http');
const path = require('path');
const url = require('url');

const app = express();
const publicDriectoryPath = path.join(__dirname);

app.use(express.static(publicDriectoryPath));
app.get('/', function (req, res, next) {
	res.sendFile(publicDriectoryPath + '/template/home.html', function (err) {
		if (err) {
			throw err;
		}
	});
});

app.listen(3000);
