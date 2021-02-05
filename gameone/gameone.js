//Глобальные переменные
var ballX = 150; // Позиция мяча относительно x.
var ballY = 280; // Позиция мяча относительно y.
var ballDY = 0; // Изменение мяча в y позиции.
var blockX = 0; // Позиция зоны куда надо попасть относительно x.
var blockW = 75; // Ширина зоны куда нужно попасть.
var checkBall = 0;
var ballMotion = 0;
var score = 0;

// Вызывается при загрузке страницы
function drawGameSVG() {
    // Play the game until the ball stops.
    gameLoop = setInterval(drawBall, 16);
	generateGame();
    // Add keyboard listener.
    window.addEventListener('keydown', whatKey, true);
}

//Создает новую игру
function newGame () {
	clearInterval(gameLoop);
	score = 0;
	ballX = 150;
	ballY = 280;
	ballMotion = 0;
	checkBall = 0;
	document.getElementById('text4').innerHTML = ' ';
	drawGameSVG();	
}

//Изменяет положение мяча на поле
function drawBall() {
    ballY += ballDY;
    ball.setAttribute("cx", ballX);
    ball.setAttribute("cy", ballY); 
    if (ballY + ballDY < 50) {
		ballDY = 0;
		ballMotion = 0;
		checkBall = 1;
	}
	checkWin();
}

//Проверка на правильность попадания мяча
function checkWin() {
	/*Если мяч остановился и  попал в нужный блок,
	то сгенерировать новое задание и обновить поле и к счету прибавить +1 иначе проигрыш*/
	if (ballX > blockX && ballX < blockX + blockW && checkBall) {
		ballX = 150;
		ballY = 280;
		checkBall = 0;
		score =  score + 1;
		generateGame();
	} else if (checkBall){
		document.getElementById('text4').innerHTML = 'Проиграл';
		clearInterval(gameLoop);
	}
}

// Массив с выражением
var tasks = [];
// Массив с ответами
var answers = [];
// Минимальные и максимальные значения ответов
var minA = 1;
var maxA = 9;
// Минимальное и максимальное значение элемента выражения
var minT = 1;
var maxT = 9;
// Минимальное и максимальное значение блока
var minBlock = 0;
var maxBlock = 3;
// Значение в каком блоке будет храниться ответ
var trueBlock; 
var numberOfTaskOperators = 2;

//Проверяет выбранный режим
function checkRadio () {
	var check = document.getElementById("option-1").checked;
	if ( check ) {
		minT = 1;
		maxT = 9;
		minA = 1;
		maxA = 9;
	} else {
		minT = 10;
		maxT = 31;
		minA = 10;
		maxA = 31;
		var textX = 32;
		for  (var i = 0; i < maxBlock + 1; i++) {
			document.getElementById('text' + i).setAttribute("x", textX);
			textX += 70;
		}
	}
}

//Создает новое игровое поле с заданным режимом игры
function changeMode () {
	checkRadio();
	clearInterval(gameLoop);
	score = 0;
	ballX = 150;
	ballY = 280;
	ballMotion = 0;
	checkBall = 0;
	document.getElementById('text4').innerHTML = ' ';
	drawGameSVG();
}

// Генерация значений элементов выражения
function generateTasks() {
	tasks = [];
	for (var i = 0; i < numberOfTaskOperators; i++) {
		tasks.push(getRandomInt(minT, maxT));
	}
}

/*
// Генерация значений элементов выражения
function generateTasks() {
	tasks = [];
	for (var i = 0; i < numberOfTaskOperators; i++) {
		tasks.push(getRandomInt(minT, maxT));
	}
}
*/

//Генерация игры
function generateGame() { 
	generateTasks();
	generateAnswers();
	trueRect();
	
	document.getElementById('task').innerHTML = dividend + ' разделить на ' + tasks[1] +' = ... ?'; 
	document.getElementById('score').innerHTML = 'Счет: ' + score;
		
	for (var i = 0; i < numberOfAnswers; i++) {
		document.getElementById('text' + i).innerHTML = answers[i];
	}
}

//Количетсво ответов на поле
var numberOfAnswers = 4; 
// Генерация ответов
var dividend = 0;

//Генерация ответов
function generateAnswers() {
	answers = [];
	trueBlock = getRandomInt(minBlock, maxBlock);
	dividend = tasks[0]*tasks[1];
		
	for (var i = 0; i < numberOfAnswers; i++){
		if(parseInt(trueBlock) == i) {
			answers[i] = tasks[0];
		} else {
			var item;
			do {
				item = getRandomInt(minA, maxA);
			} while(answers.indexOf(item) >= 0 || item == tasks[0]);
			answers[i] = item;
		}
	}
};

//Генерация случайного числа
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Координаты правильного блока
function trueRect() {
	switch (trueBlock) {
		case 0:
			blockX = 0;
			break;
		case 1:
			blockX = 75;
			break;
		case 2:
			blockX = 150;
			break;
		case 3:
			blockX = 225;
			break;	
	}
} 

// Обрабатывает события нажатия на клавиатуру
function whatKey(evt) {
    switch (evt.keyCode) {
		// Стрелка влево.
		case 37:
			if (ballMotion == 0) {
				ballX = ballX - 10;
				if (ballX < 10) ballX = 10;
				ball.setAttribute("сx", ballX);
			}
          break;
        // Стрелка вправо.
        case 39:
			if (ballMotion == 0) {
				ballX = ballX + 10;
				if (ballX > 290) ballX = 290;
				ball.setAttribute("сy", ballX);
			}
          break;
		// Стрелка вверх
		case 38:
			ballMotion = 1;
			ballDY = -2;
        break;  
    }
}