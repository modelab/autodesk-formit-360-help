var readline = require('readline');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');

const ENCODING = 'utf8';

// Revert all local changes 
// so that we can append the sub-summary files to the root summary file

// var rootDir = __dirname + '/../';
// For precommit hook
var rootDir = __dirname + '/../../';
var summaryFile = '/SUMMARY.md';
var readmeFile = '/README.md';

var summary_template = 'SUMMARY_TEMPLATE.md';

var template = fs.readFileSync(rootDir + summary_template, ENCODING)
fs.writeFileSync(rootDir + 'SUMMARY.md', template);

var booksDir = 'books/';

var books = fs.readdirSync(rootDir + booksDir).filter(function(file) {
	return fs.statSync(path.join(rootDir + booksDir, file)).isDirectory();
});

var titleRegex = /#\ [\w\ ]+/g;
var poundRegex = /#\ /g;
var blanklineRegex = /\s*[\r\n]/g
var dashRegex = /\-\ /g;
var starRegex = /\*\ /g;
var linkRegex = /\]\(/g;

// Parse each submodule's summary file and append to root summary file
for (var i = 0; i < books.length; i++) {
	try {
		var bookSummaryFile = rootDir + booksDir + books[i] + summaryFile;
		if (fs.statSync(bookSummaryFile)) {
			var summary = fs.readFileSync(bookSummaryFile, ENCODING);
			summary = summary.replace(titleRegex, function(s) {
				s = s.replace(poundRegex, '- [');
				s = s + '](' + booksDir + books[i] + readmeFile + ')';
				return s;
			});
			summary = summary.replace(blanklineRegex, '')
							 .replace(dashRegex, '\t- ')
							 .replace(starRegex, '\t* ')
							 .replace(linkRegex, '](' + booksDir + books[i] + '/');
			fs.appendFileSync(rootDir + 'SUMMARY.md', summary);
		}
	} catch(err) {
		console.log(err);
	}
}