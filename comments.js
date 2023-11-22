// Create web server application using Node.js
// Run this using the command: node comments.js
// and go to http://localhost:8081/comments.html

var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

var comments = [];

function handle_incoming_request(req, res) {
    console.log("Incoming request: (" + req.method + ")" + req.url);
    load_comments();
    if (req.method.toLowerCase() == 'post') {
        process_post(req, res);
    } else {
        process_get(req, res);
    }
}

function load_comments() {
    fs.readFile('comments.json', function(err, data) {
        if (err) {
            console.log("Error loading comments: " + err);
            return;
        }
        comments = JSON.parse(data);
    });
}

function save_comments() {
    fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
        if (err) {
            console.log("Error saving comments: " + err);
            return;
        }
    });
}

function process_get(req, res) {
    var query = url.parse(req.url, true).query;
    var pathname = url.parse(req.url, true).pathname;
    if (pathname == '/comments.json') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(comments));
    } else if (pathname == '/comments.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        var comments_html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Comments</title></head><body><ul>';
        for (var i = 0; i < comments.length; i++) {
            comments_html += '<li>' + comments[i] + '</li>';
        }
        comments_html += '</ul><form action="/comments.html" method="post"><textarea name="comment" id="comment" cols="30" rows="10"></textarea><input type="submit" value="Submit"></form></body></html>';
        res.end(comments_html);
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('404 Not Found');
    }
}

function process_post(req, res) {
    var body = '';