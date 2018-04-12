//Canvas variables
var canvas;
var ctx;

//Ball variables
var ballX = 400;
var ballSpeedX = -5;
var ballY = 200;
var ballSpeedY = 4;
var ballSize = 12;

//Player 1 variables
var p1X = 30;
var p1Y = 250;
var p1W = 20;
var p1H = 100;

//Player 2 variables
var p2X = 800 - p1X - p1W;
var p2Y = 250;
var p2W = p1W;
var p2H = 100;

//Score variables
var p1Score = [0, 0];
var p2Score = [0, 0];
const WINNING_SCORE = 3;
var gamePaused = true;
var winScreen = 0;
var gameLevel = 1;
var gameLevelHighest = 1;
var gameLevelMultiplier = 1;

//Event handlers

function calculateMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = (evt.clientX - rect.left - root.scrollLeft) * (canvas.width / canvas.clientWidth);
    let mouseY = (evt.clientY - rect.top - root.scrollTop) * (canvas.width / canvas.clientWidth);
    return {
        x: mouseX,
        y: mouseY
    }
}

function handleMouseClick(evt) {
    if (winScreen) {
        p1Score[0] = 0;
        p2Score[0] = 0;
        winScreen = 0;
    } else if (gamePaused) {
        gamePaused = false;
    }
    evt.preventDefault();
}


window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    var framesPerSecond = 60;
    setInterval(function () {
        drawAll();
        moveAll();
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove',
        function (evt) {
            var mousePos = calculateMousePos(evt);
            p1Y = mousePos.y - p1H / 2;
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
        p1Y = (parseInt(touchobj.clientY) - p1H / 2) * (canvas.width / canvas.clientWidth);
        //if (leftPaddleY > canvas.height - paddleVOffset) { leftPaddleY = canvas.height - paddleVOffset }
        //if (leftPaddleY < paddleVOffset) { leftPaddleY = paddleVOffset }
        //rightPaddleY = parseInt(touchobj.clientY);

        evt.preventDefault();
    }, true);
};


function ballReset() {
    if (p1Score[0] >= WINNING_SCORE) {
        p1Score[1]++
        gameLevel++
        ballSpeedX-=0.2;
        if (gameLevel > gameLevelHighest) { gameLevelHighest++ }
        winScreen = 1;
    } else if (p2Score[0] >= WINNING_SCORE) {
        p2Score[1]++
        winScreen = 2;
        if (gameLevel !== 1) { ballSpeedX-=0.1; gameLevel--; }
    } else {
        gamePaused = true;
    }

    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.floor(Math.random() * 12) - 6;

}

function p2movement() {
    let p2Ycentre = p2Y + p2H / 2;
    if (p2Ycentre < ballY - 35) {
        p2Y += (gameLevel/2) * gameLevelMultiplier;
    } else if (p2Ycentre > ballY + 35) {
        p2Y -= (gameLevel/2) * gameLevelMultiplier;
    }
}

function moveAll() {
    if (winScreen || gamePaused) { return; }

    ballY += ballSpeedY;
    ballX += ballSpeedX;

    p2movement();

    if (ballX > p2X - (p2W / 2) && ballX < p2X + (p2W / 2) &&
        ballY > p2Y - (0.1 * p2H) && ballY < p2Y + (1.1 * p2H)) {

        ballSpeedX = -ballSpeedX;

        var deltaY = ballY - (p2Y + p2H / 2);
        ballSpeedY = deltaY * 0.15;

    } else if (ballX > canvas.width - p2X &&
        ballX < canvas.width) {
    } else if (ballX > canvas.width) {
        p1Score[0]++;
        ballReset();
    }

    if (ballX < 0 + p1X + (1.5 * p1W) &&
        ballX > 0 + p1X + (0.5 * p1W) &&
        ballY > p1Y - (0.1 * p1H) &&
        ballY < p1Y + (1.1 * p1H)) {

        ballSpeedX = -ballSpeedX;

        var deltaY = ballY - (p1Y + p1H / 2);
        ballSpeedY = deltaY * 0.15;

    } else if (ballX < 0 + p1X + p1W &&
        ballX > 0) {
    } else if (ballX < 0) {
        p2Score[0]++;
        ballReset();
    }

    if (ballY > canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballY < 0 + ballSize) {
        ballSpeedY = -ballSpeedY;
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
    roundRect(p1X, p1Y, p1W, p1H, 10, 'white');
    //textImpact(rightScore[1], 380, 45, '50px', 'black','right');  // Game counter

    //Draw right paddle and score
    roundRect(p2X, p2Y, p2W, p2H, 10, 'white');
    //textImpact(leftScore[1], canvas.width-380, 600, '50px', 'black', 'left');  // Game counter

    
    if (winScreen == 1) {
        textArial("Player 1 wins!", 410, 225, '40px', 'white', 'left',0,1);
        textArial("Click to play again!", 400, 300, '50px', 'lawngreen', 'center', 'black', 5);
        textImpact(p1Score[0], 397, 225, '300px', 'black', 'right', 'white', 5);
        textImpact(p2Score[0], canvas.width - 397, 625, '300px', 'black', 'left', 'white', 5);
        return;
    } else if (winScreen == 2) {
        textArial("Player 2 wins!", 390, 580, '40px', 'white', 'right', 0,1);
        textArial("Click to play again!", 400, 300, '50px', 'lawngreen', 'center', 'black', 5);
        textImpact(p1Score[0], 397, 225, '300px', 'black', 'right', 'white', 5);
        textImpact(p2Score[0], canvas.width - 397, 625, '300px', 'black', 'left', 'white', 5);
        return;
    }

    //Draw score stuff
    textImpact(p1Score[0], 397, 225, '300px', 'white', 'right', 'white', 0);
    textImpact(p2Score[0], canvas.width - 397, 625, '300px', 'white', 'left');
    textImpact("Level: " + gameLevel, 400, 50, '40px', 'goldenrod', 'center', 'white', 5);
    textImpact("Best: " + gameLevelHighest, 400, 75, '20px', 'white', 'center', 'black', 3);

    if (gamePaused) {
        textArial("Click to continue!", 400, 325, '50px', 'lawngreen', 'center', 'black', 5);
        return;
    }

    //Draw ball
    colourBall(ballX, ballY, ballSize, 'red');

}

function colourRect(x, y, w, h, colour) {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, w, h);
}

function colourBall(x, y, r, colour) {
    with (ctx) {
        fillStyle = colour;
        beginPath();
        arc(x, y, r, 0, Math.PI * 2, true);
        fill();
    }
}

function roundRect(x, y, w, h, r, colour) {
    with (ctx) {
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

function textImpact(text, x, y, size, colour, align, lineColour, lWidth) {
    with (ctx) {
        fillStyle = colour;
        font = size + " Anton, Impact, sans-serif";
        textAlign = align;
        strokeStyle = lineColour;
        lineWidth = lWidth;
        strokeText(text, x, y);
        strokeStyle = 0;
        lineWidth = 0;
        fillText(text, x, y);
    }
}

function textArial(text, x, y, size, colour, align, lineColour, lWidth) {
    with (ctx) {
        fillStyle = colour;
        font = size + " Arial, Helvetica, sans-serif";
        textAlign = align;
        strokeStyle = lineColour;
        lineWidth = lWidth;
        strokeText(text, x, y);
        strokeStyle = 0;
        lineWidth = 0;
        fillText(text, x, y);
    }
}