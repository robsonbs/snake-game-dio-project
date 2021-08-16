const COMMAND = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}
const PROPERTIES = {
  WIDTH: 16,
  HEIGHT: 20,
  INITIAL_VELOCITY: 700,
  MINIMAL_VELOCITY: 10,
  ACCELERATE_RATE: 23
}
let canvas = document.getElementById('snake');
canvas.width = PROPERTIES.WIDTH;
canvas.height = PROPERTIES.HEIGHT;
canvas.style.width = PROPERTIES.WIDTH * 32 + 'px';
canvas.style.height = PROPERTIES.HEIGHT * 32 + 'px';

let context = canvas.getContext('2d');
let box = 1;
let snake = [];
snake[0] = {
  x: 8,
  y: 8
}
let velocity = 700;
let direction = 'right';
let food = sortPosition()
function sortPosition() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * (PROPERTIES.WIDTH - 1) + 1) % PROPERTIES.WIDTH,
      y: Math.floor(Math.random() * (PROPERTIES.HEIGHT - 1) + 1) % PROPERTIES.HEIGHT
    }
  } while (snake.some(body=>verifyColliderWithFood(body)));
  return pos;

  function verifyColliderWithFood(body) {
    return body.x == pos.x && body.y == pos.y;
  }
}

function createBG() {
  context.fillStyle = 'lightgreen';
  context.fillRect(0, 0, PROPERTIES.WIDTH, PROPERTIES.HEIGHT)
}
function drawFood() {
  context.fillStyle = 'red';
  context.fillRect(food.x, food.y, box, box)
}
function createSnake() {
  let i = 0;
  for (; i < snake.length; i++) {
    context.fillStyle = 'green';
    context.fillRect(snake[i].x, snake[i].y, box, box)
  }
}

function update({ keyCode }) {
  if (keyCode == COMMAND.LEFT && direction !== 'right') direction = 'left';
  if (keyCode == COMMAND.UP && direction !== 'down') direction = 'up';
  if (keyCode == COMMAND.RIGHT && direction !== 'left') direction = 'right';
  if (keyCode == COMMAND.DOWN && direction !== 'up') direction = 'down';
}
document.addEventListener('keydown', update);

function mod(x, y) { return ((y % x) + x) % x; }

function gameStart() {
  let gameOver = snake.filter(collapse).length === 2;
  if (gameOver) {
    alert("Game Over");
    clearTimeout(game);
    return;
  }
  createBG();
  createSnake();
  drawFood();
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  switch (direction) {
    case 'right': snakeX = mod(PROPERTIES.WIDTH, snakeX + box); break;
    case 'left': snakeX = mod(PROPERTIES.WIDTH, snakeX - box); break;
    case 'up': snakeY = mod(PROPERTIES.HEIGHT, snakeY - box); break;
    case 'down': snakeY = mod(PROPERTIES.HEIGHT, snakeY + box); break;
  }
  if (snakeX !== food.x || snakeY !== food.y) {
    snake.pop();
  } else {
    food = sortPosition();
  }
  let newHead = { x: snakeX, y: snakeY }
  snake.unshift(newHead);
  velocity = Math.max(PROPERTIES.MINIMAL_VELOCITY, PROPERTIES.INITIAL_VELOCITY - ((snake.length - 1) * PROPERTIES.ACCELERATE_RATE))
  clearTimeout(game);
  return setTimeout(gameStart, velocity);

  function collapse(pos) {
    return pos.x == snake[0].x && pos.y == snake[0].y;
  }
}
let game = setTimeout(gameStart, velocity);