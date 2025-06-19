const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player;
let gravity = 2;
let score;
let obstacles;
let frame;
let gameOver = false;
let lives;
let flash = false;
let flashTimer = 0;
let heartImg = new Image();
heartImg.src = "https://upload.wikimedia.org/wikipedia/commons/4/49/Red_Heart.svg"; // public heart SVG

function initGame() {
  player = { x: 50, y: canvas.height - 50, width: 50, height: 50, vy: 0, jumping: false };
  score = 0;
  obstacles = [];
  frame = 0;
  lives = 3;
  gameOver = false;
  flash = false;
  flashTimer = 0;
}

function drawPlayer() {
  ctx.fillStyle = "#2e7d32";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "#d32f2f";
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

function update() {
  if (gameOver) return;

  frame++;

  if (player.jumping) {
    player.vy += gravity;
    player.y += player.vy;
    if (player.y >= canvas.height - player.height) {
      player.y = canvas.height - player.height;
      player.jumping = false;
      player.vy = 0;
    }
  }

  if (frame % 100 === 0) {
    let height = 50;
    obstacles.push({ x: canvas.width, y: canvas.height - height, width: 30, height: height });
  }

  for (let obs of obstacles) {
    obs.x -= 5;

    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y + player.height > obs.y &&
      player.y < obs.y + obs.height
    ) {
      lives--;
      flash = true;
      flashTimer = 10;
      obstacles = [];
      if (lives <= 0) {
        gameOver = true;
      }
      break;
    }
  }

  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
  score++;
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("ESG Score: " + score, 10, 20);

  for (let i = 0; i < lives; i++) {
    ctx.drawImage(heartImg, canvas.width - 30 * (i + 1), 10, 20, 20);
  }
}

function drawGameOver() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 10);
    ctx.font = "18px Arial";
    ctx.fillText("Press SPACE to restart", canvas.width / 2 - 100, canvas.height / 2 + 30);
  }
}

function drawFlash() {
  if (flash && flashTimer > 0) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    flashTimer--;
    if (flashTimer === 0) {
      flash = false;
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  drawScore();
  drawFlash();
  drawGameOver();
  update();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (gameOver) {
      initGame();
      requestAnimationFrame(gameLoop);
    } else if (!player.jumping) {
      player.vy = -20;
      player.jumping = true;
    }
  }
});

initGame();
gameLoop();
