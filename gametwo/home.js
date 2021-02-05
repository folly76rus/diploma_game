document.addEventListener("DOMContentLoaded", function(event) {
    addDragZone();
	generateGame();
});

//Правильный ответ
var correctAnswer;
//Текущий пример 
var currentExample = 1;
//Заполненные окна
var filledWindows = [];
//Окна которыми надо заполнять
var windowsInBox = [];
//Количетсво заполненных этажей
var numberOfFilledFloor;
//Номера случайных этажей
var numberRandomFloor = [];
//Номера заполненных окон
var numberRandomWindows = [];
var minAnswer = 0;
var maxAnswer = 9;


function addDragZone () {
	const lists = document.querySelectorAll(".dragZone");

    for (var i = 0; i < lists.length; i++) {
      new MyDragZone(lists[i]);
      new MyDropTarget(lists[i]);
    }
}


function checkRadio () {
	var check = document.getElementById("option-1").checked;
	if ( check ) {
		minAnswer = 0;
		maxAnswer = 9;
	} else {
		minAnswer = 10;
		maxAnswer = 100;
	}
}

function changeMode () {
	checkRadio();
	currentExample = 1;
	deleteWindows();
	generateGame();
}
//Проверка на правильность
function checkWin () {
	var flagWin = 0;
	var sum = 0;
	var numberOfWindows = 6;
	for (var i = 0; i < numberOfWindows; i += 2) {
		sum = 0;
		var a = parseInt(document.getElementById('window' + i).innerText);
		var b = parseInt(document.getElementById('window' + (i + 1)).innerText);
		sum = a + b;
		if (sum == correctAnswer) flagWin++;
	}
	if (flagWin == 3) {
		return true;
	} else {
		return false;
	}
}
//Удаляем старые окна
function deleteWindows () {
	var numberOfWindows = 6;
	for ( i = 0; i < numberOfWindows; i++) {
		document.getElementById('window' + i).innerHTML = "";
	}
	document.getElementById('windowsBox').innerHTML = "";
}
//Новая игра
function newGame () {
	currentExample = 1;
	deleteWindows();
	generateGame();
}
//Cледующий пример
function checkNextLevel () {
	if (checkWin()) {
		soundClick();
		document.getElementById('message').innerText = "Молодец!";
	} else {
		document.getElementById('message').innerText = "Неверно, исправь!";
	}
	setTimeout(nextLevel, 2000);	
}

function soundClick() {
  var audio = new Audio(); // Создаём новый элемент Audio
  audio.src = 'win.mp3'; // Указываем путь к звуку "клика"
  audio.autoplay = true; // Автоматически запускаем
}

function nextLevel () {
	document.getElementById('message').innerText = "";
	if (checkWin()) {
		currentExample++;
		deleteWindows();
		generateGame();
	} 
}

//Создаем игровое поле
function generateGame () {
	generateTaskAndAnswers();
	generateNumberRandomFloors();
	generateNumberRandomWindows();
	insertIntoWindowsAndBox();
	document.getElementById('example').innerHTML = 'Пример № ' + currentExample;
}

//Генерация номеров случайных окон
function generateNumberRandomWindows () {
	numberRandomWindows = [];
	for (var i = 0; i < numberOfFilledFloor; i++) {
		var randomWindow = getRandomInt(0,1);
		numberRandomWindows[i] = 2 * numberRandomFloor[i] + randomWindow;
	}
}

// Сравниваем случайно
function compareRandom (a, b) {
	return Math.random() - 0.5;
}

// Вставка в окна и в коробку с окнами
function insertIntoWindowsAndBox () {
	//filledWindows
	//numberRandomFloor
	filledWindows.sort(compareRandom);
	for ( i = 0; i < numberOfFilledFloor; i++) {
		var div = document.createElement("div");
		div.setAttribute("class", "light");
		div.innerHTML = filledWindows[i];
		document.getElementById('window' + numberRandomWindows[i]).appendChild(div);
	}		
	windowsInBox.sort(compareRandom);
	for ( i = 0; i < windowsInBox.length; i++) {
		var div = document.createElement("div");
		div.setAttribute("class", "light dragble");
		div.innerHTML = windowsInBox[i];
		document.getElementById('windowsBox').appendChild(div);
	}
}
//Генерация какие этажы будут заполнены, номера этажей не должны повторятся
function generateNumberRandomFloors () {
	var minFloor = 0;
	var maxFloor = 2;
	numberRandomFloor = [];
	
	for(var i = 0; i < numberOfFilledFloor; i++) {
		var item;
		do {
			item = getRandomInt(minFloor, maxFloor);
		} while(numberRandomFloor.indexOf(item) >= 0);
		numberRandomFloor.push(item);
	}
}

//Генерация ответов
function generateTaskAndAnswers () {
	filledWindows = [];
	windowsInBox = [];
	correctAnswer = getRandomInt(minAnswer + 4, maxAnswer);
	document.getElementById('answer').innerHTML = correctAnswer;
	var numberOfFloors = 3;
	var numberOfWindows = 6;
	
	if (currentExample <= 3) {
		numberOfFilledFloor = 4 - currentExample;
	} else {
		numberOfFilledFloor = 0;
	}
	
	for (var i = 0; i < numberOfFloors; i++) {
		var item;
			do {
				item = getRandomInt(minAnswer, correctAnswer - 1);
			} while(windowsInBox.indexOf(item) >= 0 || filledWindows.indexOf(item) >= 0 );
		//var item = getRandomInt(minAnswer, correctAnswer - 1);
		windowsInBox.push(correctAnswer - item);
		
		if (i < numberOfFilledFloor) {
			filledWindows.push(item);
		} else {
			windowsInBox.push(item);
		}
	}	
}

//Генерация случайного числа
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}