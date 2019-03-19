/*!
* This class stores every information about a particular game session.
* It has no connection with server. At client side, it stores the current state of player
* and AI, and it orchestrates the gameplay including input handling, communicatiion
* with AI and managing gameplay. 
* 
* \class ai_gc
* \param gid The game id, used to distinguish one game session from another.
* \param nop Number of players that will be there when the game starts
* side use or server side use.
*/


/*!
* \fn add_keyboard()
* \memberof ai_gc
* Called on client side.
* Gets EventListener to listen to keydown event.
*/

/*!
* \fn start_start()
* \memberof ai_gc
* 
* Tells player that game is about to start by showing countdown
* and starts game after a fixed time(3 seconds). 
*/

/*!
* \fn client_count_display(self)
* \memberof ai_gc
* Called on client side.
* Display countdown when game is about to begin
*/

/*!
* \fn start_updating(self)
* \memberof ai_gc
* It enables keyboard control and then calls kallar.
*/

/*!
* \fn add_sequence(seq, self)
* \memberof ai_gc
* It simply adds seq to its grid for further processing
* \param seq input sequence, it is an array with following structure:
* [update no, player id, [vertical direction, horizontal direction]]
*/

/*!
* \fn input_data_parser(inp_string)
* \memberof ai_gc
* \param inp_string The input string which has to be parsed into a sequence
* \return a sequence that can be fed into add_sequence.
*/

/*!
* \fn client_handle_input()
* \memberof ai_gc
* handles user input
* \return an object which has two members: pressed and data_string.
* Pressed is a string which tells if the input was valid or not 
* and data_string is the string representation of user input
*/

/*!
* \fn kallar(self)
* \memberof ai_gc
* It is called in the client side. It orchestrates the whole gameplay
* By processing user input, updating grid state and displaying the current board state
*/


ai_gc = function(gid, nop = 2){
	console.log("new gc created");
	// var grid = new grid_require(480, 720);
	// this.nor = 480, this.noc = 720;
	this.nor = 80, this.noc = 200;
	// var grid_require = require('./grid');
	// var grid = new grid_require('nor, noc');
	this.grid = new Grid(this.nor, this.noc);
	this.interval = 100; // time after which kallar is called;
	// this.self = this;
	// this.started = false;
	this.game_ID = gid;
	this.game_over_time = 0;
	this.total_messages=0;
	this.user_pid = 'You';
	this.myid = this.user_pid;
	this.ai_pid = 'Computer';
	this.grid.add_player(this.user_pid);
	this.grid.add_player(this.ai_pid);
	this.client_last_input_string = '';
	// this.ai_engine = require('./ai.js');
	console.log("game_ID set to ", this.game_ID, "\tgid is ", gid);


};

ai_gc.prototype.add_keyboard = function(){
	var seld = this;
	console.log("started is", this.started);
	if(this.started){
		window.onkeydown =  function(){
			var keyNm = event.keyCode || event.which;
			if ([37, 38, 39, 40, 65, 68, 83, 87].indexOf(keyNm) > -1){
				event.preventDefault();
			}
			if (seld.started){
				var pressed = false;
				var temp_seq = "";
			
				if (keyNm == 37 || keyNm == 65){
					//left
					temp_seq = "0#-1";
					pressed = true;
				}
				else if (keyNm == 38 || keyNm == 87){
					//up
					temp_seq = "-1#0";
					pressed = true;
				}
				else if (keyNm == 39 || keyNm == 68){
					//right
					temp_seq = "0#1";
					pressed = true;
				}
				else if (keyNm == 40 || keyNm == 83){
					//down
					temp_seq = "1#0";
					pressed = true;
				}
				console.log("myid = ", seld.myid);
				temp_seq = seld.grid.get_actual_up_no().toString() + "#" + seld.myid.toString() + "#" + temp_seq;
				console.log("my id is:", seld.myid);
				if (pressed){
					seld.client_last_input_string = temp_seq;
				}
			}
		}
	}
}

ai_gc.prototype.start_start = function(level){
	var self=this;
	if(level =='medium'){
		this.interval=50;
	}
	else if (level == 'hard'){
		this.interval=30;
	}
	this.client_count_display(this);
	this.grid.make_ready_for_update();
	setTimeout(function(){self.start_updating(self);}, 3000);
	// self = undefined;
};

ai_gc.prototype.client_count_display = function(self){
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 3);}, 000);
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 2);}, 1000);
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 1);}, 2000);
}

ai_gc.prototype.start_updating = function(self){
	startTime = new Date();
	console.log("start_updating called");	
	console.log("client part being called");
	self.started = true;
	self.add_keyboard();
	self.kallar(self);
	console.log("end of start_updating");
};

ai_gc.prototype.add_sequence = function(seq, self){
		self.grid.add_sequence(seq);
		console.log("adding sequence in client");
};



ai_gc.prototype.input_data_parser = function(inp_string){
	var temp_list = inp_string.split("#");
	var type_casted_temp_list = [parseInt(temp_list[0]), temp_list[1]];
	var temp_dir_list = [parseInt(temp_list[2]), parseInt(temp_list[3])];
	type_casted_temp_list.push(temp_dir_list);
	temp_dir_list = undefined;
	return type_casted_temp_list;
};



ai_gc.prototype.client_handle_input = function(){
	var temp_str = this.client_last_input_string;
	var temp_seq = this.client_last_input_string.split("#");
	var pressed = false;
	if (temp_seq.length > 1){
		this.client_last_input_string = "";
		return {pressed:true, data_string:temp_str};
	}
	else return {pressed:false, data_string:""};
};

ai_gc.prototype.kallar = function(self){
	console.log("#####################################################");
	renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 0);
	var c_inp = self.client_handle_input(); // c_input is of
	if (c_inp.pressed){
		//i.e. input was pressed
		var baby_inp = self.input_data_parser(c_inp.data_string);
		var last_p_dir = self.grid.get_last_move(baby_inp[1]);
		if (Math.abs(last_p_dir[0]) != Math.abs(baby_inp[2][0]) || Math.abs(baby_inp[2][1]) != Math.abs(last_p_dir[1])){
			self.add_sequence(self.input_data_parser(c_inp.data_string), self);
		}
		else{
			//console.log("input was ignored");
		}
	}
	if(self.grid.get_killed_list().length == 0){
		var curr_board = self.grid.get_board();
		var ai_fin_and_cur_pos = self.grid.get_final_pos_and_prev_pos(self.ai_pid);
		var user_fin_and_cur_pos = self.grid.get_final_pos_and_prev_pos(self.user_pid);
		var current_pos = [ai_fin_and_cur_pos.final_pos, user_fin_and_cur_pos.final_pos];
		var last_pos = [ai_fin_and_cur_pos.current_pos, user_fin_and_cur_pos.current_pos];
		var ai_move = AI(curr_board, current_pos, last_pos, self.nor, self.noc);
		console.log("ai's move is ", ai_move);
		if (ai_move != undefined){
			self.grid.add_sequence([
				self.grid.get_actual_up_no(), 
				self.ai_pid, 
				ai_move
			]);
		}
		else{
			console.log("ai played no move");
		}
	}
	//self.grid.update();

	var actual_interval=self.interval;
	var endTime = new Date();
	var time = endTime - startTime;
	get_up_no=Math.floor(time/actual_interval);
	console.log("get_up_no is ", get_up_no);
	gap_interval = time - (get_up_no*actual_interval);
	curr_interval=actual_interval - gap_interval;
	act_up_no = self.grid.get_actual_up_no();
	console.log("act_up_no is ", act_up_no);
	for(i = act_up_no; i <= get_up_no; i++ ){
		self.grid.update();
	}
	if (self.grid.get_alive_players().length <= 1){
		self.game_over_time++;
	}
	else {self.game_over_time=0;}
	if(self.game_over_time>=5){
		self.grid.should_update=false;
		renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), self.grid.get_alive_players()[0].the_id);
		// setInterval(window.location.reload(), 2000);
		setTimeout(function(){window.location.reload(true);}, 3000);
		window.onkeydown = null;

	}
	else {
		setTimeout(function(){self.kallar(self);}, curr_interval);
		console.log("total messages are ",self.total_messages);
		console.log("game id is", self.game_ID);
		self.grid.get_alive_players().forEach(function(p){
			console.log("position of ", p.the_id, " is ", p.finalpos);
			console.log("direction of ", p.the_id, " is ", p.finaldir);
		});
	}

};

ai_gc.prototype.set_gameID = function(newgid){
	console.log("changing game_ID. Old game_ID = ", this.game_ID);
	this.game_ID = newgid;
	console.log("new game_ID = ", this.game_ID);
};
