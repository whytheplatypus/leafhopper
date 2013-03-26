
var _ = require('underscore');
var fs = require('fs');
var exec = require('child_process').exec,
    child;

var git_push = 'git push ';
var git_add = 'git remote set-url --add leaves '/*<new url>*/;

function run(string){
	child = exec(string, function (error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});
}

function updateGit(url){
	var git_child = exec('git remote -v show leaves', function (error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	      if(error == "Error: Command failed: fatal: 'leaves' does not appear to be a git repository"){
	      	exec('git remote add leaves '+url, function (error, stdout, stderr) {
	      		console.log("adding the leaves remote..");
	      	});
	      }
	    } else {
	    	run(git_add+url);
	    }
	});
}

function addLeaf(url){
	var pack = fs.existsSync('./package.json');
	if(pack){
		var json = JSON.parse(fs.readFileSync('./package.json'));
		url = url+'/'+json.name;
		if(json.leaves === undefined){
			json.leaves = [url];
			//updateGit(url);
		} else {
			if(!_.contains(json.leaves, url)){
				json.leaves.push(url);
				//updateGit(url);
			}
		}
		fs.writeFileSync('./package.json', JSON.stringify(json, null, '\t'));
	} else {
		console.log("need to be in same directory as package.json");
	}
}

function push(branch){
	var pack = fs.existsSync('./package.json');
	if(pack){
		var json = JSON.parse(fs.readFileSync('./package.json'));
		for(var i = 0; i < json.leaves.length; i++){
			//updateGit(json.leaves[i]);
			//call git push for each leaf.. make sure the leaves remote has all the urls
			run(git_push+json.leaves[i]+' '+branch);
		}
	} else {
		console.log("need to be in same directory as package.json");
	}
}

module.exports.add = addLeaf;
module.exports.push = push;