//Вызывает функции при загрузке окна
window.onload = function() {
	generateGame();	
}

// Минимальное и максимальное значение элемента выражения
var minT = 0;
var maxT = 10;
// Минимальные и максимальные значения ответов	
var minA = 0;
var maxA = 10;
function checkRadio () {
	var check = document.getElementById("option-1").checked;
	if ( check ) {
		minT = 0;
		maxT = 10;
		minA = 0;
		maxA = 10;
	} else {
		minT = 11;
		maxT = 99;
		minA = 11;
		maxA = 99;
	}
}

function changeMode () {
	checkRadio();
	checkWin = false;
	level = 1;
	document.getElementById('balloons').innerHTML = "";
	generateGame();
}
//Новая игра
function newGame() {
	checkWin = false;
	level = 1;
	document.getElementById('balloons').innerHTML = "";
	generateGame();
}

function soundClick() {
  var audio = new Audio(); // Создаём новый элемент Audio
  audio.src = 'win.mp3'; // Указываем путь к звуку "клика"
  audio.autoplay = true; // Автоматически запускаем
}

function checkNextLevel() {
	if (checkWin) {
		soundClick();
		document.getElementById('message').innerText = "Молодец!";
	} else {
		document.getElementById('message').innerText = "Не вижу шара в небе!";
	}
	setTimeout(nextLevel, 2000);
}
function nextLevel() {
	document.getElementById('message').innerText = "";
	if ( checkWin ) {
		checkWin = false;
		level++;
		document.getElementById('balloons').innerHTML = "";
		generateGame();
	}
}

function actionBall(id) {
	if ( id == 'ball' + trueBall ) {
			//checkTrue = true;
			drawFly(id);
			checkWin = true;
		} else if(!checkWin) {
			drawOpaсity(id);
		}	
}

//Переменная для хранения результата игры
var checkWin = false;

//Создает анимацию полета шара
function drawFly(id) {
	document.getElementById(id).style.top = 50 + 'px';//400 - timePassed / 5 + 'px';
}

//Создает анимацию исчезновения шара
function drawOpaсity(id) {
	document.getElementById(id).style.opacity = 0;
}

// Значение в каком шаре будет храниться ответ
var trueBall;
//Текущий уровень игры
var level = 1;
// Количество шаров
var numberOfAnswers = 0;

//Генерация игры
function generateGame() { 
	var tasks = generateTasks();
	if ( level <= 4) {
		numberOfAnswers = level + 1;
	} else {
			numberOfAnswers = 6;
		}
	var answers = generateAnswers(numberOfAnswers, tasks);
	
	creatBall(answers);
	
	document.getElementById('task').innerHTML = 'Чему равно: ' + tasks.join(' - ') + ' = ?'; 
	document.getElementById('level').innerHTML = 'Уровень: ' + level;
}		
			
//Создание шаров и навешивание на них событий
function creatBall(answers) {
	for (var i = 0; i < answers.length; i++) {
		var span = document.createElement("span");
		span.setAttribute("class", "ballspan");
		span.innerText = answers[i];
		var div = document.createElement("div");
		div.setAttribute("id", "ball" + i);
		div.appendChild(span);
		document.querySelector(".balloon").appendChild(div);
	}
	for (var i = 0; i < numberOfAnswers; i++) {
		document.getElementById('ball' + i).onclick = function(e) {
			var elem = e ? e.target : window.event.srcElement;
			while(!(elem.id || (elem == document.getElementById('ball' + i)))) elem = elem.parentNode;
			if (!elem.id) return; else id = elem.id;
			actionBall(id);
		}
	}
}

// Генерация значений элементов выражения
function generateTasks() {
	
	//Число элементов выражения
	var numberOfTaskOperators = 2;
	//Массив элементов выражения
	tasks = [];
	//Элемент выражения
	var numberOfTask;
	for (var i = 0; i < numberOfTaskOperators; i++) {
		numberOfTask = getRandomInt(minT, maxT);
		if (tasks.length == 0){
			tasks.push(numberOfTask);
		} else  {
			var item;
			do {
				item = getRandomInt(minT, maxT);
			} while(tasks[0] <= item);
			tasks[i] = item;
		}	
	}
	return tasks;
}
 
// Генерация ответов
function generateAnswers(numberOfAnswers, tasks) {
	var answers = [];
	trueBall = getRandomInt(0, numberOfAnswers - 1);
	var trueSum = tasks.reduce(function(a,b) { return a-b;});
		
	for (var i = 0; i < numberOfAnswers; i++){
		if(parseInt(trueBall) == i) {
			answers[i] = trueSum;
		} else {
			var item;
			do {
				item = getRandomInt(minA, maxA);
			} while(answers.indexOf(item) >= 0 || item == trueSum);
				answers[i] = item;
		}	
	}
	return answers;
}

//Генерация случайного числа
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}