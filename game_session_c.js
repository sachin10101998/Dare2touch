var Grid = require('./grid')

function plyr(pid){
	myid = pid;
	this.playerseq = []
	this.timearr = []
	this.addinp(inp, timestmp) = function (inp, timestmp){
		playerseq.push(inp);
		timearr.push(timestmp);
	}
	this.rem_last_pair() = function(){
		if (playerseq.length > 0){
			playerseq.pop();
			timearr.pop();
		}
	}
	this.clear_input_seq() = function(){
		playerseq = []
		timearr = []
	}
}

function game_session(gameidarg) {
	// var obj = {};
	this.grid_ro_siz = 80
	this.game_id = gameidarg;
	this.players = [];
	this.obj_live_players = [];
	//maintain the invariant that index of elem in players
	//and obj_live_players in same at all times;
	this.dead_players = [];
	//Invariant: no elem lies in both players and dead_players
	this.j_requests = [];
	this.num_of_players = 0;
	//this array will contain inpp objects:
	//which will have sequence_no, player_no, input_key
	this.unprocessed_input_sequence = [];
	this.grid = new Grid(grid_ro_siz);
	this.should_update = false;
	this.update_freq = 24;
	this.setInterval_ki_id = undefined;
	this.last_processed_update = 0;
	this.update_gap_lim = 5;
	this.player_seq = [];
	this.start_game() = function(){
		// assumes that game_id is valid, and players are filled, NumOfPlayers is \
		// correctly set and update_freq is set.
		var temp_players = [];
		for(var i = 0; i < num_of_players; i++){
			temp_players.push(i);
		}
		grid.iniPlayer(temp_players); //resetting grid
		should_update = true;
		last_processed_seq_no = 0;
		setInterval_ki_id = setInterval(updator, update_freq);
	}
	this.stop_game() = function(){
		should_update = false;
	}
	this.kill_player(player_id) = function(player_id){
		ind = players.indexOf(player_id);
		if (ind > -1){ // i.e. if player_id is in players[]
			grid.kill_player_with_indx(ind);
			num_of_players--;
			players.splice(ind, 1);
			obj_live_players.splice(ind, 1);
			//Warning! I am assuming that scoring has been taken care of
		}
	}
	this.add_player(player_id) = function(player_id){
		test_ind = players.indexOf(player_id);
		test_dead_ind = dead_players.indexOf(player_id);
		if (test_dead_ind > -1){
			dead_players.splice(test_dead_ind, 1);
		}
		if (test_ind == -1){
			players.push(player_id);
			var tempobj = new plyr(player_id);
			obj_live_players.push(tempobj);
			num_of_players++;
		}
	}
	this.add_input_sequence(seq) = function(player_id, seq){
		ind = players.indexOf(player_id);
		obj_live_players[ind].addinp(inps, timestmp);
		//TODO: Checking should be taken care of
		//Don't assume this fn'works without doing this
		//This fn will return smthng
		if (seq[0] < last_processed_update){ // i.e it's an old request
			if ((seq[0] + update_gap_lim) < last_processed_update){
				
				// if it has been killed or has been involved in killing then simply inform it 
				// that its request is rejected and make no other changes here(i.e, ditch this input)
				// else :
					// correct that response to current time;
					// set the response as rejected and instruct it to move it to
					// a the current time
					// broadcast the message to every player then
					// make corrections to own grid and then change player sequences.


			}
			else{
				// acknowledge, broadcast it to every other player
				// change sequences (player sequence) and 
				// wake up the dead (not older than age of this req)
				// recalculate the new positions;
			}
		}
		else {
			// simply broadcast to every other player, send acknowledgement
			// add this to unprocessed_input_sequence and player's sequence
		}
	}
	this.reset_grid() = function(){
		var temp_players = [];
		for(var i = 0; i < num_of_players; i++){
			temp_players.push(i);
		}
		grid.iniPlayer(temp_players);
	}

}