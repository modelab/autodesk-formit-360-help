var readline = require('readline');
var exec = require('child_process').exec;
var fs = require('fs');

// Revert all local changes 
// so that we can append the sub-summary files to the root summary file
exec('git reset --hard HEAD');

var rootDir = __dirname + '/../';
var summaryFile = '/SUMMARY.md';
var readmeFile = '/README.md';

var submodulesFile = '.gitmodules';
var submoduleRegex = /\[submodule [\w/\-"._]+\][\s]+path\s=\s([\w\-. /]+)/g;
var pathRegex = /[submodule [\w/\-".]+\][\s]+path\s=\s/g

// Clone up to date repos on all submodules/books
exec('git submodule init && git submodule update');

// Parse paths from .gitmodules file
try {
	var gitmodules = fs.readFileSync(rootDir + submodulesFile, 'utf8');
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
var dashRegex = /\-/g;
var starRegex = /\*/g;

// Parse each submodule's summary file and append to root summary file
for (var i = 0; i < submodules.length; i++) {
	try {
		var submoduleSummaryFile = rootDir + submodules[i] + summaryFile;
		if (fs.statSync(submoduleSummaryFile)) {
			var summary = fs.readFileSync(submoduleSummaryFile);
			summary = summary.replace(titleRegex, function(s) {
				s = s.replace(poundRegex, '- [');
				s = s + '](' + submodules[i] + readmeFile + ')';
				return s;
			});
			summary = summary.replace(blanklineRegex, '');
			summary = summary.replace(dashRegex, '\t-');
			summary = summary.replace(starRegex, '\t*');
			fs.fileAppendSync(rootDir + 'SUMMARY.md', summary);
		}
	} catch(err) {
		console.log(err);
	}
}