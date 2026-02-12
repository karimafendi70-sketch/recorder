const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const statusEl = document.getElementById('status');
const connectionInfoEl = document.getElementById('connectionInfo');
const restartBtn = document.getElementById('restartBtn');
const resetHighScoreBtn = document.getElementById('resetHighScoreBtn');
const HIGH_SCORE_KEY = 'paddleGameHighScore';
const STATUS_FADE_DURATION = 450;
let statusHoldTimeoutId = null;
let statusFadeTimeoutId = null;
const STATUS_CLASSES = ['status--default', 'status--reset', 'status--record'];
const socket = io();

const storedHighScore = Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? '0', 10);

const state = {
  leftPaddle: { x: 20, y: 200, w: 14, h: 90, speed: 6 },
  rightPaddle: { x: canvas.width - 34, y: 200, w: 14, h: 90, speed: 6 },
  ball: { x: canvas.width / 2, y: canvas.height / 2, r: 8, vx: 4, vy: 3 },
  score: 0,
  highScore: Number.isFinite(storedHighScore) && storedHighScore > 0 ? storedHighScore : 0,
  gameOver: false,
  role: 'spectator',
  connectedPlayers: 0,
  lastSentPaddleY: null
};

const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false
};

window.addEventListener('keydown', (event) => {
  if (event.key in keys) keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
  if (event.key in keys) keys[event.key] = false;
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function resetBall() {
  const { ball } = state;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = Math.random() > 0.5 ? 4 : -4;
  ball.vy = Math.random() > 0.5 ? 3 : -3;
}

function updateHud() {
  scoreEl.textContent = `Gevangen ballen: ${state.score}`;
  highScoreEl.textContent = `High score: ${state.highScore}`;
}

function updateConnectionInfo() {
  let roleText = 'Toeschouwer';
  if (state.role === 'player1') roleText = 'Speler 1 (links)';
  if (state.role === 'player2') roleText = 'Speler 2 (rechts)';

  connectionInfoEl.textContent = `Online: ${state.connectedPlayers}/2 verbonden · Rol: ${roleText}`;
}

function updateHighScore() {
  if (state.score <= state.highScore) return false;
  state.highScore = state.score;
  localStorage.setItem(HIGH_SCORE_KEY, String(state.highScore));
  updateHud();
  return true;
}

function setGameOver() {
  state.gameOver = true;
  const hasNewHighScore = updateHighScore();
  clearStatusTimers();
  statusEl.classList.remove('status--fading');
  statusEl.textContent = 'Game over! Klik op "Opnieuw starten".';
  setStatusVariant('default');
  restartBtn.hidden = false;

  if (hasNewHighScore) {
    showTemporaryStatus('Nieuw high score!', 'record', 2000);
  }
}

function restartGame() {
  state.leftPaddle.y = 200;
  state.rightPaddle.y = 200;
  state.score = 0;
  state.gameOver = false;
  clearStatusTimers();
  statusEl.classList.remove('status--fading');
  statusEl.textContent = 'Spel actief';
  setStatusVariant('default');
  restartBtn.hidden = true;
  updateHud();
  resetBall();
}

function clearStatusTimers() {
  clearTimeout(statusHoldTimeoutId);
  clearTimeout(statusFadeTimeoutId);
  statusHoldTimeoutId = null;
  statusFadeTimeoutId = null;
}

function setStatusVariant(variant) {
  statusEl.classList.remove(...STATUS_CLASSES);
  if (variant === 'reset') {
    statusEl.classList.add('status--reset');
    return;
  }
  if (variant === 'record') {
    statusEl.classList.add('status--record');
    return;
  }
  statusEl.classList.add('status--default');
}

function showTemporaryStatus(message, variant, duration = 2000) {
  const fallbackMessage = state.gameOver ? 'Game over! Klik op "Opnieuw starten".' : 'Spel actief';
  clearStatusTimers();
  statusEl.textContent = message;
  setStatusVariant(variant);
  statusEl.classList.remove('status--fading');

  statusHoldTimeoutId = setTimeout(() => {
    statusEl.classList.add('status--fading');

    statusFadeTimeoutId = setTimeout(() => {
      statusEl.classList.remove('status--fading');
      statusEl.textContent = fallbackMessage;
      setStatusVariant('default');
    }, STATUS_FADE_DURATION);
  }, duration);
}

function resetHighScoreOnly() {
  state.highScore = 0;
  localStorage.setItem(HIGH_SCORE_KEY, '0');
  updateHud();
  showTemporaryStatus('High score gereset', 'reset', 2000);
}

function update() {
  if (state.gameOver) return;

  const { leftPaddle, rightPaddle, ball } = state;
  const isPlayer1 = state.role === 'player1';
  const isPlayer2 = state.role === 'player2';
  let shouldSyncPaddle = false;

  if (isPlayer1) {
    if (keys.w) leftPaddle.y -= leftPaddle.speed;
    if (keys.s) leftPaddle.y += leftPaddle.speed;
  }

  if (isPlayer2) {
    if (keys.ArrowUp) rightPaddle.y -= rightPaddle.speed;
    if (keys.ArrowDown) rightPaddle.y += rightPaddle.speed;
  }

  leftPaddle.y = clamp(leftPaddle.y, 0, canvas.height - leftPaddle.h);
  rightPaddle.y = clamp(rightPaddle.y, 0, canvas.height - rightPaddle.h);

  if (isPlayer1 && state.lastSentPaddleY !== leftPaddle.y) {
    state.lastSentPaddleY = leftPaddle.y;
    shouldSyncPaddle = true;
  }

  if (isPlayer2 && state.lastSentPaddleY !== rightPaddle.y) {
    state.lastSentPaddleY = rightPaddle.y;
    shouldSyncPaddle = true;
  }

  if (shouldSyncPaddle) {
    socket.emit('paddle:move', { y: state.lastSentPaddleY });
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
    ball.vy *= -1;
  }

  const hitLeft =
    ball.vx < 0 &&
    ball.x - ball.r <= leftPaddle.x + leftPaddle.w &&
    ball.y >= leftPaddle.y &&
    ball.y <= leftPaddle.y + leftPaddle.h;

  const hitRight =
    ball.vx > 0 &&
    ball.x + ball.r >= rightPaddle.x &&
    ball.y >= rightPaddle.y &&
    ball.y <= rightPaddle.y + rightPaddle.h;

  if (hitLeft) {
    ball.x = leftPaddle.x + leftPaddle.w + ball.r;
    ball.vx *= -1;
    state.score += 1;
    updateHud();
  }

  if (hitRight) {
    ball.x = rightPaddle.x - ball.r;
    ball.vx *= -1;
    state.score += 1;
    updateHud();
  }

  if (ball.x < 0 || ball.x > canvas.width) {
    setGameOver();
  }
}

function drawCenterLine() {
  ctx.strokeStyle = '#334155';
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function draw() {
  const { leftPaddle, rightPaddle, ball } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCenterLine();

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  if (state.gameOver) {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 40px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '20px system-ui';
    ctx.fillText(`Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 28);
    ctx.fillText(`High score: ${state.highScore}`, canvas.width / 2, canvas.height / 2 + 58);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

restartBtn.addEventListener('click', restartGame);
resetHighScoreBtn.addEventListener('click', resetHighScoreOnly);

socket.on('connect', () => {
  connectionInfoEl.textContent = 'Verbonden met server...';
});

socket.on('disconnect', () => {
  connectionInfoEl.textContent = 'Verbinding met server verbroken';
});

socket.on('player:role', ({ role }) => {
  state.role = role;
  state.lastSentPaddleY = null;
  updateConnectionInfo();
});

socket.on('lobby:update', ({ connectedPlayers }) => {
  state.connectedPlayers = connectedPlayers;
  updateConnectionInfo();
});

socket.on('opponent:paddle', ({ role, y }) => {
  if (role === 'player1' && state.role !== 'player1') {
    state.leftPaddle.y = clamp(y, 0, canvas.height - state.leftPaddle.h);
  }

  if (role === 'player2' && state.role !== 'player2') {
    state.rightPaddle.y = clamp(y, 0, canvas.height - state.rightPaddle.h);
  }
});

updateHud();
updateConnectionInfo();
loop();
