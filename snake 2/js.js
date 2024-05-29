let snake = [{x: 200, y: 200}];
let apple = {x: 0, y: 0};
let dx = 20;
let dy = 0;
let score = 0;
let gameInterval;
let bgMusic = document.getElementById('bgMusic');
let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
let snakeSize = 20;
let playerName = "";
let leaderboard = [];

document.addEventListener('keydown', (event) => {
    if ((event.key === 'ArrowUp' || event.key === 'w') && dy !== snakeSize) {
        dx = 0;
        dy = -snakeSize;
    } else if ((event.key === 'ArrowDown' || event.key === 's') && dy !== -snakeSize) {
        dx = 0;
        dy = snakeSize;
    } else if ((event.key === 'ArrowLeft' || event.key === 'a') && dx !== snakeSize) {
        dx = -snakeSize;
        dy = 0;
    } else if ((event.key === 'ArrowRight' || event.key === 'd') && dx !== -snakeSize) {
        dx = snakeSize;
        dy = 0;
    }
});

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');
const nameInputContainer = document.getElementById('nameInputContainer');
const nameInput = document.getElementById('nameInput');
const saveScoreButton = document.getElementById('saveScoreButton');
const leaderboardBody = document.getElementById('leaderboardBody');

startButton.addEventListener('click', () => {
    playerName = prompt("Enter your name:");
    if (playerName) {
        startGame();
    }
});

restartButton.addEventListener('click', restartGame);
saveScoreButton.addEventListener('click', saveScore);

function startGame() {
    snake = [{x: 200, y: 200}];
    apple = generateApplePosition();
    dx = 20;
    dy = 0;
    score = 0;
    updateScore();
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 100);
    playMusic(); // Iniciar música quando o jogo começar
    nameInputContainer.style.display = 'none';
}

function restartGame() {
    startGame();
}

function updateScore() {
    scoreElement.textContent = 'Score: ' + score;
}

function moveSnake() {
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        stopMusic(); // Parar música quando o jogo terminar
        nameInputContainer.style.display = 'block';
        updateLeaderboard();
        return;
    }

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x < 0) head.x = canvas.width - snakeSize;
    else if (head.x >= canvas.width) head.x = 0;
    else if (head.y < 0) head.y = canvas.height - snakeSize;
    else if (head.y >= canvas.height) head.y = 0;

    if (head.x === apple.x && head.y === apple.y) {
        score += 10;
        updateScore();
        apple = generateApplePosition();
    } else {
        snake.pop();
    }

    drawGame();
}

function generateApplePosition() {
    const x = Math.floor(Math.random() * 20) * snakeSize;
    const y = Math.floor(Math.random() * 20) * snakeSize;
    return {x, y};
}

function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
}

function drawSnake() {
    snake.forEach(segment => {
        context.fillStyle = 'green';
        context.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });
}

function drawApple() {
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, snakeSize, snakeSize);
}

function checkCollision() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function playMusic() {
    bgMusic.play();
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function saveScore() {
    if (playerName) {
        leaderboard.push({ name: playerName, score: score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10); // Manter apenas os 10 primeiros registros
        updateLeaderboard();
    }
    nameInputContainer.style.display = 'none';
}

function updateLeaderboard() {
    leaderboardBody.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}
function updateScore() {
    scoreElement.textContent = 'Score: ' + score;
    if (score >= 300) {
        level2Button.style.display = 'block';
    }
}
