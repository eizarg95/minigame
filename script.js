const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 320, width: 50, height: 50, vy: 0, jumping: false };
let gravity = 2;
let score = 0;
let obstacles = [];
let frame = 0;

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
  frame++;

  if (player.jumping) {
    player.vy += gravity;
    player.y += player.vy;
    if (player.y >= 320) {
      player.y = 320;
      player.jumping = false;
      player.vy = 0;
    }
  }

  if (frame % 100 === 0) {
    let height = 50;
    obstacles.push({ x: 800, y: 350, width: 30, height: height });
  }

  for (let obs of obstacles) {
    obs.x -= 5;
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      alert("Game Over! ESG Score: " + score);
      document.location.reload();
    }
  }

  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  score++;
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("ESG Score: " + score, 10, 20);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawPlayer();
  drawObstacles();
  drawScore();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && !player.jumping) {
    player.vy = -20;
    player.jumping = true;
  }
});

gameLoop();
