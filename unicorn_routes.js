'use strict';

var fs = require('fs');

module.exports = function(req, res) {
	if (req.method === 'POST') {
		var input = '';

		req.on('data', function(data) {
			input += data.toString('utf-8');
		});

		req.on('end', function() {
			var parsed = JSON.parse(input);
			var postName = req.url;
			var doesFileExist;
			var poster = function (postName) {
					try {
  						doesFileExist = fs.readFileSync('.' + postName +'.json');
  						return 'errorfile.json';
					} catch(e) {
  						return './' + postName +'.json';
					}
			};
			parsed.system_says = "this shit was posted";
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			
			res.write(JSON.stringify(parsed));
			res.end(fs.writeFileSync(poster(postName), JSON.stringify(parsed)));
		});

	}	else if (req.method === 'PUT') {
		var input = '';

		req.on('data', function(data) {
			input += data.toString('utf-8');
		});

		req.on('end', function() {
			var parsed = JSON.parse(input);
			var postName = req.url;
			var doesFileExist;
			var poster = function (postName) {
					try {
  						doesFileExist = fs.readFileSync('.' + postName +'.json');
  						return './' + postName +'.json';
					} catch(e) {
  						return 'errorfile.json';
					}
			};
			if (poster(postName) ===  'errorfile.json') {
			parsed.system_says = "no such file exists.  data stored in errorfile.";
			} else {
			parsed.system_says = "this shit was put";
			}
			
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			
			res.write(JSON.stringify(parsed));
			res.end(fs.writeFileSync(poster(postName), JSON.stringify(parsed)));
		});

	} else if (req.method === 'GET') {
		var input = '';

		req.on('data', function(data) {
			input += data.toString('utf-8');
		});

		req.on('end', function() {
			var postName = req.url;
			var doesFileExist;
			var getter = function(postName) {
				try {
  					doesFileExist = fs.readFileSync('.' + postName +'.json');
  					return './' + postName +'.json';
				} catch(e) {
					doesFileExist = {system_says: "no such file"};
  					return 'no such file';
				}

			};
			getter(postName);
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			var stringed = doesFileExist.toString('utf-8');
			res.write(stringed);
			res.end();
		});
	} else if (req.method === 'DELETE') {
		var input = '';

		req.on('data', function(data) {
			input += data.toString('utf-8');
		});

		req.on('end', function() {
			var postName = req.url;
			var deleteFile = function(postName) {
				try {
  					fs.unlinkSync('.' + postName +'.json');
  					return 'Your file deleted, master';
				} catch(e) {
  					return 'No such file, bitch';
				}

			};
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.write(JSON.stringify({system_says: deleteFile(postName)}));
			res.end();
		});
	} else if (req.method === 'PATCH') {
		var input = '';

		req.on('data', function(data) {
			input += data.toString('utf-8');
		});

		req.on('end', function() {
			var parsed = JSON.parse(input);
			var postName = req.url;
			var doesFileExist;
			var stringed = "";
			var poster = function (postName) {
					try {
  						doesFileExist = fs.readFileSync('.' + postName +'.json');
  						stringed = doesFileExist.toString('utf-8');
  						return './' + postName +'.json';
					} catch(e) {
						doesFileExist = {system_says: "no such file"};
  						return 'errorfile.json';
					}
			};
			if (poster(postName) ===  'errorfile.json') {
			parsed.system_says = "no such file exists.  nothing to patch.";
			} else {
			parsed.system_says = "this shit was patched";
			}

			var fileArray = stringed.split('"');
			var inputArray = JSON.stringify(parsed).split('"');
			var keyMatches = [];
			console.log("Old: ");
			console.log(fileArray);
			console.log("New: ");
			console.log(inputArray);

			for (var i = 1; i < fileArray.length; i += 4) {
				for (var k = 1; k <inputArray.length; k += 4) {

					if (fileArray[i] === inputArray[k]) {
						fileArray[i+2] = inputArray[k+2];
						console.log(fileArray[i] + ": this key has a match.  patch completed");
						keyMatches.push(fileArray[i]);
					} else {
						console.log(fileArray[i] + ": this key doesn't match");
					}
				}
			}

			var finalObject = "{";

			for (var j = 1; j < fileArray.length; j += 4) {
				finalObject += ('"'+fileArray[j]+'":"'+fileArray[j+2] + '"');
				if (fileArray[j] !== "system_says") {
					finalObject += ',';
				}
			};

			finalObject += "}";

			console.log("Transformed: " + finalObject);
			
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.write(JSON.stringify({keys_patched: keyMatches.toString()}));
			res.end(fs.writeFileSync(poster(postName), finalObject));
		});
	} 
};