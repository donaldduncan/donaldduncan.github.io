//Canvas variables
var canvas;
var canvasContext;

//Ball variables
var ballX = 400;
var ballSpeedX = -10;
var ballY = 200;
var ballSpeedY = 4;
var ballSize = 12;

//Player 1 variables
var leftPaddleX = 30;
var leftPaddleY = 250;
var leftPaddleW = 20;
var leftPaddleH = 100;

//Player 2 variables
var rightPaddleX = 800 - leftPaddleX - leftPaddleW;
var rightPaddleY = 250;
var rightPaddleW = leftPaddleW;
var rightPaddleH = 100;

//Score variables
var leftScore = [ 0, 0 ];
var rightScore = [ 0, 0 ];
const WINNING_SCORE = 3;
var actionPaused = true;
var showingWinScreen = 0;
var level = 1;
var accumulator = 1;
var difficulty = 1

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
        leftScore[0] = 0;
        rightScore[0] = 0;
        showingWinScreen = false;
    } else if (actionPaused) {
        actionPaused = false;
    }
    evt.preventDefault();
}


window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 60;
    setInterval(function () {
        drawAll();
        moveAll();
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove',
        function (evt) {
            var mousePos = calculateMousePos(evt);
            leftPaddleY = mousePos.y - leftPaddleH / 2;
//            rightPaddleY = mousePos.y - rightPaddleH / 2;
            //if (leftPaddleY > canvas.height - paddleVOffset - (leftPaddleH/2)) { leftPaddleY = canvas.height - paddleVOffset - (leftPaddleH/2) }
            //if (leftPaddleY < paddleVOffset) { leftPaddleY = paddleVOffset }
            //rightPaddleY = mousePos.y - rightPaddleH / 2;
            //document.getElementById('infobox').innerHTML = "rightPaddleX = " + rightPaddleX + " "+(canvas.width - rightPaddleX - rightPaddleW)+ "<br>ballX = " + ballX;
            //document.getElementById('infobox').innerHTML = ("canvas.width = " + canvas.width + " ; <br>canvas.clientWidth = " + canvas.clientWidth + " ;<br> canvas.height = " + canvas.height + " ;<br> canvas.clientHeight = " + canvas.clientHeight + " ;<br> mouseX = " + mousePos.x + " ;<br> mouseY = " + mousePos.y);
        });

    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('touchstart', handleMouseClick, true);

    canvas.addEventListener('touchmove', function (evt) {
        var touchobj = evt.touches[0];
        leftPaddleY = (parseInt(touchobj.clientY) - leftPaddleH / 2) * (canvas.width / canvas.clientWidth);
        //if (leftPaddleY > canvas.height - paddleVOffset) { leftPaddleY = canvas.height - paddleVOffset }
        //if (leftPaddleY < paddleVOffset) { leftPaddleY = paddleVOffset }
        //rightPaddleY = parseInt(touchobj.clientY);

        evt.preventDefault();
    }, true);
}

function ballReset() {
    if (rightScore[0] >= WINNING_SCORE) {
        rightScore[1]++
        level++
        if (level > accumulator) { accumulator++ }
        showingWinScreen = 1
    } else if (leftScore[0] >= WINNING_SCORE) {
        leftScore[1]++
        showingWinScreen = 2;
        if (level !== 1) { level-- }
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
        rightPaddleY += difficulty * level;
    } else if (rightPaddleYcentre > ballY + 35) {
        rightPaddleY -= difficulty * level;
    }
    //if (rightPaddleY > canvas.height - paddleVOffset) { rightPaddleY = canvas.height - paddleVOffset }
    //if (rightPaddleY < paddleVOffset) { rightPaddleY = paddleVOffset }
}

function moveAll() {
    if (showingWinScreen > 0 || actionPaused) { return; }

    ballY += ballSpeedY
    ballX += ballSpeedX;

    p2movement();

    if (ballX > rightPaddleX - (rightPaddleW/2) &&
        ballX < rightPaddleX + (rightPaddleW/2) &&
        ballY > rightPaddleY - (0.1 * rightPaddleH) &&
        ballY < rightPaddleY + (1.1 * rightPaddleH)) {
        ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (rightPaddleY + rightPaddleH / 2);
            ballSpeedY = deltaY * 0.3;

        } else if(ballX > canvas.width - rightPaddleX &&
                  ballX < canvas.width) {
        } else if (ballX > canvas.width) {
            rightScore[0]++;
            ballReset();
        }

    if (ballX < 0 + leftPaddleX + (1.5 * leftPaddleW) &&
        ballX > 0 + leftPaddleX + (0.5 *leftPaddleW) &&
        ballY > leftPaddleY - (0.1 * leftPaddleH) &&
        ballY < leftPaddleY + (1.1 * leftPaddleH)) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (leftPaddleY + leftPaddleH / 2);
            ballSpeedY = deltaY * 0.15;

        } else if(ballX < 0 + leftPaddleX + leftPaddleW &&
                  ballX > 0) {
        } else if (ballX < 0) {
            leftScore[0]++;
            ballReset();
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

    //Draw left paddle and score
    roundRect(leftPaddleX, leftPaddleY, leftPaddleW, leftPaddleH, 10, 'white');
    textImpact(rightScore[0], 390, 225, '300px', 'white','right'); // This game
    //textImpact(rightScore[1], 380, 45, '50px', 'black','right');  // Game counter

    //Draw right paddle and score
    roundRect(rightPaddleX, rightPaddleY, rightPaddleW, rightPaddleH, 10, 'white');
    textImpact(leftScore[0], canvas.width-390, 625, '300px', 'white', 'left'); // This game
    //textImpact(leftScore[1], canvas.width-380, 600, '50px', 'black', 'left');  // Game counter
    textImpact("Level: " + level, 400, 50, '40px', 'goldenrod', 'center');
    textImpact("[ Best: " + accumulator + " ]", 400, 75, '20px', 'goldenrod', 'center');

    switch (showingWinScreen) {

        case 1:
            textArial("Player 1 wins!", 420, 100, '40px', 'white', 'left');
            textArial("Click to play again!", 400, 325, '50px', 'lawngreen', 'center');
            return;
            break;

        case 2:
            textArial("Player 2 wins!", 380, 580, '40px', 'white', 'right');
            textArial("Click to play again!", 400, 325, '50px', 'lawngreen', 'center');
            return;
            break;
    }

    if (actionPaused) {
        textArial("Click to continue!", 400, 325, '50px', 'lawngreen', 'center');
        return;
    }

    //Draw ball
    colourBall(ballX, ballY, ballSize, 'red');

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

function textImpact(text, x, y, size, colour, align) {
    with (canvasContext) {
        fillStyle = colour;
        font = size + " Anton, Impact, sans-serif";
        textAlign = align;
        strokeStyle = 'white';
        lineWidth = 5;
        strokeText(text, x, y);
        strokeStyle = 0;
        lineWidth = 0;
        fillText(text, x, y);
    }
}

function textArial(text, x, y, size, colour, align) {
    with (canvasContext) {
        fillStyle = colour;
        font = size + " Arial, Helvetica, sans-serif";
        textAlign = align;
        fillText(text, x, y);
    }
}