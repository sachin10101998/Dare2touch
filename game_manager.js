var
	game_manager = module.exports = { games : {}, game_count:0},
	UUID = require('node-uuid'),
	debug = true;

global.window = global.document = global;

require('game_session_c.js');

game_manager.log() = function(){
	if (debug) console.log.apply(this, arguments);
}

game_manager.messages = [];

game_manager.onMessage = function(client, message){
	if (this.fake_latency && message.split('.')[0].substr(0, 1) == 'i'){
		game_manager.messages.push({client:client, })
	}
}