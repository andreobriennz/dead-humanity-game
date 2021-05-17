document.getElementById('clear-cards').style.display = 'inline-block';

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
	soldierRatio: 0.05,
	foodRatio: 3,
	foodLost: 0,
	solidersLost: 0,
	soldiers: function() {
       return Math.round(this.population * this.soldierRatio - this.solidersLost);
    },
    food: function() {
    	return Math.round(this.population * this.foodRatio - this.foodLost);
    }
};

var computer = {
	population: 100,
	soldierRatio: 0.05,
	foodRatio: 3,
	foodLost: 0,
	solidersLost: 0,
	soldiers: function() {
       return Math.round(this.population * this.soldierRatio - this.solidersLost);
    },
    food: function() {
    	return Math.round((this.population * this.foodRatio) - this.foodLost);
    }
};


// GET CARDS
function getCards(cards) {
	while (cards.length <= 10) {
		random = Math.ceil(Math.random() * 6);
		switch(random) {
		    case 1:
		    	cards.push('recruit');
		        cards.push(Math.ceil(Math.random() * 6));
		        break;
		    case 2:
		        cards.push('ambush');
		        cards.push(10 * (Math.ceil(Math.random() * 3)));
		        break;
		    case 3:
		        cards.push('rampage');
		        cards.push(10 * (Math.ceil(Math.random() * 2)));
		        break;
		    case 4:
		        cards.push('harvest');
		        cards.push(10 * (Math.ceil(Math.random() * 2)));
		        break;
		    case 5:
		        cards.push('loot');
		        cards.push(10 * (Math.ceil(Math.random() * 2)));
		        break;
		    case 6:
		        cards.push('diplomacy');
		        number = cards.push(5 * (Math.ceil(Math.random() * 3)));
		        break;
		    case 7:
		        cards.push('coup');
		        number = cards.push(10 * (Math.ceil(Math.random() * 2)));
		        break;
		}
	}
};

function displayCards(cards) {
	var j = 1;
	for (var i = 0; i <= 12; i += 2) {

		type = humanCards[i];
		number = humanCards[i+1];
		index = i;

		card = `img/cards/${type}${number}.svg`;

		if (j <= 6) {
			document.getElementById([j]).innerHTML = `
				<div onclick="playCard(\'${type}\',${number},${index})"><img src="${card}"></div>
			`;
			j++;
		}
	}
	document.getElementById('cards').style.display = 'inline-block';
};

function playCard(type, number, index) {
	// runs when user clicks on card 
	switch(type) {
		case 'recruit':
			human.soldierRatio = human.soldierRatio + (number / 100);
			break;
		case 'ambush':
			computer.solidersLost += ((computer.population * computer.soldierRatio) * (number / 100));
			break;
		case 'rampage':
			computer.foodLost += ((computer.population * computer.foodRatio) * (number / 100));
			break;
		case 'harvest':
			human.foodRatio = human.foodRatio + (number / 100);
			break;
		case 'loot':
			human.foodLost = human.foodLost - (computer.food() * (number / 100));
			computer.foodLost += computer.food() * (number / 100);
			break;
		case 'diplomacy':
			human.population += (computer.population * (number / 100));
			computer.population -= (computer.population * (number / 100));
			break;
		case 'coup':
			computer.population = computer.population - (computer.population / (number / 100));
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
	document.getElementById('next').style.display = 'none';
	if (computer.food() < 1 || human.food() < 1 || count === 20) {
		human.food() < 1 ? endGame('humanFood') : endGame('computerFood');
	} else if (count > 1 && count % 10 === 0 && lastPlayer === 'computer') {
		document.getElementById('cards').style.display = 'none';
		document.getElementById('war-or-peace').style.display = 'inline-block';
		document.getElementById('war-or-peace').innerHTML = `
			<div class="war-or-peace" onclick="warOrPeace(\'war\')"><img src="img/cards/war.svg"></div>
			<div class="war-or-peace" onclick="warOrPeace(\'peace\')"><img src="img/cards/peace.svg"></div>
		`;
	} else if (count === 21) {
		endGame(21);
	} else if (lastPlayer === 'human') {
		document.getElementById('human-played').innerHTML = `
			<img src="img/cards/${humanCard}${humanCardNumber}.svg"><br><p>Your card</p>
		`;
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
	document.getElementById('clear-cards').style.display = 'none';
	lastPlayer === 'human' ? humanCards = [] : computerCards = [];
	lastPlayer === 'human' ? humanCard = 'get new cards' : computerCard = 'get new cards';
	newTurn();
}

function displayScore() {
	document.getElementById('human-score').innerHTML = `
		<p>
			<strong>You</strong><br>
			Population ${Math.round(human.population)}<br>
			Soldiers ${human.soldiers()}<br>
			Food ${human.food()}
		</p>
	`;
	document.getElementById('computer-score').innerHTML = `
		<p>
			<strong>Robot</strong><br>
			Population ${Math.round(computer.population)}<br>
			Soldiers ${computer.soldiers()}<br>
			Food ${computer.food()}
		</p>
	`;
};


// WAR OR PEACE
function warOrPeace(humanOption) {
	lastPlayer = 'computer';
	count++;
	computer.soldiers() > human.soldiers() ? computerOption = 'war' : computerOption = 'peace';
	if ((humanOption === 'war') && (computerOption === 'war')) {
		war();
	} else if ((humanOption === 'peace') && (computerOption === 'peace')) {
		peace();
	} else {
		lastPlayer = 'computer';
		newTurn();
	} 
	document.getElementById('war-or-peace').style.display = 'none';
};

function war() {
	if (human.soldiers() > computer.soldiers()) {
		endGame('humanWar');
	} else if (computer.soldiers() > human.soldiers()) {
		endGame('computerWar');
	} else {
		document.getElementById('cards').style.display = 'inline-block';
		newTurn();
	}
};

function peace() {
	if (human.food() > computer.food()) {
		endGame('humanPeace');
	} else if (computer.food() > human.food()) {
		endGame('computerPeace');
	} else {
		document.getElementById('cards').style.display = 'inline-block';
		newTurn();
	}
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
		// document.getElementById('computer-played').innerHTML = 'Computer played ' + computerCard;
		document.getElementById('computer-played').innerHTML = `
			<img src="img/cards/${computerCard}${computerCardNumber}.svg"><br><p>Robots card</p>
		`;
		document.getElementById('next').style.display = 'inline-block';
		displayScore();
	} setTimeout(wait, 1400);
};

function logic() {
	var myarray = [];
	// loop though each card in computerCards array. Assign a value to each card and find the card with the highest value
	for (var i = 0; i <= 12; i += 2) {
		number = computerCards[i+1];

		switch(computerCards[i]) {
			case 'recruit':
				value = (number / 6) * 1.5;
				break;
			case 'ambush':
				value = (number / 30) * 1.3;
				break;
			case 'rampage':
				if (computer.food() <= human.food()) {
					value = (number / 20) * 1.3;
				} else {
					value = (number / 20) * 0.8;
				}
				break;
			case 'harvest':
				if (computer.food() <= human.food()) {
					value = (number / 20) * 1.5;
				} else {
					value = (number / 20) * 1;
				}
				break;
			case 'loot':
				if (computer.food() <= human.food()) {
					value = (number / 20) * 2.5;
				} else {
					value = (number / 20) * 1.5;
				}
				break;
			case 'diplomacy':
				value = (number / 15) * 5;
				break;
			case 'coup':
				if (computer.soliders() < human.soliders()) {
					value = (number / 20) * 1.5;
				} else {
					value = (number / 20) * 0.7;
				}
				break;	
		}
		myarray.push(value);
	}
	maxN = Math.max.apply(null, myarray);
	if (maxN < 1 && (count % 10 < 8)) {
		clearCards();
	}
	var index = myarray.reduce((function (iMax, x, i, arr) { return x > arr[iMax] ? i : iMax;}), 0);
	type = computerCards[(index * 2)];
	number = computerCards[(index * 2) + 1];
	index = [index * 2];
	computerPlayCard(type,number,index);
	computerCard = type;
	computerCardNumber = number;
};

function computerPlayCard(type, number, index) {
	switch(type) {
		case 'recruit':
			computer.soldierRatio = computer.soldierRatio + (number / 100);
			break;
		case 'ambush':
			human.solidersLost += ((human.population * human.soldierRatio) * (number / 100));
			break;
		case 'rampage':
			human.foodLost += ((human.population * human.foodRatio) * (number / 100));
			break;
		case 'harvest':
			computer.foodRatio = computer.foodRatio + (number / 100);
			break;
		case 'loot':
			computer.foodLost = computer.foodLost - (human.food() * (number / 100));
			human.foodLost += human.food() * (number / 100);
			break;
		case 'diplomacy':
			computer.population += (human.population * (number / 100));
			human.population -= (human.population * (number / 100));
			break;
		case 'coup':
			human.population = human.population - (human.population / (number / 100));
			break;
	}
	computerCards.splice(index, 2);
	computerCard = type;
};

function endGame(reason) {
	var who;
	var why;
	switch(reason) {
		case 21:
			who = 'test';
			why = 'test';
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
	}
	document.getElementById('winner').style.display = 'inline-block';
	document.getElementById('winner').innerHTML = `
		<h1>${why} <br>${who} win!</h1>
		<a onclick="location.reload();" class="buttons mid-button">Play Again?</a>
	`;
};



newTurn();
displayScore();
