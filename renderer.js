function renderer(board,gnor,gnoc,list_of_players,starting){
	
	var startTime = new Date();
	var list_of_colors=["green", "red", "blue", "yellow", "white"];
	console.log("renderer was called");
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	

	var side = Math.min((window.innerWidth - 130)/gnoc, window.innerHeight/gnor);
	side *= 0.9;
	
	for (var rr = 0; rr < gnor; rr++){
		for (var i = 0; i < gnoc; i++){
			if(board[rr][i] === undefined){
				ctx.beginPath();
				ctx.rect(side*i,side*rr,side,side);
				ctx.fillStyle = "black";
				ctx.fill();
				ctx.closePath();
			}
			else{
				for (var j=list_of_players.length-1; j>=0; j--){
					if(board[rr][i].pid == list_of_players[j][0]){
						ctx.beginPath();
						ctx.rect(side*i,side*rr, side, side);
						ctx.fillStyle = list_of_colors[j];
						ctx.fill();
						ctx.closePath();
					}
				}
			}
		}
	}
	for (var j=list_of_players.length-1; j>=0; j--){
		ctx.beginPath();
		ctx.rect(gnoc*side+side, 10*side+side*4*j, side*2, side*2);
		ctx.fillStyle = list_of_colors[j];
		ctx.fill();
		ctx.closePath();
		ctx.font = "20px Arial";
		ctx.fillStyle = list_of_colors[j];
		ctx.fillText(list_of_players[j][0] + "  "+list_of_players[j][1], gnoc*side+side*5, 10*side+side*(4*j+2));
		if(starting == list_of_players[j][0]){
			ctx.font = "50px Arial";
			ctx.fillStyle = "white";
			ctx.fillText(""+starting + " Won!!!!", (gnoc*side)/3, (gnor*side)/3);
			// ctx.font = "50px Arial";
			// ctx.fillStyle = "red";
			ctx.fillText("GAME OVER!!!!", (gnoc*side)/3, (gnor*side)/2);
		}
	}
		

	if(starting == 1 || starting == 2 || starting == 3){
		ctx.font = "30px Arial";
		ctx.fillStyle = "yellow";
		ctx.fillText("Starting in "+ starting + " sec.",(gnoc*side)/3, (gnor*side)/3);
	}
	
	
	var endTime = new Date();
	var timeDiff = endTime - startTime;
	
}

// module.exports = renderer;
