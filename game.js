const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Игрок
let playerName = localStorage.getItem('playerName') || "kkk_1259";
let balance = parseInt(localStorage.getItem('balance')) || 0;
let farmTime = parseInt(localStorage.getItem('farmTime')) || (8 * 60 * 60); // 8 часов в секундах

// Таймер для фарминга
let isFarming = false;
let farmInterval;

// Загрузка изображений
const background = new Image();
background.src = 'background.png';  // Фоновое изображение

function imagesLoaded() {
    drawUI();
}

let imagesToLoad = 1;

function onImageLoad() {
    imagesToLoad--;
    if (imagesToLoad === 0) {
        imagesLoaded();
    }
}

background.onload = onImageLoad;

background.onerror = function() {
    console.error("Фон не найден, проверьте путь к background.png");
};

// Функция для отрисовки закругленных прямоугольников
function drawRoundedRect(x, y, width, height, radius, fillColor, strokeColor) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Отрисовка интерфейса
function drawUI() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawTopTab();
    drawStartFarmButton();
    drawTabs();
}

// Функция отрисовки верхней вкладки
function drawTopTab() {
    const tabWidth = canvas.width * 0.5;
    const tabHeight = 100;

    drawRoundedRect(10, 10, tabWidth, tabHeight, 10, "rgba(0, 0, 0, 0.5)", "#ddfaba");

    ctx.fillStyle = "#3effbf";
    ctx.font = `${canvas.width * 0.05}px 'Orbitron', sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(playerName, 20, 30);
    ctx.fillText("Your balance", 20, 60);
    
    ctx.font = `${canvas.width * 0.06}px 'Orbitron', sans-serif`;
    ctx.fillText(`${balance} $toxic`, 20, 90);
}

// Функция отрисовки кнопки Start Farm
function drawStartFarmButton() {
    const buttonWidth = canvas.width * 0.4;
    const buttonHeight = canvas.height * 0.08;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = canvas.height * 0.75;

    drawRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10, "rgba(0, 0, 0, 0.5)", "#ddfaba");

    ctx.fillStyle = "#3effbf";
    ctx.font = `${canvas.width * 0.05}px 'Orbitron', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isFarming ? `${formatFarmTime(farmTime)} left` : "Start Farm", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

// Функция отрисовки вкладок внизу
function drawTabs() {
    const tabs = ['Farm', 'Task', 'Invite', 'Wallet'];
    const tabWidth = canvas.width / tabs.length;
    const tabHeight = canvas.height * 0.1;

    tabs.forEach((tab, index) => {
        const tabX = index * tabWidth;
        const tabY = canvas.height - tabHeight;

        drawRoundedRect(tabX, tabY, tabWidth, tabHeight, 10, "rgba(0, 0, 0, 0.5)", "#ddfaba");

        ctx.fillStyle = "#3effbf";
        ctx.font = `${canvas.width * 0.05}px 'Orbitron', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tab, tabX + tabWidth / 2, tabY + tabHeight / 2);
    });
}

function formatFarmTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

// Логика фарминга
function startFarming() {
    isFarming = true;
    farmInterval = setInterval(() => {
        farmTime--;
        if (farmTime <= 0) {
            balance += 100;
            localStorage.setItem('balance', balance);  // Сохраняем баланс
            farmTime = 8 * 60 * 60; // Сбрасываем таймер
            isFarming = false;
            clearInterval(farmInterval);
        }
        localStorage.setItem('farmTime', farmTime);  // Сохраняем время
        drawUI();  // Перерисовываем интерфейс
    }, 1000);
}

// Обработка нажатий на холст
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const buttonWidth = canvas.width * 0.4;
    const buttonHeight = canvas.height * 0.08;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = canvas.height * 0.75;

    if (!isFarming && x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
        startFarming();
    }
}

// Функция изменения размера холста
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawUI();
}

// Запуск игры
function startGame() {
    canvas.addEventListener('click', handleCanvasClick);
}

// Обработчик изменения размера окна
window.addEventListener('resize', resizeCanvas);

// Инициализация размера холста
resizeCanvas();
startGame();

// Получаем имя игрока из Telegram (например, через URL)
function setPlayerName(name) {
    playerName = name;
    localStorage.setItem('playerName', playerName);  // Сохраняем имя
}

// Пример вызова функции
setPlayerName("Имя_пользователя");  // Замените на реальное имя
