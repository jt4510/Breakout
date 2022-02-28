/*
 *  File: Breakout.js
 *  -----------------
 *  This program recreates the 1970's classic, Breakout!
 */
"use strict";

/* Constants */
const GWINDOW_WIDTH = 500;
const GWINDOW_HEIGHT = 800;
const PADDLE_WIDTH = 50;
const PADDLE_HEIGHT = 10;
const BALL_DIAMETER = 10;
const BALL_SPEED = 80;
const RIGHT_MARGIN = GWINDOW_WIDTH - PADDLE_WIDTH;
const LEFT_MARGIN = PADDLE_WIDTH;
const TIME_STEP = 20;
let paddle = null;
let gameBall = null;
let gameWindow = null;
let paddleX = (GWINDOW_WIDTH - PADDLE_WIDTH) / 2;
let paddleY = GWINDOW_HEIGHT * .9;
let ballX = 0;
let ballY = 0;
let nextBallX = 0;
let nextBallY = 0;
let ballStepX = 0;
let ballStepY = 0;


/*
 * Creates game window and launches game
 */
function playBreakout() {
    gameWindow = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
    gamePad();
    buildBricks();
    launchBall();
    gameWindow.addEventListener("mousemove", mouseMoveAction);
}


/*
 * Creates the paddle
 */
function gamePad() {
    paddle = GRect((GWINDOW_WIDTH - PADDLE_WIDTH) * .5, (GWINDOW_HEIGHT - PADDLE_HEIGHT) * .9, PADDLE_WIDTH, PADDLE_HEIGHT);
    paddle.setColor("Black");
    paddle.setFilled(true);
    gameWindow.add(paddle);
}

/*
 * Builds bricks
 */
function buildBricks() {
    let brickLayout = ["Red", "Red", "Orange", "Orange", "Yellow", "Yellow", "Green", "Green", "Blue", "Blue"];
    let brickRow = GWINDOW_HEIGHT * .1;
    let bricks = []
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            bricks[j] = GRect(2 + (((GWINDOW_WIDTH / 10) - 4) * j) + (j * 4), (brickRow + (i * 14)), ((GWINDOW_WIDTH / 10) - 4), 10);
            bricks[j].setColor(brickLayout[i]);
            bricks[j].setFilled(true);
            gameWindow.add(bricks[j]);
            console.log("bricks loop" + j);
        }
    }
}

/*
 * Tracks movement of the paddle
 */
function mouseMoveAction(e) {
    if (e.getX() >= RIGHT_MARGIN) {
        paddle.move(RIGHT_MARGIN - paddleX, 0);
        paddleX = RIGHT_MARGIN;
    } else {
        paddle.move(e.getX() - paddleX, 0);
        paddleX = e.getX();
    }
}

/*
 * Launches the ball, initiating gameplay
 */
function launchBall() {
    // choose random location and slope for ball start
    ballX = randomReal(LEFT_MARGIN, RIGHT_MARGIN);
    ballY = GWINDOW_HEIGHT * .6;
    nextBallX = randomReal(LEFT_MARGIN, RIGHT_MARGIN);
    nextBallY = GWINDOW_HEIGHT;
    ballStepX = (nextBallX - ballX) / BALL_SPEED;
    ballStepY = (nextBallY - ballY) / BALL_SPEED;

    // create ball
    gameBall = GOval(ballX, ballY, BALL_DIAMETER, BALL_DIAMETER);
    gameBall.setColor("Black");
    gameBall.setFilled(true);
    gameWindow.add(gameBall);
    let gameBallMotion = setInterval(updateBall, TIME_STEP);

    // updateBall moves the ball based on gameBallMotion interval. Conditions determine if the ball will bounce, remove a brick, or exit play.
    function updateBall() {
        gameBall.move(ballStepX, ballStepY);
        if (gameBall.getY() >= GWINDOW_HEIGHT - BALL_DIAMETER) {
            //ends game if ball reaches bottom wall
            ballStepY = -ballStepY;
            clearInterval(gameBallMotion);
        } else if (gameBall.getY() <= 0) {
            //bounces ball of top wall
            ballStepY = -ballStepY;
        } else if (gameBall.getX() <= 0) {
            //bounces ball of left wall
            ballStepX = -ballStepX;
        } else if (gameBall.getX() >= GWINDOW_WIDTH - BALL_DIAMETER) {
            //bounces ball of right wall
            ballStepX = -ballStepX;
        } else if (gameWindow.getElementAt(gameBall.getX() + (BALL_DIAMETER / 2), gameBall.getY() + BALL_DIAMETER + 1) !== null && gameBall.getY() > (GWINDOW_HEIGHT * .6) + 1) {
            //bounces if bottom of ball encounters an object in the paddle area.
            ballStepY = -ballStepY;
        } else if (gameWindow.getElementAt(gameBall.getX() + (BALL_DIAMETER / 2), gameBall.getY() + BALL_DIAMETER + 1) !== null && gameBall.getY() < (GWINDOW_HEIGHT * .6) - 1) {
            //removes brick if bottom of ball encounters an object in the brick area.
            ballStepY = -ballStepY;
            gameWindow.remove(gameWindow.getElementAt(gameBall.getX() + (BALL_DIAMETER / 2), gameBall.getY() + BALL_DIAMETER + 1));
        } else if (gameWindow.getElementAt(gameBall.getX() + (BALL_DIAMETER / 2), gameBall.getY() - 1) !== null && gameBall.getY() < GWINDOW_HEIGHT * .6) {
            // removes a brick if top of ball encounters an object in the brick area.
            ballStepY = -ballStepY;
            gameWindow.remove(gameWindow.getElementAt(gameBall.getX() + (BALL_DIAMETER / 2), gameBall.getY() - 1));
        }
    }
}