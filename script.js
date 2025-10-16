// Variables to control game state
let gameRunning = false;
let dropMaker;
let timerInterval;
let score = 0;
let timeLeft = 30;
let highScore = localStorage.getItem('highScore') || 0;

// Winning and losing messages arrays
const winningMessages = [
    "Amazing! You're a water hero!",
    "Fantastic catch! Keep saving water!",
    "Victory! The drops are safe with you!"
];
const losingMessages = [
    "Nice try! Practice makes perfect.",
    "Don't give up! Try again.",
    "Keep going! You'll get them next time."
];

// Initialize high score display
document.getElementById('high-score').textContent = highScore;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
    if (gameRunning) return;

    gameRunning = true;
    score = 0;
    timeLeft = 30;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = timeLeft;
    document.getElementById('start-btn').textContent = 'Game Running...';
    document.getElementById('game-over-message').style.display = 'none';

    // Clear any existing drops
    document.getElementById('game-container').innerHTML = '';

    // Start timer
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Create drops every second
    dropMaker = setInterval(createDrop, 1000);
}

function createDrop() {
    const drop = document.createElement("div");
    const isBad = Math.random() < 0.3; // 30% chance of bad drop
    drop.className = isBad ? "water-drop bad-drop" : "water-drop";

    // Random size
    const initialSize = 60;
    const sizeMultiplier = Math.random() * 0.8 + 0.5;
    const size = initialSize * sizeMultiplier;
    drop.style.width = drop.style.height = `${size}px`;

    // Random position
    const gameWidth = document.getElementById("game-container").offsetWidth;
    const xPosition = Math.random() * (gameWidth - 60);
    drop.style.left = xPosition + "px";

    // Fall animation
    drop.style.animationDuration = "4s";

    // Click handler
    drop.addEventListener("click", () => {
        if (!gameRunning) return;
        const points = isBad ? -5 : 1;
        score += points;
        document.getElementById('score').textContent = score;
        showFeedback(points, drop);
        drop.remove();
    });

    // Add to container
    document.getElementById("game-container").appendChild(drop);

    // Remove on animation end
    drop.addEventListener("animationend", () => {
        drop.remove();
    });
}

function showFeedback(points, drop) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${points < 0 ? 'negative' : ''}`;
    feedback.textContent = points > 0 ? '+1' : '-5';
    feedback.style.left = drop.style.left;
    feedback.style.top = drop.offsetTop + 'px';
    document.getElementById('game-container').appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function endGame() {
    gameRunning = false;
    clearInterval(dropMaker);
    clearInterval(timerInterval);
    document.getElementById('start-btn').textContent = 'Play Again';

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }

    // Show game over message
    document.getElementById('final-score').textContent = score;
    const isWin = score >= 20;
    const messages = isWin ? winningMessages : losingMessages;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('win-lose-message').textContent = randomMessage;
    document.getElementById('game-over-message').style.display = 'block';
}
