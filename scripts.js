const COMMAND = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}
let canvas = document.getElementById('snake');
let context = canvas.getContext('2d');
let box = 1;
let snake = [];
snake[0] = {
  x: 8 * box,
  y: 8 * box
}
let velocity = 700;
let direction = 'right';
let food = sortPosition()
function sortPosition() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * 15 + 1) * box,
      y: Math.floor(Math.random() * 15 + 1) * box
    }
  } while (snake.some(body => body.x == pos.x && body.y == pos.y));
  return pos;
}

function createBG() {
  context.fillStyle = 'lightgreen';
  context.fillRect(0, 0, 16 * box, 16 * box)
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

function verifyTransposal() {
  // console.log(`x:${snake[0].x}, y:${snake[0].y}`)
  if (snake[0].x > 15 * box) snake[0].x = 0;
  if (snake[0].x < 0 * box) snake[0].x = 15 * box;
  if (snake[0].y > 15 * box) snake[0].y = 0;
  if (snake[0].y < 0 * box) snake[0].y = 15 * box;
}
function gameStart() {
  verifyTransposal();

  let gameOver = snake.filter(pos => pos.x == snake[0].x && pos.y == snake[0].y).length === 2;
  if (gameOver) {
    console.log("Game Over");
    clearTimeout(game);
    return;
  }
  createBG();
  createSnake();
  drawFood();
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  switch (direction) {
    case 'right': snakeX += box; break;
    case 'left': snakeX -= box; break;
    case 'up': snakeY -= box; break;
    case 'down': snakeY += box; break;
  }
  if (snakeX !== food.x || snakeY !== food.y) {
    snake.pop();
  } else {
    food = sortPosition();
  }
  let newHead = { x: snakeX, y: snakeY }
  snake.unshift(newHead);
  velocity = Math.max(10, 700 - ((snake.length - 1) * 17))
  clearTimeout(game);
  return setTimeout(gameStart, velocity);
}
let game = setTimeout(gameStart, velocity);