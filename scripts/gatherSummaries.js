var readline = require('readline');
var exec = require('child_process').execSync;
var fs = require('fs');

const ENCODING = 'utf8';

// Revert all local changes 
// so that we can append the sub-summary files to the root summary file

var rootDir = __dirname + '/../';
var summaryFile = '/SUMMARY.md';
var readmeFile = '/README.md';

var booksDir = 'books/';

var books = fs.readdirSync(rootDir + booksDir).filter(function(file) {
	return fs.statSync(path.join(rootDir + booksDir, file)).isDirectory();
});

console.log(books);

var titleRegex = /#\ [\w\ ]+/g;
var poundRegex = /#\ /g;
var blanklineRegex = /^\s*[\r\n]/gm
var dashRegex = /\-\ /g;
var starRegex = /\*\ /g;

// // Parse each submodule's summary file and append to root summary file
// for (var i = 0; i < paths.length; i++) {
// 	try {
// 		var submoduleSummaryFile = rootDir + paths[i] + summaryFile;
// 		if (fs.statSync(submoduleSummaryFile)) {
// 			var summary = fs.readFileSync(submoduleSummaryFile, ENCODING);
// 			summary = summary.replace(titleRegex, function(s) {
// 				s = s.replace(poundRegex, '- [');
// 				s = s + '](' + paths[i] + readmeFile + ')';
// 				console.log(s);
// 				return s;
// 			});
// 			summary = summary.replace(blanklineRegex, '');
// 			summary = summary.replace(dashRegex, '\t- ');
// 			summary = summary.replace(starRegex, '\t* ');
// 			fs.appendFileSync(rootDir + 'SUMMARY.md', summary);
// 		}
// 	} catch(err) {
// 		console.log(err);
// 	}
// }