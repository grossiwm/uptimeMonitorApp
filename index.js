/*
*
*API's primary file
*
*/

//Dependencies
var http = require("http");
var url = require("url");

//The server responds all the requests with a string
var server = http.createServer(function(req, res){
    //Get the URL and parse it
    var parsedUrl = url.parse(req.url,true);
    //Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    //Send response
    res.end('Request sended!\n');
    //Log the request path
    console.log("\nRequest received forth path: " + trimmedPath);

});

//Starting the server, and make it listening on port 3000
server.listen(3000, function(){
    console.log("The server is listening on 3000...");

})