var readline = require('readline');
var exec = require('child_process').exec;
var fs = require('fs');

const ENCODING = 'utf8';

// Revert all local changes 
// so that we can append the sub-summary files to the root summary file

console.log('git reset');
exec('git reset --hard HEAD');

var rootDir = __dirname + '/../';
var summaryFile = '/SUMMARY.md';
var readmeFile = '/README.md';

var submodulesFile = '.gitmodules';
var submoduleRegex = /\[submodule [\w/\-"._]+\][\s]+path\s=\s([\w\-. /]+)/g;
var pathRegex = /[submodule [\w/\-".]+\][\s]+path\s=\s/g

console.log('init submodules');
// Clone up to date repos on all submodules/books
exec('git submodule init && git submodule update');

console.log(fs.readdirSync(rootDir));

// Parse paths from .gitmodules file
try {
	var gitmodules = fs.readFileSync(rootDir + submodulesFile, ENCODING);
	var submodules = gitmodules.match(submoduleRegex);
	var paths = [];
	for (var i = 0; i < submodules.length; i++) {
		paths.push(submodules[i].replace(pathRegex, ''));
	}
} catch(err) {
	console.log(err);
}

var titleRegex = /#\ [\w\ ]+/g;
var poundRegex = /#\ /g;
var blanklineRegex = /^\s*[\r\n]/gm
var dashRegex = /\-\ /g;
var starRegex = /\*\ /g;

// Parse each submodule's summary file and append to root summary file
for (var i = 0; i < paths.length; i++) {
	try {
		var submoduleSummaryFile = rootDir + paths[i] + summaryFile;
		if (fs.statSync(submoduleSummaryFile)) {
			var summary = fs.readFileSync(submoduleSummaryFile, ENCODING);
			console.log(summary);
			summary = summary.replace(titleRegex, function(s) {
				s = s.replace(poundRegex, '- [');
				s = s + '](' + paths[i] + readmeFile + ')';
				console.log(s);
				return s;
			});
			summary = summary.replace(blanklineRegex, '');
			summary = summary.replace(dashRegex, '\t- ');
			summary = summary.replace(starRegex, '\t* ');
			fs.appendFileSync(rootDir + 'SUMMARY.md', summary);
		}
	} catch(err) {
		console.log(err);
	}
}