var http = require('http');

console.log('starting proxy server');

var server = http.createServer(function(request, response) {
	console.log(" > request : %s", request.url);

	// build http options
	var options = {
		host 	: "www.lockett.ca",
		port 	: "80",
		method  : "GET"
	};

	var proxy_request = http.request(options, function(proxy_response) {
		console.log('STATUS: ' + proxy_response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(proxy_response.headers));
		proxy_response.setEncoding('utf8');
		proxy_response.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
			response.write(chunk, 'binary');
		});


	});

	proxy_request.on('error', function(e) {
  		console.log('problem with request: ' + e.message);
	});

	proxy_request.end();

}).listen(8082);



