var game = {
	board: [null, null,null, null, null, null, null, null, null],
	winConditions: [ [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8] ],
	x: { value: 0, iconClass: 'fa fa-times' },
	o: { value: 1, iconClass: 'fa fa-circle-o' }
};

var player = {
	name: 'Player',
	turnCount: 0,
	value: null,
	iconClass: '',
	canMakeMove: false
};

var robot = {
	name: 'Robot',
	turnCount: 0,
	value: null,
	iconClass: '',
};

function setIcons() {
	var button = $(this).attr('id');
	if (button === 'x-button') {
		player.value = game.x.value;
		player.iconClass = game.x.iconClass;
		robot.value = game.o.value;
		robot.iconClass = game.o.iconClass;
	} 
	else if (button === 'o-button') {
		player.value = game.o.value;
		player.iconClass = game.o.iconClass;
		robot.value = game.x.value;
		robot.iconClass = game.x.iconClass;
	}
	$('.icon-button').addClass('hide');
	$('.turn-order-button').removeClass('hide');
}

function setInitialTurnOrder() {
	var button = $(this).attr('id');
	if (button === 'first-button') {
		setTurnTo(player.name);
	} 
	else if(button === 'last-button') {
		setTurnTo(robot.name);
	}
	$('.turn-order-button, #control-board h4').addClass('hide');
	$('#turn-indicator').removeClass('hide');
}

function setTurnTo(turn) {
	if (turn === player.name) {
		player.canMakeMove = true;
		$('#turn-indicator').text("Player's turn");
	}
	else if (turn === robot.name) {
		player.canMakeMove = false;
		$('#turn-indicator').text("Robot's turn");
		setTimeout(function() {
			robotMove();
		}, 1500);
	}
}

function playerMove() {
	if (player.canMakeMove === true) {
		var square = $(this);
		if (game.board[square.data('value')] === null) {
			game.board[square.data('value')] = player.value;
			square.addClass(player.iconClass);
			player.turnCount++;
			turnHandler(player);
		} 
	}
}

function robotMove() {
	var move = determineBestMove();
	game.board[move] = robot.value;
	$(".square[data-value='" + move +"']").addClass(robot.iconClass);
	robot.turnCount++;
	turnHandler(robot);
}

function turnHandler(user) {
	var opponent = user === player ? robot : player;
	if (user.turnCount >= 3) {
		var userWon = checkIfWon(user.value);
		if (userWon) {
			$('#turn-indicator').text('Game Over: ' + user.name + ' Wins');
			setTimeout(resetGame, 2000);
		}
		else if (user.turnCount + opponent.turnCount >= 9) {
			$('#turn-indicator').text('Game Over: Draw');
			setTimeout(resetGame, 2000);
		} 
		else {
			setTurnTo(opponent.name);
		}
	} 
	else {
		setTurnTo(opponent.name);
	}
}

function determineBestMove() {
	var bestMove;
	var corners = [0, 2, 6, 8];
	
	if (player.turnCount === 0) {
		return bestMove = 4;
	}
	else if (player.turnCount === 1 && robot.turnCount === 0) {
		if (game.board[4] === player.value) {
			return bestMove = corners[Math.floor(Math.random() * corners.length)];
		} else {
			return bestMove = 4;
		}
	} else {
		var bestCombo;
		var comboScore = null;
		var emptySquareCount = 3;
		var highestComboScore = -3;
		var playerSquareCount = 0;
		var robotSquareCount = 0;
		for (var x = 0; x < game.winConditions.length; x++) {
			comboScore = null;
			emptySquareCount = 3;
			robotSquareCount = 0;
			playerSquareCount = 0;
			for (var y = 0; y < game.winConditions[x].length; y++) {
				if (game.board[game.winConditions[x][y]] === robot.value) {
					if (player.turnCount === 2) {
						comboScore--;
					} else {
						comboScore++;
					}
					robotSquareCount++;
					emptySquareCount--;
				}
				else if (game.board[game.winConditions[x][y]] === player.value) {
					if (player.turnCount === 2) {
						comboScore++;
					} else {
						comboScore--;
					}
					playerSquareCount++;
					emptySquareCount--;
				}
			}
			if (emptySquareCount === 0) {
				comboScore = -3;
			}
			else if (playerSquareCount === 2 && emptySquareCount === 1) {
				comboScore = 3;
			}
			else if (robotSquareCount === 2 && emptySquareCount === 1) {
				comboScore = 4;
			}
			
			if (comboScore > highestComboScore) {
				highestComboScore = comboScore;
				bestCombo = game.winConditions[x];
			}
		}
		for (var b = 0; b < bestCombo.length; b++) {
			if (game.board[bestCombo[b]] === null) {
				bestMove = bestCombo[b];
				if (b == 1) return bestMove;
			}
		}	
	}
	return bestMove;
}

function checkIfWon(value) {
	var didWin;
	for (var x = 0; x < game.winConditions.length; x++) {
		didWin = true;
		for (var y = 0; y < game.winConditions[x].length; y++) {
			if (game.board[game.winConditions[x][y]] !== value) {
				didWin = false;
				break;
			}
		}
		if (didWin) {
			showWinningCombo(game.winConditions[x]);
			return true;
		} 
	}
	return false;
}

function showWinningCombo(combo) {
	$(".square[data-value!=" + combo[0]  + "]" + "[data-value!=" + combo[1] + "]" + "[data-value!=" + combo[2] +"]").addClass('low-opacity');
}

function resetGame() {
	game.board = [null, null, null, null, null, null, null, null, null];
	player.canMakeMove = false;
	player.turnCount = robot.turnCount = 0;
	player.value = robot.value = 0;
	player.iconClass = robot.iconClass = '';
	$('#turn-indicator, .turn-order-button').addClass('hide');
	$('.icon-button, #control-board h4').removeClass('hide');
	$('.square').removeClass(game.x.iconClass + ' ' + game.o.iconClass + ' ' + 'low-opacity');
}

$(function() {
    $('.icon-button').on('click', setIcons);
	$('.turn-order-button').on('click', setInitialTurnOrder);
	$('.square').on('click', playerMove);
});