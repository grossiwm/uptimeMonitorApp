/*
*
*API's primary file
*
*/

//Dependencies
var http = require("http");
var https = require("https")
var url = require("url");
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

//Instantiate the HTTP server
var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
});

//Starting the  HTTP server, and make it listening on port 3000
httpServer.listen(config.httpPort, function(){
    console.log("The server is listening on port " + config.httpPort + " in " + config.envName + " environment now...");

});

//Instantiate the HTTPS server
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pam'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req,res){
    unifiedServer(req,res);
});

//Starting the  HTTPS server, and make it listening on port 3001
httpsServer.listen(config.httpsPort, function(){
    console.log("The server is listening on port " + config.httpsPort + " in " + config.envName + " environment now...");

});

//Logic for http and https servers
var unifiedServer = function(req, res){
    //Get the URL and parse it
    var parsedUrl = url.parse(req.url,true);
    //Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //Get the query string as an object
    var queryStringObject = parsedUrl.query;

    //Get the http method
    var method = req.method;

    //Get the headers as an object
    var headers = req.headers;

    //Get the payload if it is not null
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function(){
        buffer += decoder.end();

        //Define the handlers
        var handlers = {};

        //Ping handler
        handlers.ping = function (data, callback) {
            callback(200);
        };

        //Not found handler
        handlers.notFound = function(data, callback){
            callback(404);
        };

        //Define the request router
        var router = {
            'ping' : handlers.ping
        };

        //Choose the handler this request schould go, if no request is found use the not found handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        //Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){

            //Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //Use the payload called back by the handler or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            //Convert the payload (object) to a string
            var payloadString = JSON.stringify(payload);

            //Return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            //Log the payload
            console.log('Returning this response:', statusCode, payloadString);

        })


        //Log the request path
        // console.log(method + " request received on path: " 
        // + trimmedPath + " with this query string parameter: "
        // ,queryStringObject, "\n Request received with headers: ",
        // headers);

        //Send response
        res.end('Request sended!\n');

        });
}


