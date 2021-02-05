//Вызывает функции при загрузке окна
window.onload = function() {
	generateGame();
	creatClickColor();
	creatClickPetal();
}

// Значение в каком шаре будет храниться ответ
var truePetal;
//Текущий пример 
var currentExample = 1;
// Количество шаров
var numberOfPetal = 6;
//Цвет которым будет перекрашиваться лепесток
var currentColor = 'pink';
//Флаг перекраски
var flagPainting = false;
//Флаг правильного выполнения задания
var flagTrueComplete = false;
// Минимальное и максимальное значение элемента выражения
var minT = 1;
var maxT = 9;
// Минимальные и максимальные значения ответов
var minA = 1;
var maxA = 9;

//Проверяет выбранный режим игры
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
		document.getElementById('answer').style.width = 120 + 'px';
		document.getElementById('center').style.fontSize = 60 + 'px';
	}
}

//Меняет игровое поле в зависимости от выбранного режима
function changeMode () {
	checkRadio();
	currentExample = 1;
	refreshField();
	clearPetal();
	generateGame();
}

//Обновляет поле, и создает новую игру
function newGame() {
	currentExample = 1;
	refreshField();
	clearPetal();
	generateGame();
}

//Воспроизведение звукового эффекта
function soundClick() {
  var audio = new Audio(); // Создаём новый элемент Audio
  audio.src = 'win.mp3'; // Указываем путь к звуку "клика"
  audio.autoplay = true; // Автоматически запускаем
}

//Проверяет возможность перехода к другому примеру
function checkNextLevel() {
	if (flagTrueComplete) {
		soundClick();
		document.getElementById('message').innerText = "Молодец!";
	} else {
		document.getElementById('message').innerText = "Неправильно, попробуй другой!";
	}
	setTimeout(nextLevel, 2000);
}

//Обновляет  и создает поле с новым примером.
function nextLevel() {
	document.getElementById('message').innerText = "";
	if ( flagTrueComplete ) {
		refreshField();
		currentExample++;
		clearPetal();
		generateGame();
	} else {
		refreshField();
	}
}

//Очищаем лепестки от старых значений
function clearPetal () {
	for (var i = 0; i < numberOfPetal; i++) {
		document.getElementById("petal" + i).innerHTML = "";
	}
}

//Добавляем задание и ответы на поле
function addTaskAndAnswers (tasks, answers) {
	for (var i = 0; i < numberOfPetal; i++) {
		var span = document.createElement("span");
		span.setAttribute("class", "text");
		span.innerText = answers[i] + '.';
		document.getElementById("petal" + i).appendChild(span);
	}
	document.getElementById('center').innerHTML = tasks[0] + '*';
	document.getElementById("answer").innerText = tasks[0]*tasks[1];
}

//Генерация игры
function generateGame() { 
	var tasks = generateTasks();
	var answers = generateAnswers(tasks);
	addTaskAndAnswers(tasks, answers);
	 
	document.getElementById('level').innerHTML = 'Пример №: ' + currentExample;
}

//Создает oneclick на цветах в палитре
function creatClickColor () {
	//Количество цветов в палитре
	var numberOfColor = 3;
	for (var i = 0; i < numberOfColor; i++) {
		document.getElementById('color' + i).onclick = function(e) {
			var elem = e ? e.target : window.event.srcElement;
			while(!(elem.id || (elem == document.getElementById('color' + i)))) elem = elem.parentNode;
			if (!elem.id) return; else id = elem.id;
			changeCurrentColor(id);
		}
	}
}

//Сбрасываем цвет которым перекашиваем и цвета лепестков
function refreshField () {
	for (var i = 0; i < numberOfPetal; i++) {
		document.getElementById('petal' + i).style.backgroundColor = 'red';
	}
	currentColor = 'pink';
	flagPainting = false;
	flagTrueComplete = false;
	document.getElementById('center').style.backgroundColor = 'yellow';
}

//Меняет цвет которым перекрашиваем лепестки
function changeCurrentColor (id) {
	var computedStyle = getComputedStyle(document.getElementById(id));
	currentColor = computedStyle.backgroundColor;
}

//Создает oneclick на лепестках цветка
function creatClickPetal () {
	for (var i = 0; i < numberOfPetal; i++) {
		document.getElementById('petal' + i).onclick = function(e) {
			var elem = e ? e.target : window.event.srcElement;
			while(!(elem.id || (elem == document.getElementById('petal' + i)))) elem = elem.parentNode;
			if (!elem.id) return; else id = elem.id;
			changeColorPetal(id);
		}
	}
}

//Меняет цвет лепестка и проверяет правильность выполнения задания
function changeColorPetal (id) {
	if (!flagPainting) {
		document.getElementById(id).style.backgroundColor = currentColor;//400 - timePassed / 5 + 'px';
		flagPainting = true;
		if ( id == ('petal' + truePetal)) {
			flagTrueComplete = true;
			document.getElementById('center').style.background = 'lime';
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
		tasks.push(numberOfTask);	
	}
	return tasks;
}
 
// Генерация ответов
function generateAnswers(tasks) {
	// Минимальные и максимальные значения ответов
	var answers = [];
	truePetal = getRandomInt(0, numberOfPetal - 1);		
	for (var i = 0; i < numberOfPetal; i++){
		if(parseInt(truePetal) == i) {
			answers[i] = tasks[1];
		} else {
			var item;
			do {
				item = getRandomInt(minA, maxA);
			} while(answers.indexOf(item) >= 0 || item == tasks[1]);
				answers[i] = item;
		}	
	}
	return answers;
}

//Генерация случайного числа
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}