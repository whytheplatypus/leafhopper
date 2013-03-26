var http = require('http');
var cicada = require('cicada');
var portfinder = require('portfinder');
var logger = console
try{
	logger = require('winston-remote')();
} catch(e){
	logger.info('using console logging');
}

module.exports = function(basePort){
	portfinder.basePort = basePort;
	var running = {};

	var ci = cicada({
		repodir: function(repo){
	        return process.cwd()+'/'+repo+'/repo';
	    },
	    workdir: function(commit){
	        return process.cwd()+'/'+commit.repo+'/work';
	    }
	});
	//should run this with forever?
	ci.on('commit', function (commit) {
		if(running.hasOwnProperty(commit.repo)){
			running[commit.repo].exit(0);
			delete running[commit.repo];
		}
		commit.spawn('npm install').on('exit', function (code) {
	        var status = code === 0 ? 'PASSED' : 'FAILED';
	        logger.info(commit.hash + ' ' + status);
	        if(status == 'PASSED'){
	        	running[commit.repo] = commit.run('start');
				logger.info("starting " + commit.repo);
			}
	    });
	});

	var server = http.createServer(ci.handle);

	portfinder.getPort(function (err, port) {
		server.listen(port);
		logger.info("Server listening on port "+port);
	});
}