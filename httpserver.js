'use strict';

var http = require('http');
var fs = require('fs');
var unicornRoutes = require('./unicorn_routes');

var routes = {};
routes['/unicorns'] = unicornRoutes;

var server = http.createServer(function(req,res) {
	if (typeof(routes[req.url]) === 'function') {
		routes[req.url](req, res);
	} else {
		res.writeHEad(404, {
			'Content-Type': 'application/json'
		});

		res.write(JSON.stringify({msg: 'page not found'}));
		res.end();
	}
});

server.listen(3000, function() {
	console.log('server listening');
});