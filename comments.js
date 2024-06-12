// Create web server
// 1. Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

var comments = [];

// 2. Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var urlParts = url.parse(request.url);
    if (urlParts.pathname == '/') {
        fs.readFile('index.html', function(err, data) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        });
    } else if (urlParts.pathname == '/comments') {
        if (request.method == 'POST') {
            var body = '';
            request.on('data', function(data) {
                body += data;
            });
            request.on('end', function() {
                var comment = querystring.parse(body);
                comments.push(comment.comment);
                response.writeHead(200);
                response.end();
            });
        } else if (request.method == 'GET') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(comments));
        }
    } else {
        response.writeHead(404);
        response.end();
    }
});

// 3. Listen on port 8000, IP defaults to