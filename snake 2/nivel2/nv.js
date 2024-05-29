let snake = [{ x: 200, y: 200 }];
let apple = { x: 0, y: 0 };
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
let wallColor = 'gray';

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
    snake = [{ x: 200, y: 200 }];
    apple = generateApplePosition();
    dx = 20;
    dy = 0;
    score = 0;
    updateScore();
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 80); // Aumenta a velocidade da cobrinha
    playMusic(); // Iniciar música quando o jogo começar
    nameInputContainer.style.display = 'none';
    initializeWalls(); // Inicializa as paredes do campo de jogo
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

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Verifica se a cabeça da cobrinha comeu a maçã
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
    return { x, y };
}

function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls(); // Desenha as paredes
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

    // Verifica se a cabeça da cobrinha bate nas paredes
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Verifica se a cabeça da cobrinha bate no próprio corpo
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

// Funções para as paredes
let walls = [];

function initializeWalls() {
    walls = [
        { x: 0, y: 0, width: canvas.width, height: snakeSize }, // Parede superior
        { x: 0, y: canvas.height - snakeSize, width: canvas.width, height: snakeSize }, // Parede inferior
        { x: 0, y: 0, width: snakeSize, height: canvas.height }, // Parede esquerda
        { x: canvas.width - snakeSize, y: 0, width: snakeSize, height: canvas.height } // Parede direita
    ];
}

function drawWalls() {
    walls.forEach(wall => {
        context.fillStyle = wallColor;
        context.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}
function updateScore() {
    scoreElement.textContent = 'Score: ' + score;
    if (score >= 300) {
        level2Button.style.display = 'block';
    }
}

let obstacles = [];

function initializeObstacles() {
    obstacles = [
        { x: 100, y: 100, width: snakeSize, height: snakeSize }, // Obstáculo 1
        { x: 300, y: 200, width: snakeSize, height: snakeSize }, // Obstáculo 2
        { x: 400, y: 300, width: snakeSize, height: snakeSize }, // Obstáculo 3
        { x: 200, y: 350, width: 50, height: 30 } // Novo obstáculo
    ];
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        context.fillStyle = '#ffff00'; // Cor dos obstáculos (preto)
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function checkObstacleCollision() {
    const head = snake[0];
    return obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y);
}

function moveSnake() {
    if (checkCollision() || checkObstacleCollision()) { // Verificar colisão com obstáculos
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        stopMusic();
        nameInputContainer.style.display = 'block';
        updateLeaderboard();
        return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Verifica se a cabeça da cobrinha comeu a maçã
    if (head.x === apple.x && head.y === apple.y) {
        score += 10;
        updateScore();
        apple = generateApplePosition();
    } else {
        snake.pop();
    }

    drawGame();
}

// Dentro da função startGame, chame as funções initializeObstacles() e drawObstacles() para inicializar e desenhar os obstáculos:
function startGame() {
    snake = [{ x: 200, y: 200 }];
    apple = generateApplePosition();
    dx = 20;
    dy = 0;
    score = 0;
    updateScore();
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 80);
    playMusic();
    nameInputContainer.style.display = 'none';
    initializeWalls();
    initializeObstacles(); // Inicializa os obstáculos
}

// E dentro da função drawGame, chame a função drawObstacles() para desenhar os obstáculos:
function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawObstacles(); // Desenha os obstáculos
    drawSnake();
    drawApple();
}