var Q = require("q");
var _ = require("lodash");
var express = require("express");
var request = require("request");
var fs = require("fs");
var path = require("path");

var HOST = process.env.GITBOOK_HOST || "https://www.gitbook.com";
var PORT = process.env.PORT || 3000;
var THEMES_DIR = path.resolve(__dirname, "./");

function previewHtml(book, html, assets) {
	var uri = HOST+"/preview/book/"+book;
	return Q.nfcall(request.post, uri, {
		form: {
			html: html,
			assets: assets
		}
	})
	.get(1);
};

var app = express();

app.use('/assets', express.static(__dirname + '/build'));


app.get("/:author/:book/:theme", function(req, res, next) {
	var bookId = [req.params.author, req.params.book].join("/");

	Q.nfcall(fs.readFile, path.resolve(THEMES_DIR, req.params.theme, "index.html"), {encoding: "utf-8"})
	.then(function(html) {
		return previewHtml(bookId, html, "/assets/"+req.params.theme+"/");
	})
	.then(function(output) {
		res.send(output);
	}, next);
});

app.get("/", function(req, res, next) {
	res.redirect("/samypesse/how-to-create-an-operating-system/default")
});


Q.nfcall(app.listen.bind(app), PORT)
.then(function(server) {
	console.log("");
	console.log("Preview Server listening on port", PORT);
	console.log("")
}, function(err) {
	console.log(err.stack || err);
});
