/*!
* stores id,position,direction,points,etc parameter of the player.
* \class gplayer
*/

function gplayer(){
	this.the_id = undefined;
	this.inipos = undefined;
	this.finalpos = undefined;
	this.finaldir = undefined;
	this.inidir = undefined;
	this.last_killed = Infinity;
	this.trace = []; // {update_no_personal, pos[], direction}
	this.pnts = 0;
	this.killed_by = undefined;
	// trace won't include the point of death
}

/*!
* stores update number,playerid and direction of player present at that lattice(box).
* \class lattice
* \param una update number of that lattice(box)
* \param pid player id of the player present on that lattice
* \param dirn direction of the player on that lattice
*/

function lattice(una, pid, dirn){
	this.un = una;
	this.pid = pid;
	this.dir = dirn;
}

/*!
* \class Grid
* \param nora number of rows in the grid
* \param noca number of columns in the grid
*/

/*!
* \fn get_final_pos_and_prev_pos(pid)
* \memberof Grid
* \param pid player id of the player
* \return current position and previous position of the player with player id = pid.
*/

/*!
* add player with player id = pid in the grid
* \fn add_player(pid)
* \memberof Grid
* \param pid player id of the player
* \return list of players containing their player id and points.
*/

/*!
* sends the signal that game is ready to play
* \fn make_ready_for_update()
* \memberof Grid
*/

/*!
* add a new sequence which contains player id,direction,etc information in the sequence of moves.
* \fn add_sequence(seq)
* \memberof Grid
* \param seq new sequence containing player id,direction,etc
*/

/*!
* \fn get_seq_of_moves()
* \memberof Grid
* \return Sequence of moves
*/

/*!
* \fn get_seq_of_unprocessed_moves()
* \memberof Grid
* \return Sequence of unprocessed moves which are to be added in sequence of moves.
*/

/*!
* Clear all the existing values of the board and set all of it's elements to undefined.
* \fn clear_board()
* \memberof Grid
*/

/*!
* \fn get_board()
* \memberof Grid
* \return current state of the board
*/

/*!
* \fn get_alive_players()
* \memberof Grid
* \return List of current alive gplayer
*/

/*!
* Update the grid whenever called.
* \fn update()
* \memberof Grid
*/

/*!
* \fn get_killed_list()
* \memberof Grid
* \return List of killed gplayers
*/

/*!
* Prints the grid on the console
* \fn print_grid()
* \memberof Grid
*/

/*!
* Remove the player of player id = pida from the Grid
* \fn remove_player()
* \memberof Grid
* \param pida player id of the player
*/

/*!
* Clear the board and initialize the game
* \fn initialize_players()
* \memberof Grid
*/

/*!
* \fn get_ini_list_pid_and_pnts()
* \memberof Grid
* \return list of players containing their player id and points.
*/
/*!
* It takes an unprocessed sequence and processes it including updation of grid, updation of points, removal of dead players from the board.
* \fn oracle(seq)
* \memberof Grid
* \param seq sequence of moves
*/
/*!
* \fn get_actual_up_no()
* \memberof Grid
* \return actual current update number.
*/

/*!
* \fn killed_pid_list()
* \memberof Grid
* \return List containing player id of the players which are dead.
*/

/*!
* Will stop the game when called(at game over)
* \fn stop_game()
* \memberof Grid
*/

function Grid(nora, noca){
	var self = this;
	var grid_num_row = nora;
	var grid_num_col = noca;
	var ini_list_pid_and_pnts = [];
	var seq_of_moves = [];
	var seq_of_unprocessed_moves = [];
	var current_update_number = 0;
	var actual_current_up_no = 0;
	var current_gplayers = [];
	var killed_gplayers = [];
	var should_update = false;
	var board = [];

	var initialized = false;

	this.get_final_pos_and_prev_pos = function(pid){
		var temp_plar = self.get_owner_by_pid(pid);
		var temp_plar_pos = temp_plar.finalpos;
		var temp_plar_dir = temp_plar.finaldir;
		var prev_pos = [(temp_plar_pos[0] - temp_plar_dir[0]), (temp_plar_pos[1] - temp_plar_dir[1])];
		return {final_pos: temp_plar_pos, current_pos: prev_pos};
	}

	this.get_points_of_player = function(pid){
		var temp_plar = self.get_owner_by_pid(pid);
		if (temp_plar == undefined){
			console.log("get_points_of_player got wrong pid");
			return 0;
		}
		var its_pnts = temp_plar.pnts;
		return its_pnts;
	}

	this.get_last_move = function(pid){
		var temp_plar = self.get_owner_by_pid(pid).trace;
		return temp_plar[temp_plar.length - 1][2];
	}

	this.add_player = function(pid){
		var present = false;
		for (var i = 0; i < ini_list_pid_and_pnts.length; i++){
			if (ini_list_pid_and_pnts[i][0] == pid){
				present = true;
				break;
			}
		}
		if (!present){
			console.log("pushing " + pid + "\n");
			ini_list_pid_and_pnts.push([pid, 0]);
			// console.log(ini_list_pid_and_pnts + ": ini_list_pid_and_pnts");
		}
		return ini_list_pid_and_pnts;
	}

	this.make_ready_for_update = function(){
		self.initialize_players();
		console.log("No. of rows are ", grid_num_row);
		console.log("No. of cols are ", grid_num_col);
		current_gplayers.forEach(function(p){
			console.log("position of ", p.the_id, " is ", p.inipos);
		});
		should_update = true;
		console.log("grid ready!");
	}

	this.remove_seq = function(temp_un, pno){
		should_update = false;

		var i = self.finder(temp_un, seq_of_moves, 0);
		if (i != seq_of_moves.length){
			var temp_p = self.get_owner_by_pid(pno);
			var temp_p_trace = temp_p.trace;


			for (var ii = temp_p_trace.length - 1; ii >= 0; --ii){
				if (temp_p_trace[ii][0] == temp_un){
					// console.log("changing trace of player: ", pno, "this is old trace^");
					if (ii == 0){
						temp_p_trace[ii][2] = temp_p.inidir;
					}
					else{
						temp_p_trace[ii][2] = temp_p_trace[ii-1][2];
					}
					// console.log("i was: ", i, "this is new trace:");
					// console.log(temp_p_trace);
					break;
				}
				else{
					// console.log("temp_p_trace[i][0] = ", temp_p_trace[i][0], "; temp_un = ", temp_un);
				}
			}


			temp_array = seq_of_moves.splice(i, seq_of_moves.length - i);
			temp_array.shift(); // removing the undesired sequence
			seq_of_unprocessed_moves.splice.apply(seq_of_unprocessed_moves, [0, 0].concat(temp_array));
			should_update = true;
			return;
		}
		else{
			i = self.finder(una, seq_of_unprocessed_moves, 0);
			if (i == seq_of_unprocessed_moves.length){
				should_update = true;
				return;
			}
			else{
				seq_of_unprocessed_moves.splice(i, 1);
				should_update = true;
				return;
			}
		}
	}

	this.add_sequence = function(seq){
		console.log("add sequence was called with input ", seq);
		should_update = false;
		var i = self.finder(seq[0], seq_of_moves, 0);
		if (i == seq_of_moves.length){
			console.log("No change in processed!");
			if (seq_of_unprocessed_moves.length > 0){
				var j = self.finder(seq[0], seq_of_unprocessed_moves, 0);
				seq_of_unprocessed_moves.splice(j, 0, seq);
				
				// return;
			}
			else{
				console.log('directly pushed');
				seq_of_unprocessed_moves.push(seq);
				// return;
			}
			var pno = seq[1];
			var temp_un = seq[0];
			var temp_p = self.get_owner_by_pid(pno);
			var temp_p_trace = temp_p.trace;
			// console.log("temp_p_trace = ", temp_p_trace)
			for (var ii = temp_p_trace.length - 1; ii >= 0; --ii){
				if (temp_p_trace[ii][0] == temp_un){
					// console.log("changing trace of player: ", pno, "this is old trace^");
					temp_p_trace[ii][2] = seq[2];
					// console.log("i was: ", i, "this is new trace:");
					// console.log(temp_p_trace);
					break;
				}
				else{
					// console.log("temp_p_trace[i][0] = ", temp_p_trace[i][0], "; temp_un = ", temp_un);
				}
			}
			should_update = true;
			return;
		}
		else{
			var pno = seq[1];
			var temp_un = seq[0];
			var temp_p = self.get_owner_by_pid(pno);
			var temp_p_trace = temp_p.trace;
			// console.log("temp_p_trace = ", temp_p_trace)
			for (var ii = temp_p_trace.length - 1; ii >= 0; --ii){
				if (temp_p_trace[ii][0] == temp_un){
					// console.log("changing trace of player: ", pno, "this is old trace^");
					temp_p_trace[ii][2] = seq[2];
					// console.log("i was: ", i, "this is new trace:");
					// console.log(temp_p_trace);
					break;
				}
				else{
					// console.log("temp_p_trace[i][0] = ", temp_p_trace[i][0], "; temp_un = ", temp_un);
				}
			}
			temp_array = seq_of_moves.splice(i, seq_of_moves.length - i);
			seq_of_unprocessed_moves.splice.apply(seq_of_unprocessed_moves, [0, 0].concat(temp_array));
			seq_of_unprocessed_moves.unshift(seq); // inserted at the beginning
			should_update = true;
			return;
		}
	}

	this.get_seq_of_moves = function(){
		return seq_of_moves;
	}

	this.get_seq_of_unprocessed_moves = function(){
		return seq_of_unprocessed_moves;
	}

	this.clear_board = function(){
		board = [];
		each_row = new Array(grid_num_col);
		for (var i = 0; i < grid_num_col; i++){
			each_row[i] = undefined;
		}
		for(var i = 0; i < grid_num_row; i++){
			board[i] = each_row.slice(0);
		}
	}


	this.get_board = function(){
		return board;
	}

	this.get_alive_players = function(){
		return current_gplayers;
	}

	this.update = function(){
		console.log("update of grid was called !!!!!!!!!!!!!!!");
		// returning 0 means false, 1 means true, and 10 means game over
		if (!should_update){
			console.log("$$$$$$$$$$$$$$$$$should_update is false$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
			return 0;
		}
		else if (current_gplayers.length < 1){
			return 10;
		}
		// else:
		actual_current_up_no++;
		var update_update_number = current_update_number;
		if (seq_of_unprocessed_moves.length > 0){
			update_update_number = seq_of_unprocessed_moves[0][0];
		}

		//finder(what, in_this_list, ith_elem_of_each_elem)
		var i = self.finder(update_update_number, seq_of_moves, 0);
		if (i != seq_of_moves.length) {
			// a1 = [1,2,3,4,5];
			// a2 = [21,22];
			// a1.splice.apply(a1, [2, 0].concat(a2));
			// console.log(a1); // [1, 2, 21, 22, 3, 4, 5];
			// moving all elem from i onwards into the beginning of seq_of_unprocessed_moves
			console.log("######################");
			// console.log("seq_om:", seq_of_moves);
			// console.log("seq_oum:", seq_of_unprocessed_moves);
			console.log("shifting all elems with indices >= ", i, " from seq_om to seq_oum");
			temp_array = seq_of_moves.splice(i, seq_of_moves.length - i);
			seq_of_unprocessed_moves.splice.apply(seq_of_unprocessed_moves, [0, 0].concat(temp_array));
			// console.log("seq_om:", seq_of_moves);
			// console.log("seq_oum:", seq_of_unprocessed_moves);
			// console.log("######################");
		}
		else {
			// console.log("len of seq_om = ", seq_of_moves.length, "; result of finder = ", i)
			// console.log("seq_om: ", seq_of_moves)
		}

		while(seq_of_unprocessed_moves.length > 0){
			if (seq_of_unprocessed_moves[0][0] >= actual_current_up_no){
				console.log("skipping future request");
				break;
			}
			if (seq_of_unprocessed_moves.length > 1 && seq_of_unprocessed_moves[1][0] <= actual_current_up_no) 
				{current_update_number = seq_of_unprocessed_moves[1][0];}
			else{
				current_update_number = actual_current_up_no;
			}
			self.oracle(seq_of_unprocessed_moves[0]);
			tempseq = seq_of_unprocessed_moves.shift();
			if (tempseq != undefined){
				seq_of_moves.push(tempseq);
			}
		}

		if (actual_current_up_no >= current_update_number){
			console.log("diff exists b/w act_un and cur_um");
			cur_n = current_update_number;
			current_update_number = actual_current_up_no;
			self.oracle_extrapolate(cur_n);
		}
		return 1;
	}

	this.get_killed_list = function(){
		return killed_gplayers;
	}


	this.print_grid = function(){
		if (!initialized){
			console.log("Empty grid of size" + grid_num_row + " x " + grid_num_col);
		}
		else{
			for (var rr = 0; rr < grid_num_row; rr++){
				r = board[rr];
				for (var i = 0; i < grid_num_col; i++){
					var e = r[i];
					if (e == undefined){
						// console.log("u ", ";     ");
						process.stdout.write("     " + " u;");
						continue;
					}
					// console.log(e.pid, ", ", e.un , ";    ");
					process.stdout.write("   " + e.pid + ", " + e.un+";");
				}
				process.stdout.write("\n");
			}
		}
	}

	this.remove_player = function(pida){
		self.add_sequence([actual_current_up_no, pida,[0,0]]);
	}
	
	this.initialize_players = function(){
		self.clear_board();
		//create and position players()
		self.c_position_players();
		initialized = true;
	}

	this.get_ini_list_pid_and_pnts = function(){
		return ini_list_pid_and_pnts;
	}

	this.c_position_players = function(){
		var cppx = [];
		var cppy = [];
		var cppdiri = [];
		var cppiniposi = [];
		// return ini_list_pid_and_pnts;
		var cpplen = ini_list_pid_and_pnts.length;
		/*if (cpplen == 1){
			cppy.push(Math.floor(grid_num_col/2));
			cppx.push(Math.floor(grid_num_row / 2));
			cppdiri.push([-1, 0]);
			cppiniposi.push([cppx[0], cppy[0]]);
		}
		else if (cpplen == 2){
			cppy.push(Math.floor(grid_num_col/4));
			cppy.push(Math.floor(grid_num_col*3/4));
			cppx.push(Math.floor(grid_num_row / 2));
			cppdiri.push([0, 1]);
			cppdiri.push([0, -1]);
			cppiniposi.push([cppx[0], cppy[0]]);
			cppiniposi.push([cppx[0], cppy[1]]);
		}*/
			cppx.push(Math.floor(grid_num_row / 2));
		for (var j=0; j<cpplen; j++){
			var y= Math.floor((2*j+1)*grid_num_col/(cpplen*2))
			cppy.push(y);
			cppdiri.push([-1, 0]);
			cppiniposi.push([cppx[0], y]);

		}

		for(var i = 0; i < cpplen; ++i){
			console.log("caspa i = " + i + "\n");
			self.create_and_set_player_at(ini_list_pid_and_pnts[i][0], cppiniposi[i], cppdiri[i]);
		}
		return;
	}

	this.create_and_set_player_at = function(pid, inipos, dir){
		// Creating gplayer
		var babyGplayer = new gplayer();
		babyGplayer.the_id = pid;
		babyGplayer.inipos = inipos;
		babyGplayer.finalpos = inipos;
		babyGplayer.finaldir = dir;
		babyGplayer.inidir = dir;
		babyGplayer.trace.push([0, inipos, dir]);
		//adding it to list of current players;
		current_gplayers.push(babyGplayer);
		var x0 = inipos[0];
		var y0 = inipos[1];
		// Placing on board
		var caspa_latt = new lattice(0, pid, dir);
		board[x0][y0] = caspa_latt;
		return;
	}

	this.oracle = function(seq){
		var oracle_update_number = seq[0];
		self.respawn_dead(oracle_update_number);
		self.oracle_remove_pseudo_future_trace_from_players(oracle_update_number);
		self.oracle_clear_board_from(oracle_update_number);
		self.oracle_change_new_head(seq[0], seq[1], seq[2]);
		self.oracle_extrapolate(oracle_update_number);
		return;
	}

	this.respawn_dead = function(from_this_time){
		console.log("respawn was called");
		var birth_list = [];
		killed_gplayers.forEach(function(p){
			if (p.last_killed >= from_this_time){
				if (!birth_list.includes(p)){
					birth_list.push(p);
					// var index = killed_gplayers.indexOf(p);
					// killed_gplayers.splice(index,1);
				}
			}
		});
		birth_list.forEach(function(p){
			if (!current_gplayers.includes(p)){
				current_gplayers.push(p);
				if (p.killed_by != undefined){
					var killer_obj = self.get_owner_by_pid(p.killed_by);
					killer_obj.pnts = killer_obj.pnts - 100;
					for (var ii = ini_list_pid_and_pnts.length - 1; ii >= 0; --ii){
						if (ini_list_pid_and_pnts[ii][0] == p.killed_by){
							ini_list_pid_and_pnts[ii][1] = ini_list_pid_and_pnts[ii][1] - 100;
							break;
						}
					}
					ii = undefined;
					killer_obj = undefined;
					p.killed_by = undefined
				}
				p.last_killed = Infinity;
				var pt = p.trace;
				pt.forEach(function(lt){
					// console.log("lt: ", lt);
					var temp_lat = new lattice(lt[0], p.the_id, lt[2]);
					var temp_x = lt[1][0];
					var temp_y = lt[1][1];
					/*console.log("old board @ (", temp_x, ", ", temp_y, "): ")
					if (board[temp_x][temp_y] != undefined){
						console.log(board[temp_x][temp_y])
					}
					else {
						console.log("u")
					}*/
					board[temp_x][temp_y] = temp_lat;
					// console.log("new board @ (", temp_x, ", ", temp_y, "): ")
					// if (board[temp_x][temp_y] != undefined){
					// 	console.log(board[temp_x][temp_y])
					// }
					// else {
					// 	console.log("u")
					// }
					temp_lat = undefined;
					temp_x = undefined;
					temp_y = undefined;
				});
			}
			if (killed_gplayers.includes(p)){
				var inddd = killed_gplayers.indexOf(p);
				killed_gplayers.splice(inddd, 1);
				inddd = undefined;
			}
		});
		console.log("birth_list:")
		console.log(birth_list)
		birth_list = undefined;
	}

	this.oracle_remove_pseudo_future_trace_from_players = function(after){
		current_gplayers.forEach(function(p){
			// console.log("trace at the starting of rem_pseudo_fut_trace: (p = ", p.the_id, ")");
			// console.log(p.trace);
			var ptl = p.trace.length;
			var rmi = p.trace.length;
			for (var i = ptl - 1; i >= 0; i--) {
				if (p.trace[i][0] <= after){
					rmi = i + 1;
					break;
				}
			}
			p.trace.splice(rmi, ptl - rmi);
			p.finalpos = p.trace[rmi - 1][1];
			p.finaldir = p.trace[rmi - 1][2];
			// console.log("trace at the end of rem_pseudo_fut_trace:");
			// console.log(p.trace);
		});
		return;
	}

	this.oracle_clear_board_from = function(update_no){
		for (var rr = 0; rr < grid_num_row; rr++){
			ro = board[rr];
			for (var i = 0; i < ro.length; i++) {
				if (ro[i] != undefined && ro[i].un > update_no){
					ro[i] = undefined;
					console.log("cleared board at pos: (", rr, ", ", i, ")");
				}
			}
		}
	}

	this.oracle_change_new_head = function(at_this_uid, pida, dirna){
		for (var kl = 0; kl < current_gplayers.length; kl++){
			if (current_gplayers[kl].the_id == pida){
				current_gplayers[kl].finaldir = dirna;
				var cgt = current_gplayers[kl].trace;
				for (var i = cgt.length - 1; i >= 0; i--) {
					if (cgt[i][0] == at_this_uid){
						cgt[i][2] = dirna;
						break;
					}
				}
				return;
			}
		}
	}

	this.oracle_extrapolate = function(from_this_no){
		var cnt = from_this_no;
		if (cnt >= current_update_number){
			console.log("skipping move. cnt = ", cnt, " current_update_number = ", current_update_number);
		}
		while (cnt < current_update_number){
			self.move(cnt);
			//remove_killed_from_board(); done in kill only
			cnt++;
		}
	}

	this.move = function(curr_time){
		var kill_list = [];
		current_gplayers.forEach(function (p){
			var hd = p.finalpos;
			var arrow = p.finaldir;
			var newpos = [(hd[0] + arrow[0]), (hd[1] + arrow[1])];
			var host;
			if (self.is_out_of_range(newpos)){
				//kill(p);
				console.log("is_out_of_range! newpos = ");
				console.log(newpos + "\tplayerid = "+ p.the_id+ "\n");
				console.log("total row is ", grid_num_row);
				console.log("total column is ", grid_num_col);
				// console
				kill_list.push(p);
			}
			else{
				host = board[newpos[0]][newpos[1]];
			}
			if (host != undefined){ // i.e. host has some owner
				if (host.pid == p.the_id){
					console.log("self killed!\n");
					kill_list.push(p);
				}
				else if (host.un == curr_time + 1){
					var host_player_obj = self.get_owner_by_pid(host.pid);
					var host_already_killd = false;
					for (var i = kill_list.length - 1; i >= 0; --i){
						if (kill_list[i].the_id == host_player_obj.the_id){
							host_already_killd = true;
						}
					}
					if (!host_already_killd){
						kill_list.push(host_player_obj);
						kill_list.push(p);
						console.log("plr " +p.the_id+ " and plr" + self.get_owner_by_pid(host.un) + " killed\n");
					}
					else{
						kill_list.push(p);
						console.log("plr ", p.the_id, " killed\n");
					}
				}
				else{
					kill_list.push(p);
					pp = self.get_owner_by_pid(host.pid);
					pp.pnts += 100;
					p.killed_by = pp.the_id;
					console.log("plr ", p.the_id, " killed\n");
					for(var i = 0; i < ini_list_pid_and_pnts.length; i++){
						if (ini_list_pid_and_pnts[i][0] == host.pid){
							ini_list_pid_and_pnts[i][1] += 100;

							break;
						}
					}
				}
			}

			if (!kill_list.includes(p)){
				// console.log("entered pushing region\n");
				board[newpos[0]][newpos[1]] = new lattice((curr_time+1), p.the_id, arrow);
				p.finalpos = newpos;
				p.trace.push([(curr_time+1), newpos, arrow]);
			}else{
				console.log(JSON.stringify(kill_list));
			}
			len = current_gplayers.length;
			for (i=0; i<len; i++){
				current_gplayers[i].pnts+=1;
				len1=ini_list_pid_and_pnts.length;
				for(j=0; j<len1; j++){
					if(current_gplayers[i].the_id==ini_list_pid_and_pnts[j][0]){
						ini_list_pid_and_pnts[j][1]+=1;
						break;
					}
				}
			}
			console.log("list of points " ,ini_list_pid_and_pnts);
		});


		// for (a in kill_list){
		kill_list.forEach(function (a){
			// if (! current_gplayers.includes(a)){
			// 	console.log("locha ki mom");
			// }
			self.kill(a, curr_time+1);
		});
		// console.log("current_gplayers:");
		// console.log(current_gplayers);
		// console.log("kill_list");
		// console.log(kill_list);
		kill_list = undefined;
	}

	this.kill = function(plr, time_of_death){
		// var indx = current_gplayers.indexOf(plr);
		// console.log("entered kill! plr = ", plr)
		var indx = -1;
		for (var i = current_gplayers.length - 1; i >= 0; --i){
			if (current_gplayers[i].the_id == plr.the_id){
				indx = i;
				break;
			}
			// else{
			// 	console.log("current_gplayers[i].the_id = " , current_gplayers[i].the_id);
			// 	console.log("plr.the_id", plr.the_id);
			// }
		}
		console.log("index in kill ", indx);
		if (indx > -1){
		// if (current_gplayers.includes(plr)){
			console.log("entered removal zone!")
			var oddd = current_gplayers.splice(indx, 1)[0];
			if (!killed_gplayers.includes(oddd)){
				killed_gplayers.push(oddd);
				oddd.last_killed = time_of_death;
			}
			// console.log("oddd: ")
			// console.log(oddd)
			//now remove plr from board
			// for (i in oddd.trace){
			oddd.trace.forEach(function(i){
				var target_pos_x = i[1][0];
				var target_pos_y = i[1][1];
				board[target_pos_x][target_pos_y] = undefined;
			});
			var otl = oddd.trace.length;
			if (otl > 0){
				if (oddd.trace[otl-1] == time_of_death){
					oddd.trace.pop();
					if (otl != 1){
						oddd.finalpos = oddd.trace[otl-2];
					}
					else{
						oddd.finalpos = oddd.inipos;
					}
				}
			}
		}else if (killed_gplayers.includes(plr)){
			console.log("already killed!")
		}
		else{
			console.log("locha hai");
		}
	}

	this.is_out_of_range = function(inp_pos){
		ioor_x = inp_pos[0];
		ioor_y = inp_pos[1];
		if (ioor_x < 0 || ioor_x >= grid_num_row) return true;
		else if (ioor_y < 0 || ioor_y >= grid_num_col) return true;
		else {
			return false;
		}
	}

	this.get_owner_by_pid = function(pida){
		var cgl = current_gplayers.length;
		var kgl = killed_gplayers.length;
		for (var i = 0; i < cgl; i++){
			if (current_gplayers[i].the_id == pida){
				return current_gplayers[i];
			}
		}
		for (var i = 0; i < kgl; i++){
			if (killed_gplayers[i].the_id == pida){
				return killed_gplayers[i];
			}
		}
		console.log("nothin found here:(");
	}

	this.finder = function(what, in_this_list, ith_elem_of_each_elem){
		//finds the smallest index r such that ith_elem_of_each_elem of elem at index at r
		// is >= what and returns it
		// console.log("finder, what: ", what)
		if (in_this_list.length == 0) return 0;
		if (in_this_list[in_this_list.length - 1][ith_elem_of_each_elem] < what) return in_this_list.length;

		var finder_help = function(start_ind, end_ind){
			// console.log("finder: ", start_ind, ", ", end_ind);
			mid_ind = Math.floor((start_ind + end_ind)/2); 
			// console.log("mid_ind: ", mid_ind, "; in_this_list[", mid_ind, "] = ", in_this_list[mid_ind])
			if (in_this_list[mid_ind][ith_elem_of_each_elem] < what){
				return finder_help(mid_ind+1, end_ind);
			}
			else if (mid_ind == 0 || in_this_list[mid_ind-1][ith_elem_of_each_elem] < what){
				return mid_ind;
			}
			else{
				return finder_help(start_ind, mid_ind);
			}
		}

		res = finder_help(0, in_this_list.length);
		return res;
	}

	this.get_actual_up_no = function(){
		return actual_current_up_no;
	}

	this.killed_pid_list = function(){
		killed_list = [];
		for (var p in killed_gplayers){
			killed_list.push(p.the_id);
		}
		return killed_list;
	}

	this.ini_player_list_length = function(){
		return ini_list_pid_and_pnts.length;
	}

	this.debug_ini = function(){
		self.add_player(1);
		self.add_player(2);
		self.make_ready_for_update();
		self.update();
		self.update();
		// ll = self.get_alive_players();
	}
	this.drama = function(){
		self.add_sequence([1, 1, [0, 1]]);
		self.update();self.print_grid();
		console.log("");
		self.add_sequence([1, 2, [0, 1]]);
		self.update();self.print_grid();
		console.log("");
		self.add_sequence([3, 2, [-1, 0]]);
		self.update();self.print_grid();
		console.log("");
		self.print_grid();
		self.add_sequence([5, 2, [0, -1]]);
		self.up_and_prt();
		self.up_and_prt();
		self.add_sequence([5, 1, [1, 0]]);
		self.up_and_prt();
	}

	this.up_and_prt = function(){
		self.update();
		self.print_grid();
		console.log("");
	}

	this.repeat_up_and_prt = function(countt){
		while (countt > 0){
			self.up_and_prt();
			countt--;
		}
	}

	this.stop_game = function(){
		should_update = false;
	}

	this.is_game_over = function(){
		
	}
}

if(typeof exports == 'undefined'){
    // var exports = this['Grid'] = {};
}
else{
	module.exports = Grid;
}
// module.exports = Grid;
