'use strict';

document.getElementById('clear-cards').style.display = 'inline-block';

window.onbeforeunload = function() {
    return "Are you sure you want to leave the game?";
};

var count = 0;
var lastPlayer = 'computer';

var humanCard;
var humanCardNumber;
var computerCard;
var computerCardNumber;

var humanCards = [];
var computerCards = [];

var human = {
	population: 100,
	foodGained: 0,
	soldiersGained: 0,
	soldiers: function soldiers() {
		return Math.round((this.population / 10) + this.soldiersGained);
	},
	food: function food() {
		return Math.round(this.population * 2 + this.foodGained);
	}
};

var computer = {
	population: 100,
	foodGained: 0,
	soldiersGained: 0,
	soldiers: function soldiers() {
		return Math.round((this.population / 10) + this.soldiersGained);
	},
	food: function food() {
		return Math.round(this.population * 2 + this.foodGained);
	}
};

// GET CARDS
function getCards(cards) {
	while (cards.length <= 10) {
		var random = Math.ceil(Math.random() * 9);
		switch (random) {
			case 1:
				cards.push('recruit');
				cards.push(Math.ceil(Math.random() * 6));
				break;
			case 2:
				cards.push('ambush');
				cards.push(1 * Math.ceil(Math.random() * 3));
				break;
			case 3:
				cards.push('rampage');
				cards.push(10 * Math.ceil(Math.random() * 2));
				break;
			case 4:
				cards.push('harvest');
				cards.push(10 * Math.ceil(Math.random() * 2));
				break;
			case 5:
				cards.push('loot');
				cards.push(10 * Math.ceil(Math.random() * 2));
				break;
			case 6:
				cards.push('diplomacy');
				cards.push(5 * Math.ceil(Math.random() * 3));
				break;
			case 7:
				cards.push('coup');
				cards.push(10 * Math.ceil(Math.random() * 2));
				break;
			case 8:
				cards.push('traitors');
				cards.push(Math.ceil(Math.random() * 3));
				break;
			case 9:
				cards.push('growth');
				cards.push(10 * Math.ceil(Math.random() * 2));
				break;
		}
	}
};

function displayCards(cards) {
	var j = 1;
	for (var i = 0; i <= 12; i += 2) {

		var type = humanCards[i];
		var number = humanCards[i + 1];
		var index = i;

		var card = 'public/img/cards/' + type + number + '.svg';

		if (j <= 6) {
			document.getElementById([j]).innerHTML = '\n\t\t\t\t<div onclick="playCard(\'' + type + '\',' + number + ',' + index + ')"><img src="' + card + '" alt="Playing card"></div>\n\t\t\t';
			j++;
		}
	}
	document.getElementById('cards').style.display = 'inline-block';
};

// runs when user clicks on card 
function playCard(type, number, index) {
	var amount;
	switch (type) {
		case 'recruit':
			human.soldiersGained += number;
			break;
		case 'ambush':
			computer.soldiersGained -= number;
			computer.population -= number;
			break;
		case 'rampage':
			computer.foodGained -= computer.food() / 100 * number;
			break;
		case 'harvest':
			human.foodGained += human.food() / 100 * number;
			break;
		case 'loot':
			amount = computer.food() / 100 * number;
			computer.foodGained -= amount;
			human.foodGained += amount;
			break;
		case 'diplomacy':
			amount = computer.population / 100 * number;
			computer.population -= amount;
			human.population += amount;
			break;
		case 'coup':
			computer.population -= computer.population / 100 * number;
			break;
		case 'traitors':
			computer.soldiersGained -= number;
			computer.population -= number;
			human.soldiersGained += number;
			human.population += number;
			break;
		case 'growth':
			human.population += human.population / 100 * number;
			break;
	}

	displayScore();
	humanCards.splice(index, 2);
	humanCard = type;
	humanCardNumber = number;
	newTurn();
};

// NORMAL TURNS
function newTurn() {
	document.getElementById('human-played').style.display = 'none';
	document.getElementById('computer-played').style.display = 'none';
	document.getElementById('war-or-peace').style.display = 'none';
	document.getElementById('next').style.display = 'none';
	if (computer.food() <= 0 || human.food() <= 0) {
		human.food() <= 0 ? endGame('humanFood') : endGame('computerFood');
	} else if (computer.population <= 0 || human.population <= 0) {
		human.population <= 0 ? endGame('humanPopulation') : endGame('computerPopulation');
	} else if (computer.soldiers() <= 0 || human.soldiers() <= 0) {
		human.soldiers() <= 0 ? endGame('humanSoldiers') : endGame('computerSoldiers');
	} else if ((count === 9 || count === 19) && lastPlayer === 'computer') {
		count++;
		displayWarOrPeace();
	} else if (lastPlayer === 'human') {
		document.getElementById('human-played').innerHTML = '\n\t\t\t<img src="public/img/cards/' + humanCard + humanCardNumber + '.svg" alt="Playing card"><br><p>Your card</p>\n\t\t';
		lastPlayer = 'computer';
		computerTurn();
	} else if (lastPlayer === 'computer') {
		lastPlayer = 'human';
		count++;
		getCards(humanCards);
		getCards(computerCards);
		displayCards(humanCards);
		document.getElementById('clear-cards').style.display = 'inline-block';
		document.getElementById('round').innerHTML = '<strong>Round ' + count + '</strong>';
	}
};

function clearCards() {
	if (lastPlayer === 'human') {
		humanCards = [];
		humanCard = 'get-new-cards';
		humanCardNumber = 1;
		newTurn();
	} else {
		computerCards = [];
		computerCard = 'get-new-cards';
		computerCardNumber = 1;
	}
};

function displayScore() {
	document.getElementById('round').innerHTML = '<strong>Round ' + count + '</strong>';
	document.getElementById('human-score').innerHTML = '\n\t\t<p>\n\t\t\t<strong>You</strong><br>' + Math.round(human.population) + ' \n\t\t\tPopulation<br>' + human.soldiers() + ' \n\t\t\tSoldiers<br>' + human.food() + ' \n\t\t\tFood \n\t\t</p>\n\t';
	document.getElementById('computer-score').innerHTML = '\n\t\t<p>\n\t\t\t<strong>Robots</strong><br>' + Math.round(computer.population) + ' \n\t\t\tPopulation<br>' + computer.soldiers() + '\n\t\t\tSoldiers<br>' + computer.food() + '\n\t\t\tFood \n\t\t</p>\n\t';
};

// WAR OR PEACE
function displayWarOrPeace() {
	displayScore();
	document.getElementById('cards').style.display = 'none';
	document.getElementById('war-or-peace').style.display = 'inline-block';
	document.getElementById('button').innerHTML = '<a onclick="warOrPeace()" class="buttons">Skip</a>';
	if (human.soldiers() > computer.soldiers()) {
		document.getElementById('war').innerHTML = '\n\t\t\t<div onclick="warOrPeace(\'war\')"><img src="public/img/cards/war.svg" alt="War card">';
	} else {
		document.getElementById('war').innerHTML = 'You do not have enough soliders to play war';
	}
	if (human.food() > 200) {
		document.getElementById('peace').innerHTML = '\n\t\t\t<div class="war-or-peace" onclick="warOrPeace(\'peace\')"><img src="public/img/cards/peace.svg" alt="Peace card"></div>\n\t\t'
	} else {
		document.getElementById('peace').innerHTML = 'You do not have enough food to play peace';
	}
};

function warOrPeace(humanOption) {
	var warBenefit = computer.soldiers() * 2;
	var peaceBenefit = computer.population / 2;
	var computerChoice;
	var decreaseHumanPopulation;
	var increaseComputerPopulation;
	var number1;
	var number2;
	// Computer chooses war or peace and saves its effect without playing it
	if (computer.soldiers() > human.soldiers() && (warBenefit > peaceBenefit || computer.food() < 200)) {
		decreaseHumanPopulation = computer.soldiers() * 3;
		computerChoice = 'war';
	} else if (computer.food() >= 200) {
		increaseComputerPopulation = Math.round(computer.population) / 2;
		computerChoice = 'peace';
	} else { computerChoice = 'none'; }

	// human card played
	if (humanOption === 'war') {
		computer.population -= human.soldiers() * 3;
		number1 = 'Opponent population is reduced by ' + human.soldiers() * 3;
	} else if (humanOption === 'peace') {
		// var increaseHumanPopulation = Math.round(human.population) / 2;
		number1 = 'Population is increased by ' + Math.round(human.population / 2);
		human.population += Math.round(human.population) / 2;
	} else {
		number1 = 'No change to population';
		humanOption = 'none';
	}

	// computer card played
	if (computerChoice === 'war') {
		human.population -= decreaseHumanPopulation;
		number2 = 'Opponent population is reduced by ' + Math.round(decreaseHumanPopulation);
	} else if (computerChoice === 'peace') {
		computer.population += increaseComputerPopulation;
		number2 = 'Population is increased by ' + Math.round(increaseComputerPopulation);
	} else {
		number2 = 'No change to population';
	}

	displayWarResult(humanOption, computerChoice, number1, number2);
};

function displayWarResult(humanChoice, computerChoice, number1, number2) {


	document.getElementById('war').innerHTML = 'You chose ' + humanChoice + '. ' + number1;
	document.getElementById('peace').innerHTML = 'The robots chose ' + computerChoice + '. ' + number2;
	if (count < 15) {
		document.getElementById('button').innerHTML = '<a onclick="newTurn()" class="buttons">NEXT ROUND</a>';
		displayScore();
	}
	else {
		document.getElementById('cards').style.display = 'none';
		document.getElementById('button').innerHTML = '<a onclick="end()" class="buttons">NEXT ROUND</a>';
	} 
};

function end() {
	human.population >= computer.population ? endGame('human21') : endGame('computer21');
};



// COMPUTER AI
function computerTurn() {
	document.getElementById('cards').style.display = 'none';
	document.getElementById('human-played').style.display = 'inline-block';
	document.getElementById('computer-loading').style.display = 'inline-block';
	logic();
	function wait() {
		document.getElementById('computer-loading').style.display = 'none';
		document.getElementById('computer-played').style.display = 'inline-block';
		document.getElementById('computer-played').innerHTML = '\n\t\t\t<img src="public/img/cards/' + computerCard + computerCardNumber + '.svg" alt="Playing card"><br><p>Robots card</p>\n\t\t';
		document.getElementById('next').style.display = 'inline-block';
		displayScore();
	}setTimeout(wait, 1400);
};

function logic() {
	var myarray = [];
	// loop though each card in computerCards array. Assign a value to each card and find the card with the highest value
	for (var i = 0; i <= 11; i += 2) {
		var number = computerCards[i + 1];
		var value;
		// console.log('Card: ' + computerCards[i]);
		// console.log('Number: ' + computerCards[i+1]);
		switch (computerCards[i]) {
			// food
			case 'rampage':
				value = number / 20 * 1.1;
				computer.food() < 250 ? value = value * 1.3 : value = value;
				computer.food() < human.food() ? value = value * 1.5 : value = value;
				break;
			case 'harvest':
				value = number / 20 * 1.3;
				computer.food() < 250 ? value = value * 1.3 : value = value;
				computer.food() < human.food() ? value = value * 1.4 : value = value;
				break;
			case 'loot':
				value = number / 20 * 1.5;
				computer.food() < 250 ? value = value * 1.3 : value = value;
				computer.food() < human.food() ? value = value * 1.4 : value = value;
				break;
				// soldiers
			case 'recruit':
				value = number / 6 * 2.4;
				computer.soldiers() < 5 ? value = value * 2 : value = value;
				computer.soldiers() < human.soldiers() ? value = value * 1.4 : value = value;
				break;
			case 'ambush':
				value = number / 6 * 2.4;
				if (computer.soldiers() < 5 || human.soldiers() > 15 || human.soldiers() < 5) {
					value = value * 2;
				}
				computer.soldiers() < human.soldiers() ? value = value * 1.4 : value = value;
				break;
			case 'traitors':
				value = number / 3 * 2.8;
				if (computer.soldiers() < 5 || human.soldiers() > 15 || human.soldiers() < 5) {
					value = value * 2;
				}
				computer.soldiers() < human.soldiers() ? value = value * 1.4 : value = value;
				break;
				// population
			case 'diplomacy':
				value = number / 15 * 4;
				count > 10 ? value = value * 1.1 : value = value;
				human.population > computer.population ? value = value * 2 : value = value;
				break;
			case 'coup':
				value = number / 20 * 3;
				count > 10 ? value = value * 1.1 : value = value;
				human.population > computer.population ? value = value * 2 : value = value;
				break;
			case 'growth':
				value = number / 30 * 4;
				count > 10 ? value = value * 1.1 : value = value;
				human.population > computer.population ? value = value * 2 : value = value;
				break;
		}
		// console.log('Value: ' + value);
		// console.log('________');
		myarray.push(value);
	}
	var maxN = Math.max.apply(null, myarray);
	if (maxN < 1.5 && count < 18) {
		clearCards();
	} else {
		var index = myarray.reduce(function (iMax, x, i, arr) {
			return x > arr[iMax] ? i : iMax;
		}, 0);
		var type = computerCards[index * 2];
		var number = computerCards[index * 2 + 1];
		var index = [index * 2];
		computerPlayCard(type, number, index);
		computerCard = type;
		computerCardNumber = number;
	}
};

function computerPlayCard(type, number, index) {
	var amount;
	switch (type) {
		case 'recruit':
			computer.soldiersGained += number;
			break;
		case 'ambush':
			human.soldiersGained -= number;
			human.population -= number;
			break;
		case 'rampage':
			human.foodGained -= human.food() / 100 * number;
			break;
		case 'harvest':
			computer.foodGained += computer.food() / 100 * number;
			break;
		case 'loot':
			amount = human.food() / 100 * number;
			human.foodGained -= amount;
			computer.foodGained += amount;
			break;
		case 'diplomacy':
			amount = human.population / 100 * number;
			human.population -= amount;
			computer.population += amount;
			break;
		case 'coup':
			human.population = human.population - (human.population / 100 * number);
			break;
		case 'traitors':
			human.soldiersGained -= number;
			human.population -= number;
			computer.soldiersGained += number;
			computer.population += number;
			break;
		case 'growth':
			computer.population += computer.population / 100 * number;
			break;
	}
	computerCards.splice(index, 2);
	computerCard = type;
};

function endGame(reason) {
	var who;
	var why;
	switch (reason) {
		case 'human21':
			who = 'You';
			why = 'You have more population!';
			break;
		case 'computer21':
			who = 'The robots';
			why = 'The robots have more population.';
			break;
		case 'humanWar':
			who = 'You';
			why = 'You won the war!';
			break;
		case 'humanPeace':
			who = 'You';
			why = 'You have more food.';
			break;
		case 'computerWar':
			who = 'The robots';
			why = 'The robots won the war!';
			break;
		case 'computerPeace':
			who = 'The robots';
			why = 'The robots won the war.';
			break;
		case 'draw':
			who = 'Nobody gets to';
			why = 'It\'s a draw!';
			break;
		case 'humanFood':
			who = 'The robots';
			why = 'You have no food!';
			break;
		case 'computerFood':
			who = 'You';
			why = 'The robots have no food!';
			break;
		case 'humanSoldiers':
			who = 'The robots';
			why = 'You have no soldiers to defend your people!';
			break;
		case 'computerSoldiers':
			who = 'You';
			why = 'The robots have no soldiers to defend themselves!';
			break;
		case 'humanPopulation':
			who = 'The robots';
			why = 'You have no people left!';
			break;
		case 'computerPopulation':
			who = 'You';
			why = 'There are no robots left!';
			break;
	}
	displayScore();
	document.getElementById('war-or-peace').style.display = 'none';
	document.getElementById('winner').style.display = 'inline-block';
	document.getElementById('winner').innerHTML = '\n\t\t<h1>' + why + ' <br>' + who + ' win!</h1>\n\t\t<a onclick="newGame();" class="buttons mid-button">Play again?</a>';

	var won;
	if (who === 'You') {
		won = 1;
	} else {
		won = 0;
	}
	var reason = 7;
	var url = 'save/' + won + '/' + reason;
	callAjax(url);

};

newTurn();
displayScore();

function newGame() {
	document.getElementById('clear-cards').style.display = 'inline-block';

	document.documentElement.scrollTop = 0;

	count = 0;
	lastPlayer = 'computer';

	humanCards = [];
	computerCards = [];

	human.population = 100;
	human.foodGained = 0;
	human.soldiersGained = 0;

	computer.population = 100;
	computer.foodGained = 0;
	computer.soldiersGained = 0;

	human.soldiers();
	computer.soldiers();
	human.food();
	computer.food();

	document.getElementById('winner').style.display = 'none';

	document.body.scrollTop = document.documentElement.scrollTop = 0;
	newTurn();
	displayScore();
};


function callAjax(url){
	var params = "_token=" + window.Laravel['csrfToken'];
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            // console.log(xmlhttp.responseText);
            // alert('sent');
        }
        // console.log(xmlhttp.responseText);
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // xmlhttp.send();
    xmlhttp.send(params);
};






