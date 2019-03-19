var express = require('express');
var app = express();
var rd = require('./rsa/rsa_decryptor.js');
var rdd = new rd();
var sessions = require('express-session');
var nconnect = require('connect');
var crypto = require('crypto');

var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Weareafamily',
	database: 'Pro1'
});
var tablename = "test1";

con.connect(function(err){
	if (err) {
		console.log("Mysql error: ", err);
	}
});

// var MemoryStore = require('connect/middleware/session/memory'),
var sessionStore = new sessions.MemoryStore();
var cookieSecret = 'your secret sauce';
var cookieParser = require('cookie-parser')(cookieSecret);
  // , sessionStore = new nconnect.middleware.session.MemoryStore();

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieParser);
app.use(sessions({ secret: cookieSecret, store: sessionStore, resave: true, saveUninitialized: true}));
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

app.get('/', function(req, res) {
	res.sendfile('index_new.html', { root:__dirname });
});
console.log("???????????????????");

app.get( '/*' , function( req, res, next ) {
		//This is the current file they have requested
	var file = req.params[0];
		//For debugging, we can track what files are requested.
	if(true) {
		console.log('\t :: Express :: file requested : ' + file);
		//console.log('\t__dirname = ' + __dirname + ';;full path given = ' + __dirname + '/' + file);
	}
		//Send the requesting client the file.
	res.sendfile( __dirname + '/' + file );
});

// io.configure(function (){
// 	io.set('log level', 0);
// 	// io.set('authorization', function (handshakeData, callback) {
// 	//   callback(null, true); // error first callback style
// 	// });
// });


var list_of_games=[];
var game = require('./gc');

get_owner_by_gid = function(gid){
	//console.log("get_owner_by_gid called");
	var temp = list_of_games.length;
	//console.log("list of games:", list_of_games);
		for (var i = 0; i < temp; i++){
			if (list_of_games[i].get_gameID() == gid){
				//console.log("game:",list_of_games[i]);
				return list_of_games[i];
			}
			else {
				//console.log("Game_ID is:",list_of_games[i].get_gameID());
				//console.log("gid is", gid);
			}
		}
	}

var list_of_playerID = [];
//var user;
random_gameid=-123456789;

var resetq = "UPDATE test1 SET dlogged = 0";
con.query(resetq, function(err, results){
	if (err) throw err;
});



sessionSockets.on('connection', function(err, socket, session) {
	console.log('New user connected');
	var user;
	if (session == undefined){
		socket.emit('ref');
	}
	else{
	if (session.count == undefined){
		console.log("initial session.count before = 0");
		session.count = 1;
	}
	else{
		console.log("initial session.count before = ", session.count);
		session.count++;
	}
	if (session.pac === undefined){
		session.pac = rdd.get_the_package();
	}
	socket.on('get_package', function(){
		console.log("package request received");
		if (session.pac === undefined){
			session.pac = rdd.get_the_package();
		}
		socket.emit('rsa_enc_package', {e: session.pac.e, n: session.pac.n});
	});

	session.save();
	console.log("initial session.count after = ", session.count);
	var user;
	console.log("session: ", session);
	console.log("############################################");
	if (session.loggedin){
		// console.log("Already logged in");
		// socket.emit("settingPlayerID", session.pid);
		if (session.count == 1){
			socket.emit('settingPlayerID', session.pid);
		}
		else{
			socket.emit('do_login');
		}
		session.save();
	}
	//if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > noofplayers-1) roomno++;
	socket.on('setGameID', function(data) {
		if (session.loggedin){
			console.log("caught setGameID");
			if (data.playerID == undefined){
				data.playerID = session.pid;
			}
			Game_ID = data.gameID;
			if(Game_ID <= -123456789){
				Game_ID= random_gameid;
			}
			PlayerID = data.playerID;
			user = PlayerID;
			NoOfPlayers = data.noOfPlayers;
			var g1 = get_owner_by_gid(Game_ID);
			var indx = list_of_games.indexOf(g1);
			//console.log("index is:",indx);
			if(list_of_games.indexOf(g1) > -1){
				//console.log("full is",g1.get_full());
				if(g1.get_full()){
					if(Game_ID <= -123456789){
						random_gameid--;
						data.gameID--;
						socket.emit('random_game_full', data);
					}
					else {
						var inddd = list_of_playerID.indexOf(user);
						list_of_playerID.splice(inddd, 1);
						socket.emit('GameIDExists','The game with GameID '+ Game_ID + ' is full. Try after sometime!!');
					}
				}
				else{
					socket.pid=PlayerID;
					g1.server_add_player(socket);
					socket.game_instance=g1;
					var new_new_daata = data;
					new_new_daata.noOfPlayers = g1.get_max_nop();
					socket.emit('join_success', new_new_daata);
					socket.emit('join_success1', new_new_daata);
					if(g1.get_full()){
						g1.start_start();
					}
				}
			}
			else {
				var g1 = new game(Game_ID, NoOfPlayers, true);
				console.log("new game created");
				list_of_games.push(g1);
				socket.pid=PlayerID;
				g1.server_add_player(socket);
				socket.game_instance=g1;
				socket.emit('join_success', data);
				socket.emit('join_success1', data);
				if(g1.get_full()){
						g1.start_start();
					}
			}
		}
		else{
			console.log("client with pid ", data.playerID, " was not logged in");
			socket.emit('do_login');
		}
	});

	socket.on('setPlayerID', function(data){
		if (session.loggedin){
			console.log("basmashi in setPlayerID!");
			return;
		}
		var uide = con.escape(data.username);
		var uid = data.username;
		var pswd = rdd.get_decr_text(data.pswd, session.pac.n, session.pac.d);
		console.log('decr pswd is ', pswd);
		var hsd_pswd = undefined;
		var data = uid;
		console.log("tablename = ", tablename);
		var sql = "SELECT username, salt, hashed_p, dlogged FROM " + tablename + " WHERE username = " 
		+ uide + " LIMIT 1";
		console.log("uid = ", uid);
		console.log("mysql query string: ", sql);
		var actps = undefined;
		con.query(sql, function(err, results, fields){
			if (err) console.log(err);
			if (results.length == 0 || results[0].dlogged == 1){
				socket.emit("do_login");
			}
			else{
				actps = results[0].hashed_p;
				console.log("actps = ", actps);
				hsd_pswd = crypto.createHash('sha256').update(results[0].salt + pswd).digest('hex');
				console.log("hash stored is: ", actps);
				if(list_of_playerID.indexOf(data) > -1) {
					socket.emit('PlayerIDExists',data);
				} else if (hsd_pswd == actps){
					session.loggedin = true;
					console.log("session from the inside: ", session);
					session.pid = uid;
					session.save();
					list_of_playerID.push(data);
					user = uid;
					var SQL2 = "UPDATE " + tablename + " SET dlogged = 1 WHERE username = " + con.escape(session.pid) + " LIMIT 1";
					con.query(SQL2, function(err2, results2){
						if (err2) throw err2;
					});
					console.log("will now emit setPlayerID", data);
					socket.emit('settingPlayerID', data);
				}
				else{
					console.log("chor aaya tha, key tha: ", pswd);
					socket.emit("re_enter_credentials");
				}
			}
		});
		session.save();
		
	});

	socket.on('create_player', function(data){
		if (session.loggedin){
			console.log("basmashi in create_player!");
			return;
		}
		var uide = con.escape(data.username);
		var uid = data.username;
		var pswd = rdd.get_decr_text(data.pswd, session.pac.n, session.pac.d);
		console.log('decr pswd is ', pswd);
		var hsd_pswd = undefined;
		var data = uid;
		console.log("tablename = ", tablename);
		var sql = "SELECT username FROM " + tablename + " WHERE username = " 
		+ uide + " LIMIT 1";
		console.log("uid = ", uid);
		console.log("mysql query string: ", sql);

		con.query(sql, function(err, results, fields){
			if (err) console.log(err);
			if (results.length != 0){
				console.log("user exists");
				socket.emit("re_signup", uid); // user_exists
			}
			else{
				var hash_p = crypto.createHash('sha256').update(data + pswd).digest('hex');
				var sql2 = "INSERT into " + tablename + "(username, salt, hashed_p) VALUES (" + uide
				+ ", " + uide + ", " + con.escape(hash_p) + ")"; 
				console.log("mysql query string: ", sql2);
				con.query(sql2, function(err, results){
					if (err) throw err;
					socket.emit("do_login1");
				});
			}
		});

		session.save();

	});

	socket.on('game_over', function(){
		// len = list_of_games.length;
		// var gg=socket.game_instance;
		// for(var i=0; i<len; i++){
		// 	if(gg.game_ID == list_of_games[i].game_ID){
		// 		list_of_games.splice(i, 1);
		// 		break;
		// 	}
		// }
		console.log("game over is called");
		socket.emit('game_over1');
	})
	socket.on('message', function(data){
		// console.log("app::: socket: ", socket);
		if (session.loggedin){
			var temp_list = data.split("#");
			if (temp_list.length != 4){
				console.log("chutiya detected");
			}
			else if (temp_list[1] == session.pid){
				socket.game_instance.server_input_handle(data);
				console.log("message detected");
			}
		}
		else{
			socket.emit('do_login');
		}
		session.save();
	});

	socket.on('update_points', function(data){
		if (socket.game_instance != undefined && socket.game_instance != null){
			socket.game_instance.marks[session.pid] = data;
		}
	});	


	socket.on('disconnect', function(){
		console.log("user: ", user);
		console.log("session count before: ", session.count);
		session.count = session.count - 1;
		session.save();
		console.log("session count after: ", session.count);
		console.log("disconnecting");
		if(user!=undefined){
			console.log(user, ' is disconnected');
			var inddd = list_of_playerID.indexOf(user);
			list_of_playerID.splice(inddd, 1);
			console.log(user, " is removed");
			if (session.loggedin){
				
				
			}
		}
		if (socket.game_instance != undefined && socket.game_instance != null){
			socket.game_instance.server_remove_player(session.pid);
			if(socket.game_instance.get_NoOfPlayers() <= 0){
				len = list_of_games.length;
				var gg=socket.game_instance.game_ID;
				var marks_list = socket.game_instance.get_marks_list();
				for (let key in marks_list){
					if (marks_list.hasOwnProperty(key)){
						if (!isNaN(marks_list[key])){
							let mysql_query1 = "UPDATE " + tablename + " SET points = points + " + marks_list[key]
							+ " WHERE username = " + con.escape(key) + " LIMIT 1";
							console.log("Mysql query while updating marks was: ", mysql_query1);
							con.query(mysql_query1, function(err, results){
								if (err) throw err;
								if (results.length <1){
									console.log("player not found while updating points");
								}
							});
						}
						else{
							console.log("marks_list[", key, "] = ", marks_list[key], " this is NaN");
						}
					}
				}
				for(var i=0; i<len; i++){
					if(gg == list_of_games[i].game_ID){
						list_of_games.splice(i, 1);
						break;
					}
				}

			}

		}

		socket.game_instance=null;
	});

	socket.on('disconnect1', function(){
		//console.log("user: ", user);
		//console.log("session count before: ", session.count);
		//session.count = session.count - 1;
		//session.save();
		//console.log("session count after: ", session.count);
		//console.log("disconnecting");
		// //if(user!=undefined){
		// 	//console.log(user, ' is disconnected');
		// 	//var inddd = list_of_playerID.indexOf(user);
		// 	//list_of_playerID.splice(inddd, 1);
		// 	//console.log(user, " is removed");
		// 	if (session.loggedin){
				
				
		// 	}
		// }
		//console.log(data);
		if (socket.game_instance != undefined){
			socket.game_instance.server_remove_player(session.pid);
			if(socket.game_instance.get_NoOfPlayers() <= 0){
				len = list_of_games.length;
				var gg=socket.game_instance.game_ID;
				for(var i=0; i<len; i++){
					if(gg == list_of_games[i].game_ID){
						list_of_games.splice(i, 1);
						break;
					}
				}
			}
		}

		socket.game_instance=null;
	});

	socket.on('logout', function(){
		console.log("inside logout!!!!!!!!!!!!!!");
		var SQL2 = "UPDATE " + tablename + " SET dlogged = 0 WHERE username = " + con.escape(session.pid) + " LIMIT 1";
		con.query(SQL2, function(err2, results2){
			if (err2) throw err2;
		});
		session.destroy();
		socket.emit('ref');
	});

	}

	// if (session.pac === undefined){
	// 	session.pac = rdd.get_the_package();
	// }
	// socket.emit('rsa_enc_package', {e: session.pac.e, n: session.pac.n});
});

http.listen(3000, function() {
	console.log('listening on localhost:3000');
});