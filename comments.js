// Create web Server
// Create a web server that can respond to requests for /comments.json
// with a JSON-encoded array of comments taken from the file comments.json.
// Assume comments.json is an array of objects, each with a "name" and a
// "comment" property.

var http = require("http");
var fs = require("fs");
var url = require("url");

var server = http.createServer(function (request, response) {
  var urlObj = url.parse(request.url, true);
  var pathname = urlObj.pathname;
  var query = urlObj.query;

  if (pathname === "/comments.json") {
    fs.readFile("comments.json", function (err, data) {
      if (err) {
        console.error(err);
        response.statusCode = 500;
        response.end("Server error");
        return;
      }

      var comments = JSON.parse(data);
      var commentsToReturn = [];

      if (query.from) {
        comments.forEach(function (comment) {
          if (comment.id >= query.from) {
            commentsToReturn.push(comment);
          }
        });
      } else {
        commentsToReturn = comments;
      }

      var returnObj = {
        comments: commentsToReturn,
      };

      response.end(JSON.stringify(returnObj));
    });
  } else {
    response.statusCode = 404;
    response.end("Not found");
  }
});

server.listen(8080);
console.log("Server listening on port 8080");