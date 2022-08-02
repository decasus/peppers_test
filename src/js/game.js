function startGame() {
    const TIMEOUT = 60000;

    const gameField = document.querySelector('#gameField');
    const gameTask = document.querySelector('#gameTask');
    const gameMenu = document.querySelector('#gameMenu');

    const gameTime = document.querySelector('#gameTime');
    const gameLevel = document.querySelector('#gameLevel');
    const gameScore = document.querySelector('#gameScore');

    const resultScore = document.querySelector('#resultScore');
    const resultScoreVal = document.querySelector('#resultScoreVal');

    const gameTutorial = document.querySelector('#gameTutorial');

    const gameColors = ['green', 'blue', 'purple', 'pink', 'orange'];

    const itemAnimations = ['scale', 'blink', 'rotate'];
    const itemSizes = [1, 1, 1, 2, 2, 3, 4, 4, 4];

    const levelsLength = [6, 6, 6, 12, 12, 16, 25, 25, 25];
    const levelsPow = [1, 2, 3, 3, 3, 3, 4, 4, 4];

    let level = 0;
    let score = 0;
    let gameOver = false;

    gameScore.textContent = score;
    gameLevel.textContent = level;
    gameTutorial.style.display = 'none';
    resultScore.style.display = 'none';
    gameField.onclick = null;

    // Запускаем таймер

    const startTime = Date.now();

    const interval = setInterval(() => {
        const delta = Date.now() - startTime;
        gameTime.textContent = formatTime(TIMEOUT - delta);
    }, 100);

    const timeout = setTimeout(() => {
        gameOver = true;
        clearInterval(interval);
        clearTimeout(timeout);
        gameTime.textContent = '0:00';
    }, TIMEOUT);

     // Отображаем меню, задание и начинаем показывать блоки

    gameMenu.style.display = 'flex';
    gameTask.style.display = 'flex';

    createItems();

    function showUserScore() {
        gameTask.style.display = 'none';
        gameMenu.style.display = 'none';
        resultScore.style.display = 'flex';
        resultScoreVal.textContent = score;
    }

    function createItems() {

        // Удаляем старые элементы и задаем случаный цвет фона
        gameField.classList = `numbers numbers__item--${getRandomElem(gameColors)}`;
        document.querySelector('#gameItems').remove();
        document.querySelector('#gameTaskValue').remove();
    
        const quantity = levelsLength[level];
        const values = [];
    
        // В массив значений добавляем уникальные случайные значения 
        while(values.length < quantity){
            randomInt = getRandomInt(Math.pow(10, levelsPow[level]-1), Math.pow(10, levelsPow[level]));
            if(values.indexOf(randomInt) === -1) values.push(randomInt); 
        }
    
        // Создаем новое правильное значение
    
        const rightAnswerKey = Math.floor(Math.random() * values.length);
        const rightAnswer = values[rightAnswerKey];
        
        const gameTaskValue = document.createElement("span");
        gameTaskValue.id = "gameTaskValue";
        gameTaskValue.classList = "numbers__task-reference numbers__task-reference--ng-enter";
        gameTaskValue.textContent = rightAnswer;
        gameTask.appendChild(gameTaskValue);
    
        // Создаем новое поле с числами
    
        const gameItems = document.createElement("div");
        gameItems.id = "gameItems";
        gameItems.classList = "numbers__items numbers__items--ng-enter";
        gameField.appendChild(gameItems);
    
        for (let i = 0; i < quantity; i++) {
            const item = document.createElement("button");
            // Определяем размер строки по уровню, случайный цвет и задаем классы
            const itemSize = itemSizes[level];
            const randColor = getRandomElem(gameColors);
            item.classList = `numbers__item numbers__item--size-${itemSize} numbers__item--${randColor}`;
            // Со второго уровня поключаем случайные анимации
            if(level > 1) {
                const randAnim = getRandomElem(itemAnimations);
                item.classList += ` numbers__item--${randAnim}`;
            }
            gameItems.appendChild(item);
            const itemInner = document.createElement("span");
            itemInner.className = 'numbers__item-inner';
            // Обработчик, если выбрали правильный вариант
            if(i == rightAnswerKey) item.addEventListener('click', () => { answer('correct') });
            // Либо если ошибаемся
            else item.addEventListener('click', () => { answer('wrong') });
            
            itemInner.innerHTML = values[i];
            item.appendChild(itemInner);
    
            function answer(value) {
                gameItems.classList = "numbers__items numbers__items--ng-leave";
                gameTaskValue.classList = "numbers__task-reference numbers__task-reference--ng-leave";
                const answerDiv = document.createElement("div");
                answerDiv.classList = 'numbers__answer numbers__answer--'+value;
                gameField.appendChild(answerDiv);
                // Обновляем значения
                if (value === 'correct') {
                    if (level < 8) level++;
                    score+=10*level;
                }
                else if (level > 0) level--;
                gameScore.textContent = score;
                gameLevel.textContent = level;
                const timeout = setTimeout(() => {
                    answerDiv.remove();
                    clearTimeout(timeout);
                    (!gameOver) ? createItems() : showUserScore()
                }, 300);
            }
        }
}
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return (
        seconds == 60 ?
        (minutes+1) + ":00" :
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds
      );
}
