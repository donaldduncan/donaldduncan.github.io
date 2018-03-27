//Canvas variables
var canvas;
var canvasContext;

//Ball variables
var ballX = 400;
var ballSpeedX = -20;
var ballY = 200;
var ballSpeedY = 6;
var ballSize = 12;

//Player 1 variables
var leftPaddleX = 0;
var leftPaddleY = 250;
var leftPaddleW = 14;
var leftPaddleH = 100;
var paddleVOffset = 5;

//Player 2 variables
var rightPaddleX = 800 - leftPaddleX - leftPaddleW;
var rightPaddleY = 250;
var rightPaddleW = 14;
var rightPaddleH = 100;

//Score variables
var leftScore = 0;
var rightScore = 0;
const WINNING_SCORE = 3;
var actionPaused = true;
var showingWinScreen = false;

//Event handlers

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = (evt.clientX - rect.left - root.scrollLeft) * (canvas.width / canvas.clientWidth);
    var mouseY = (evt.clientY - rect.top - root.scrollTop) * (canvas.width / canvas.clientWidth);
    return {
        x: mouseX,
        y: mouseY
    }
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        leftScore = 0;
        rightScore = 0;
        showingWinScreen = false;
    } else if (actionPaused) {
        actionPaused = false;
    }
}


window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function () {
        drawAll();
        moveAll();
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove',
        function (evt) {
            var mousePos = calculateMousePos(evt);
            leftPaddleY = mousePos.y - leftPaddleH / 2;
            //if (leftPaddleY > canvas.height - paddleVOffset - (leftPaddleH/2)) { leftPaddleY = canvas.height - paddleVOffset - (leftPaddleH/2) }
            //if (leftPaddleY < paddleVOffset) { leftPaddleY = paddleVOffset }
            //rightPaddleY = mousePos.y - rightPaddleH / 2;
            //document.getElementById('infobox').innerText = "leftPaddleY = " + leftPaddleY;
            //document.getElementById('infobox').innerHTML = ("canvas.width = " + canvas.width + " ; <br>canvas.clientWidth = " + canvas.clientWidth + " ;<br> canvas.height = " + canvas.height + " ;<br> canvas.clientHeight = " + canvas.clientHeight + " ;<br> mouseX = " + mousePos.x + " ;<br> mouseY = " + mousePos.y);
        });

    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('touchstart', handleMouseClick);

    canvas.addEventListener('touchmove', function (evt) {
        var touchobj = evt.touches[0];
        leftPaddleY = (parseInt(touchobj.clientY) - leftPaddleH / 2) * (canvas.width / canvas.clientWidth);
        //if (leftPaddleY > canvas.height - paddleVOffset) { leftPaddleY = canvas.height - paddleVOffset }
        //if (leftPaddleY < paddleVOffset) { leftPaddleY = paddleVOffset }
        //rightPaddleY = parseInt(touchobj.clientY);

        evt.preventDefault();
    });
}
function ballReset() {
    if (rightScore >= WINNING_SCORE ||
        leftScore >= WINNING_SCORE) {
        showingWinScreen = true;
    } else {
        actionPaused = true;
    }

    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.floor(Math.random() * 12) - 6;

}

function p2movement() {
    var rightPaddleYcentre = rightPaddleY + rightPaddleH / 2;
    if (rightPaddleYcentre < ballY - 35) {
        rightPaddleY += 6;
    } else if (rightPaddleYcentre > ballY + 35) {
        rightPaddleY -= 6;
    }
    //if (rightPaddleY > canvas.height - paddleVOffset) { rightPaddleY = canvas.height - paddleVOffset }
    //if (rightPaddleY < paddleVOffset) { rightPaddleY = paddleVOffset }
}

function moveAll() {
    if (showingWinScreen || actionPaused) { return; }

    ballY += ballSpeedY
    ballX += ballSpeedX;

    p2movement();

    if (ballX > canvas.width) {
        if (ballY > rightPaddleY &&
            ballY < rightPaddleY + rightPaddleH) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (rightPaddleY + rightPaddleH / 2);
            ballSpeedY = deltaY * 0.3;

        } else {
            rightScore++;
            ballReset();
        }
    }

    if (ballX < 0) {
        if (ballY > leftPaddleY &&
            ballY < leftPaddleY + leftPaddleH) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (leftPaddleY + leftPaddleH / 2);
            ballSpeedY = deltaY * 0.3;

        } else {
            leftScore++;
            ballReset();
        }

    }

    if (ballY > canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY
    }

    if (ballY < 0 + ballSize) {
        ballSpeedY = -ballSpeedY
    }

}

function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        roundRect(canvas.width / 2 - 4, i, 8, 20, 4, 'white')
    }
}

function drawAll() {

    //Fill cavnvas to blank screen
    colourRect(0, 0, canvas.width, canvas.height, 'white');
    roundRect(0, 0, canvas.width, canvas.height, 40, 'black');

    drawNet();

    if (showingWinScreen) {

        if (rightScore >= WINNING_SCORE) {
            colourText("Player 1 wins!", 70, 150, '40px', 'yellow');
        } else {
            colourText("Player 2 wins!", 460, 150, '40px', 'yellow');
        }
        colourText("Click to continue!", 80, 350, '30px', 'green');
        return;
    }
    //Draw ball
    colourBall(ballX, ballY, ballSize, 'red');

    //Draw left paddle
    roundRect(leftPaddleX, leftPaddleY, leftPaddleW, leftPaddleH, 6, 'white');

    //Draw right paddle
    roundRect(rightPaddleX, rightPaddleY, rightPaddleW, rightPaddleH, 6, 'white');

    //Draw score text
    colourText(rightScore, 180, 150, '40px', 'yellow');
    colourText(leftScore, canvas.width - 220, 150, '40px', 'yellow');

    if (actionPaused) {
        colourText("Click to continue!", 80, 350, '30px', 'lawngreen');
        return;
    }

}

function colourRect(x, y, w, h, colour) {
    canvasContext.fillStyle = colour;
    canvasContext.fillRect(x, y, w, h);
}

function colourBall(x, y, r, colour) {
    with (canvasContext) {
        fillStyle = colour;
        beginPath();
        arc(x, y, r, 0, Math.PI * 2, true);
        fill();
    }
}

function roundRect(x, y, w, h, r, colour) {
    with (canvasContext) {
        fillStyle = colour;
        lineWidth = 5;
        beginPath();
        moveTo(x + r, y);
        lineTo(x + w - r, y);
        arcTo(x + w, y, x + w, y + r, r);
        lineTo(x + w, y + h - r);
        arcTo(x + w, y + h, x + w - r, y + h, r);
        lineTo(x + r, y + h);
        arcTo(x, y + h, x, y + h - r, r);
        lineTo(x, y + r);
        arcTo(x, y, x + r, y, r);
        fill();
    }
}

function colourText(text, x, y, size, colour) {
    with (canvasContext) {
        fillStyle = colour;
        font = size + " Arial";
        fillText(text, x, y);
    }
}