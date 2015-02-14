'use strict'

var chai = require('chai');
var chaihttp = require('chai-http');
require('../httpserver');

chai.use(chaihttp);

var expect = chai.expect;

describe('simple post request', function () {
	it('responds to a post request', function(done) {
		chai.request('localhost:3000')
			.post('/unicorns')
			.send({hello: "world"})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.msg).to.eql('this was added on the server');
				done();
			})
	});
});