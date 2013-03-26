#!/usr/bin/env node

var argv = require('optimist').argv;
var hopper = require('../hopper');
//console.log(argv._);

switch (argv._[0]){
	case 'add':
		hopper.add(argv._[1]);
	break;
	case 'push':
		hopper.push(argv._[1]);
	break;
}