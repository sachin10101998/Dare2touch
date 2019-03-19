/*!
 * AI class returns the next direction of AI snake
 * \class AI
 * \param board current state of board
 * \param currentpos current position of AI snake and player snake on the board
 * \param lastpos previous position of AI snake and player snake on the board
 * \param gnor total number of rows
 * \param gnoc total number of columns 
 * \return Direction of the AI snake
 */

/*! 
 * \fn find_diff(currentposition,nextposition,lastposition)
 * \memberof AI
 * \param currentposition current position of AI snake and player snake on the board
 * \param lastposition last position of AI snake and player snake on the board
 * \param nextposition predicted next move of the AI snake
 * \return the difference of boxes AI snake could reach first to player snake could reach first
 */

 /*!
 * For every possible movement of AI snake find point difference using find_diff(currentposition,nextposition,lastposition) and returns the direction for which point difference is maximum.
 * \fn ai()
 * \memberof AI
 * \return Direction corresponding to the maximum point difference
 */

function AI(board,currentpos,lastpos,gnor,gnoc){
	var self = this;
	var current_diff = -(gnor*gnoc);
	var max_diff = -(gnor*gnoc);
	var direction = [];
	var nextpos = [];
	var actual_next_pos = [];

	var find_diff = function(currentposition,nextposition,lastposition){
		var ai_points = 0;
		var player_points = 0;
		var diff_points = 0;
		var player_next_pos = [];
		var pos = [];
		// console.log("find_diff called")
		for(var rr=0;rr<gnor;rr++){
			for(var i=0;i<gnoc;i++){
				// pos = [rr,i];
				for(var j=0;j<3;j++){
					if(j==0){
						if((currentposition[1][0] != 0 || (currentposition[1][1] - lastposition[1][1] != -1)) &&
							(currentposition[1][0] != gnor-1 || (currentposition[1][1] - lastposition[1][1] != 1)) &&
							(currentposition[1][1] != 0 || (currentposition[1][0] - lastposition[1][0] != 1)) &&
							(currentposition[1][1] != gnoc-1 || (currentposition[1][0] -lastposition[1][0] != -1))){
							if(currentposition[1][0] - lastposition[1][0] != 0 && board[currentposition[1][0]][currentposition[1][1] - currentposition[1][0] + lastposition[1][0]] === undefined){
								player_next_pos = [currentposition[1][0],currentposition[1][1] - currentposition[1][0] + lastposition[1][0]];
							}
							else if(board[currentposition[1][0] - currentposition[1][1] + lastposition[1][1]][currentposition[1][1]] === undefined){
								player_next_pos = [currentposition[1][0] - currentposition[1][1] + lastposition[1][1],currentposition[1][1]];
							}
						}
					}
					else if(j==1){
						if((currentposition[1][0] != 0 || (currentposition[1][0] - lastposition[1][0] != -1)) &&
							(currentposition[1][0] != gnor-1 || (currentposition[1][0] - lastposition[1][0] != 1)) &&
							(currentposition[1][1] != 0 || (currentposition[1][1] - lastposition[1][1] != -1)) &&
							(currentposition[1][1] != gnoc-1 || (currentposition[1][1] -lastposition[1][1] != 1))){
							if(currentposition[1][0] - lastposition[1][0] != 0 && board[currentposition[1][0] + currentposition[1][0] - lastposition[1][0]][currentposition[1][1]] === undefined){
								player_next_pos = [currentposition[1][0] + currentposition[1][0] - lastposition[1][0],currentposition[1][1]];
							}
							else if(board[currentposition[1][0]][currentposition[1][1] + currentposition[1][1] - lastposition[1][1]] === undefined){
								player_next_pos = [currentposition[1][0],currentposition[1][1] + currentposition[1][1] - lastposition[1][1]];
							}
						}
					}
					else if(j==2){
						if((currentposition[1][0] != 0 || (currentposition[1][1] - lastposition[1][1] != 1)) &&
							(currentposition[1][0] != gnor-1 || (currentposition[1][1] - lastposition[1][1] != -1)) &&
							(currentposition[1][1] != 0 || (currentposition[1][0] - lastposition[1][0] != -1)) &&
							(currentposition[1][1] != gnoc-1 || (currentposition[1][0] -lastposition[1][0] != 1))){
							if(currentposition[1][0] - lastposition[1][0] != 0 && board[currentposition[1][0]][currentposition[1][1] + currentposition[1][0] - lastposition[1][0]] === undefined){
								player_next_pos = [currentposition[1][0],currentposition[1][1] + currentposition[1][0] - lastposition[1][0]];
							}
							else if(board[currentposition[1][0] + currentposition[1][1] - lastposition[1][1]][currentposition[1][1]] === undefined){
								player_next_pos = [currentposition[1][0] + currentposition[1][1] - lastposition[1][1],currentposition[1][1]];
							}
						}
					}

					// console.log("before checing undefined property")
					if(board[rr][i] === undefined){
						if(Math.abs(nextposition[0] - rr) + Math.abs(nextposition[1] - i) < Math.abs(player_next_pos[0] - rr) + Math.abs(player_next_pos[1] - i)){
							ai_points++;
						}
						else if(Math.abs(nextposition[0] - rr) + Math.abs(nextposition[1] - i) > Math.abs(player_next_pos[0] - rr) + Math.abs(player_next_pos[1] - i)){
							player_points++;
						}
					}
				}
			}
		}
		diff_points = ai_points - player_points;
		return diff_points/3;
	}

	var ai = function(){
		console.log(currentpos)
		// console.log("ai called")
		for(var i=0;i<3;i++){
			if(i==0){
				if((currentpos[0][0] != 0 || (currentpos[0][1] - lastpos[0][1] != -1)) &&
					(currentpos[0][0] != gnor-1 || (currentpos[0][1] - lastpos[0][1] != 1)) &&
					(currentpos[0][1] != 0 || (currentpos[0][0] - lastpos[0][0] != 1)) &&
					(currentpos[0][1] != gnoc-1 || (currentpos[0][0] -lastpos[0][0] != -1))){
					if(currentpos[0][0] - lastpos[0][0] != 0){
						if(board[currentpos[0][0]][currentpos[0][1] - currentpos[0][0] + lastpos[0][0]] === undefined){
							nextpos = [currentpos[0][0],currentpos[0][1] - currentpos[0][0] + lastpos[0][0]];
							current_diff = find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
					else if(board[currentpos[0][0] - currentpos[0][1] + lastpos[0][1]][currentpos[0][1]] === undefined){
						nextpos = [currentpos[0][0] - currentpos[0][1] + lastpos[0][1],currentpos[0][1]];
						current_diff = find_diff(currentpos,nextpos,lastpos);
						console.log(current_diff)
						console.log(nextpos)
					}
				}
			}
			else if(i==1){
				if((currentpos[0][0] != 0 || (currentpos[0][0] - lastpos[0][0] != -1)) &&
					(currentpos[0][0] != gnor-1 || (currentpos[0][0] - lastpos[0][0] != 1)) &&
					(currentpos[0][1] != 0 || (currentpos[0][1] - lastpos[0][1] != -1)) &&
					(currentpos[0][1] != gnoc-1 || (currentpos[0][1] -lastpos[0][1] != 1))){
					if(currentpos[0][0] - lastpos[0][0] != 0){
						if(board[currentpos[0][0] + currentpos[0][0] - lastpos[0][0]][currentpos[0][1]] === undefined){
							nextpos = [currentpos[0][0] + currentpos[0][0] - lastpos[0][0],currentpos[0][1]];
							current_diff = find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
					else if(board[currentpos[0][0]][currentpos[0][1] + currentpos[0][1] - lastpos[0][1]] === undefined){
						nextpos = [currentpos[0][0],currentpos[0][1] + currentpos[0][1] - lastpos[0][1]];
						current_diff = find_diff(currentpos,nextpos,lastpos);
						console.log(current_diff)
						console.log(nextpos)
					}
				}
			}
			else if(i==2){
				if((currentpos[0][0] != 0 || (currentpos[0][1] - lastpos[0][1] != 1)) &&
					(currentpos[0][0] != gnor-1 || (currentpos[0][1] - lastpos[0][1] != -1)) &&
					(currentpos[0][1] != 0 || (currentpos[0][0] - lastpos[0][0] != -1)) &&
					(currentpos[0][1] != gnoc-1 || (currentpos[0][0] -lastpos[0][0] != 1))){
					if(currentpos[0][0] - lastpos[0][0] != 0){
						if(board[currentpos[0][0]][currentpos[0][1] + currentpos[0][0] - lastpos[0][0]] === undefined){
							nextpos = [currentpos[0][0],currentpos[0][1] + currentpos[0][0] - lastpos[0][0]];
							current_diff = find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
					else if(board[currentpos[0][0] + currentpos[0][1] - lastpos[0][1]][currentpos[0][1]] === undefined){
						nextpos = [currentpos[0][0] + currentpos[0][1] - lastpos[0][1],currentpos[0][1]];
						current_diff = find_diff(currentpos,nextpos,lastpos);
						console.log(current_diff)
						console.log(nextpos)
					}
				}
			}
			// console.log("before find_diff")
			// console.log("after find_diff")
			if(current_diff > max_diff){
				max_diff = current_diff;
				actual_next_pos = nextpos;
			}
			// console.log("for loop ended ",i," time")
		}

		if(nextpos.length != 0){
			direction = [actual_next_pos[0] - currentpos[0][0],actual_next_pos[1] - currentpos[0][1]];
			return direction;
		}
		else return undefined;
		// else
		// console.log("everything was ohk")
		
	}
	return ai();
}

if( 'undefined' != typeof global ) {
    module.exports = global.AI = AI;
}
