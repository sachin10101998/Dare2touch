/*!
* This class stores every information about a particular game session.
* This is user both at client side and at server side.
* At client side, it stores the current state of every player and 
* orchestrates the gameplay including input handling, communicatiion
* with server and managing gameplay. 
* 
* At the server side, it stores bare minimum information about clients,
* this is done to reduce server load as most of the heavy computation 
* is done at the client side.
* \class gc
* \param gid The game id, used to distinguish one game session from another.
* \param nop Number of players that will be there when the game starts
* \param isServer States whether this object is being created for client 
* side use or server side use.
*/


/*!
* \fn get_marks_list()
* \memberof gc
* \return list of marks
*/

/*!
* \fn get_NoOfPlayers()
* \memberof gc
* \return length of players on server
*/

/*!
* \fn get_max_nop()
* \memberof gc
* \return maximum possible players
*/

/*!
* \fn get_nor()
* \memberof gc
* \return number of rows
*/

/*!
* \fn get_noc()
* \memberof gc
* \return number of columns
*/


/*!
* \fn get_gameID()
* \memberof gc
* \return game id
*/


/*!
* \fn get_current_nop()
* \memberof gc
* \return current number of players
*/

/*!
* \fn get_server_player_obj_list()
* \memberof gc
* \return list of players connected to server
*/


/*!
* \fn add_keyboard()
* \memberof gc
* Called on client side.
* Gets EventListener to listen to keydown event.
*/

/*!
* \fn server_add_player(player)
* \memberof gc
* \param player player id to be added to this game session
* Called on server side.
* 
* Adds player to the server_player_obj_list and sends this information to
* all the remaining players that have already joined the game
*/

/*!
* \fn client_add_player(pid)
* \memberof gc
* \param pid player id to be added
* Called on client side.
*
* Adds player of player id pid to grid
*/

/*!
* \fn start_start()
* \memberof gc
* Called on server side.
* 
* Tells clients that game is about to start
* and starts game after a fixed time(3 seconds). 
*/

/*!
* \fn client_count_display(self)
* \memberof gc
* Called on client side.
* Display countdown when game is about to begin
*/

/*!
* \fn start_updating(self)
* \memberof gc
* When called in server side, it tells all the clients
* to start the game and when called in client side, it
* enables keyboard control and then calls kallar.
*/

/*!
* \fn add_sequence(seq, self)
* \memberof gc
* When called in server side, it informs every player
* that a particular player has played a move seq
*
* When called in client side, it simply adds seq to its
* grid for further processing
* \param seq input sequence, it is an array with following structure:
* [update no, player id, [vertical direction, horizontal direction]]
*/

/*!
* \fn input_data_parser(inp_string)
* \memberof gc
* \param inp_string The input string which has to be parsed into a sequence
* \return a sequence that can be fed into add_sequence.
*/

/*!
* \fn client_handle_input()
* \memberof gc
* handles user input
* \return an object which has two members: pressed and data_string.
* Pressed is a string which tells if the input was valid or not 
* and data_string is the string representation of user input
*/

/*!
* \fn server_input_handle(data, player)
* \memberof gc
* \param string representation of client's move
* handles user input given by client.
*/

/*!
* \fn kallar(self)
* \memberof gc
* It is called in the client side. It orchestrates the whole gameplay
* By processing user input, updating grid state and displaying the current board state
*/

/*!
* \fn mover(seq, self)
* \memberof gc
* \param seq input sequence
* 
* checks if the move is played by other player, if yes, then it adds 
* seq to grid.
*/

/*!
* \fn client_kill_player(self, pida)
* \memberof gc
* \param pida The player id to be removed
* Kills the player with player id pida
*/

/*!
* \fn client_onconnected(self, data)
* \memberof gc
* \param self reference to this gc object
* \param data object containing playedID, noOfPlayers and gameID
* sets myid, max_nop of self, sets gameID and adds 
* the client to the game
*/

/*!
* \fn server_remove_player(pida)
* \memberof gc

* \param pida
*
* Called on the server side. 
* It asks all the clients in the current game area to kill player
* with player id pida. 
*/

/*!
* \fn config_connection()
* \memberof gc
* Called in client side. It configures the connection with the server.
*/


gc = function(gid, nop = 2, isServer = false){
	console.log("new gc created");
	// var grid = new grid_require(480, 720);
	// this.nor = 480, this.noc = 720;
	this.nor = 120, this.noc = 250;
	// var grid_require = require('./grid');
	// var grid = new grid_require('nor, noc');
	this.grid = undefined;
	if (isServer){
		// var grid_require = require('./grid');
		// this.grid = new grid_require(this.nor, this.noc);
		// console.log("grid created.");
		// console.log(grid);
		this.server_player_obj_list = [];
	}

	else{
		this.grid = new Grid(this.nor, this.noc);
	}
	this.isServer = isServer;
	this.full = false;
	this.current_nop = 0;
	this.max_nop = nop;

	this.update_switch = undefined;
	this.interval = 80; // time after which kallar is called;
	// this.self = this;
	this.started = false;
	this.game_ID = gid;
	this.game_over_time = 0;
	this.total_messages=0;
	this.count = 0;
	console.log("game_ID set to ", this.game_ID, "\tgid is ", gid);

//	initial_procedure:



	if (!this.isServer){
		this.myid;
		this.client_last_input_string = '';
		this.config_connection();
	}
	else{
		this.marks = [];
	}
};

gc.prototype.get_marks_list = function(){
	return this.marks;
}

gc.prototype.get_NoOfPlayers = function(){
	return this.server_player_obj_list.length;
}

gc.prototype.get_max_nop = function(){
	return this.max_nop;
};

gc.prototype.unset_self = function(){
	// this.self = undefined;
};

gc.prototype.add_keyboard = function(){
	if (!this.isServer){
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
}

gc.prototype.get_isServer = function(){
	return this.isServer;
};

gc.prototype.get_grid = function(){
	return this.grid;
};

gc.prototype.get_nor = function(){
	return this.nor;
};

gc.prototype.get_noc = function(){
	return this.noc;
};

gc.prototype.get_gameID = function(){
	return this.game_ID;
};

gc.prototype.set_gameID = function(newgid){
	console.log("changing game_ID. Old game_ID = ", this.game_ID);
	this.game_ID = newgid;
	console.log("new game_ID = ", this.game_ID);
};

gc.prototype.get_full = function(){
	return this.full;
};

gc.prototype.get_current_nop = function(){
	return this.current_nop;
};

gc.prototype.get_server_player_obj_list = function(){
	return this.server_player_obj_list;
};

gc.prototype.get_update_switch = function(){
	return this.update_switch;
};

gc.prototype.get_started = function(){
	return this.started;
};

gc.prototype.server_add_player = function(player){
	console.log("server_add_player called");	
	// here player is the socket obj and it contains pid
	player.emit('print_player', player.pid);
	this.server_player_obj_list.forEach(function(p){
		p.emit('s_add_player', player.pid);
		p.emit('print_player', player.pid);

	});
	this.server_player_obj_list.forEach(function(p){
		player.emit('s_add_player', p.pid);
		player.emit('print_player', p.pid);
	});
	//this.grid.add_player(player.pid);
	this.server_player_obj_list.push(player);
	//console.log("player list is", this.server_player_obj_list);
	// this.server_player_obj_list.forEach(function(p){
	// 	console.log("players are", self.grid.get_ini_list_pid_and_pnts());
	// 	console.log("players_connecting called");
	// 	p.emit('players_connecting', self.grid.get_ini_list_pid_and_pnts());
	// });

	this.current_nop++;
	if (this.current_nop == this.max_nop){
		this.full = true;
	}
	console.log("current_nop:" , this.current_nop, "\tmax_nop:", this.max_nop, "\tfull=", this.full);
};

gc.prototype.client_add_player = function(pid){
	this.grid.add_player(pid);
};

gc.prototype.start_start = function(){
	this.server_player_obj_list.forEach(function(p){
		p.emit('display_canvas');
		p.emit('starting_game');
	});
	//console.log("this is:", this);
	var self=this;
	setTimeout(function(){self.start_updating(self);}, 3000);
	// self = undefined;
};



gc.prototype.client_count_display = function(self){
	self.grid.make_ready_for_update();
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 3);}, 000);
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 2);}, 1000);
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 1);}, 2000);
}
// }



gc.prototype.start_updating = function(self){
	startTime = new Date();
	console.log("start_updating called");
	//var self = self;
	//console.log("this of su: ", this);
	//console.log("self is:", self);
	// console.log("interval: ", this.interval);
	if (self.isServer){
		console.log("server part being called");
		console.log(self.get_isServer());
		//self.grid.make_ready_for_update();
		self.server_player_obj_list.forEach(function(p){
			p.emit('game_start');
			// self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		});
		
		//var self = this;
		// this.update_switch = setInterval(this.kallar, this.interval);
		//self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		self.started = true;
		//self.add_keyboard();
	}
	else{
		console.log("client part being called");
		console.log(self.get_isServer());
		//var self=this;
		//self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		self.started = true;
		console.log("socket = ", self.socket);
		console.log("myid = ", self.myid);
		self.add_keyboard();
		self.kallar(self);
	}
	console.log("end of start_updating");
};

gc.prototype.add_sequence = function(seq, self){
	if (self.isServer){
		console.log("adding sequence in server");
		self.server_player_obj_list.forEach(function(p){
			p.emit('move', seq);
		});
		//self.grid.add_sequence(seq);
		//end1= new Date();
		//timediff=end1- start1;
		//console.log("time diff is", timediff);
	}
	else {
		self.grid.add_sequence(seq);
		console.log("adding sequence in client");
	}
};

gc.prototype.input_data_parser = function(inp_string){
	var temp_list = inp_string.split("#");
	var type_casted_temp_list = [parseInt(temp_list[0]), temp_list[1]];
	var temp_dir_list = [parseInt(temp_list[2]), parseInt(temp_list[3])];
	type_casted_temp_list.push(temp_dir_list);
	temp_dir_list = undefined;
	return type_casted_temp_list;
};

gc.prototype.client_handle_input = function(){
	var temp_str = this.client_last_input_string;
	var temp_seq = this.client_last_input_string.split("#");
	var pressed = false;
	if (temp_seq.length > 1){
		this.client_last_input_string = "";
		return {pressed:true, data_string:temp_str};
	}
	else return {pressed:false, data_string:""};
};

gc.prototype.server_input_handle = function(data){
	console.log("input_handle, player: ");
	// console.log(player);
	var temp_list = this.input_data_parser(data);
	this.add_sequence(temp_list, this);
	//var request_u_n = temp_list[0];
	//var current_un = this.grid.get_actual_up_no();
	//var lo_lim = (current_un - this.cutoff)>=0 ? (current_un - this.cutoff) : 0;
	//var up_lim = (current_un + this.cutoff);
	//if ((request_u_n >= lo_lim) && (request_u_n <= up_lim)){
		//player.emit('accepted_inp_seq', request_u_n);
	//}
	//else{
	//	player.emit('rejected', request_u_n);
	//}
	
}

gc.prototype.kallar = function(self){
	console.log("#####################################################");
	renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 0);
	var c_inp = self.client_handle_input();
	if (c_inp.pressed){
		var baby_inp = self.input_data_parser(c_inp.data_string);
		var last_p_dir = self.grid.get_last_move(baby_inp[1]);
		if (Math.abs(last_p_dir[0]) != Math.abs(baby_inp[2][0]) || Math.abs(baby_inp[2][1]) != Math.abs(last_p_dir[1])){
			self.socket.send(c_inp.data_string);
			self.add_sequence(self.input_data_parser(c_inp.data_string), self);
		}
		else{
			//console.log("input was ignored");
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
		self.count++;
		if (self.count > 5){
			self.socket.emit('update_points', self.grid.get_points_of_player(self.myid));
			self.count = 0;
		}
	}
	//end_time=new Date();
	//time_Diff= end_time- start_time;
	//console.log("time taken is ", time_Diff);
	if (self.grid.get_alive_players().length <= 1){
		self.game_over_time++;
	}
	else {self.game_over_time=0;}
	if(self.game_over_time>=5){
		self.grid.should_update=false;
		if(self.grid.get_alive_players().length == 1){
			renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), self.grid.get_alive_players()[0].the_id);
		}
		else renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 'Nobody');
		setTimeout(function(){self.socket.emit('game_over');}, 3000);
		window.onkeydown = null;
		// self.grid = null;
	}
	else {setTimeout(function(){self.kallar(self);}, curr_interval);
	console.log("total messages are ",self.total_messages);
	console.log("game id is", self.game_ID);
	self.grid.get_alive_players().forEach(function(p){
			console.log("position of ", p.the_id, " is ", p.finalpos);
			console.log("direction of ", p.the_id, " is ", p.finaldir);
		});}

};

gc.prototype.mover =function(seq, self){
	self.total_messages++;
	if(seq[1]!= self.myid){
		self.grid.add_sequence(seq, self);
		//self.socket.emit('endtime');
		}
}

gc.prototype.client_kill_player = function(self, pida){
	self.grid.remove_player(pida);
};

gc.prototype.get_socket = function(){
	//console.log("socket inside get_socket in gc:");
	//console.log(this.socket);
	return this.socket;
};

gc.prototype.client_onconnected  = function(self, data){
	var myid = data.playerID;
	console.log("data in client_onconnected is ", data)
	self.max_nop = data.noOfPlayers;
	self.myid = myid;
	self.client_add_player(myid);
	self.set_gameID(data.gameID);
}

gc.prototype.server_remove_player = function(pida){
	len = this.server_player_obj_list.length;
	console.log('length is ', len);
	// console.log('server_player_obj_list is ', this.server_player_obj_list);
	for(var i=0; i<len; i++){
		if(pida == this.server_player_obj_list[i].pid){
			this.server_player_obj_list.splice(i, 1);
			break;
		}
	}
	this.server_player_obj_list.forEach(function(p){
		p.emit('killit', pida);
		p.emit('player_disconnected', pida);
	});
};

gc.prototype.config_connection = function(){
	var self=this;
	this.socket = io.connect();
	//console.log("socket inside gc:");
	//console.log(this.socket);
	this.socket.on('connection', function(){
		console.log("user is being connected");
	})
	this.socket.on('disconnect', function(){ 
		self.socket.emit('remove', self.myid);
		//self.client_ondisconnect(self);
	});

	this.socket.on('s_add_player', function(pid){
		self.grid.add_player(pid);
	}); //
	this.socket.on('game_start', function(){
		self.start_updating(self);
	}); //
	this.socket.on('join_success', function(data){self.client_onconnected(self, data);});
	this.socket.on('move', function(data){
		self.mover(data, self);
	}); //
	this.socket.on('game_over', this.client_game_over); //
	this.socket.on('killit', function(data){self.client_kill_player(self, data)}); 
	this.socket.on('starting_game', function(){self.client_count_display(self);});
	this.socket.on('accepted_inp_seq', function(){console.log('yaay! seq accepted');});
};


// module.exports = gc;

if( 'undefined' != typeof global ) {
    module.exports = global.gc = gc;
}
