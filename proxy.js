var http = require('http');

console.log('starting proxy server');

var server = http.createServer(function(request, response) {
	console.log(" > request : %s%s", request.headers.host, request.url);

	// build http options
	var auth = "Basic " + new Buffer("username:password");
			.toString('base64');
	var options = {
		hostname	: "proxy.com",
		port 		: "80",
		method  	: "GET",
		path		: "http://" + request.headers.host + request.url,
		headers: {
			"Proxy-Authorization" : auth,
			Host : request.headers.host
		}
		
	};

	var proxy_request = http.request(options, function(proxy_response) {
		console.log('STATUS: ' + proxy_response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(proxy_response.headers));
		
		var responseHeaders = proxy_response.headers;
		responseHeaders["connection"] = "keep-alive";
		responseHeaders["transfer-encoding"] = "chunked";
		response.writeHead(proxy_response.statusCode, responseHeaders);
		
		
		proxy_response.on('data', function (chunk) {
			//console.log(chunk);
			response.write(chunk, 'binary');
		});
		proxy_response.on('end', function() {
			response.end();
		});
		
		//proxy_response.pipe(response);
	});

	proxy_request.on('error', function(e) {
  		console.log('problem with request: ' + e.message);
	});

	proxy_request.end();	

}).listen(8082);

