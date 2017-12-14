var pjs = new PointJS(714, 400, {});

var log = pjs.system.log;     // log = console.log;
var game = pjs.game;           // Game Manager
var point = pjs.vector.point;   // Constructor for Point
var camera = pjs.camera;         // Camera Manager
var brush = pjs.brush;          // Brush, used for simple drawing
var OOP = pjs.OOP;            // Objects manager
var tiles = pjs.tiles;            // Objects manager
var math = pjs.math;
var key = pjs.keyControl;
var v = pjs.vector.v2d;
key.initKeyControl();

var width = game.getWH().w; // width of scene viewport
var height = game.getWH().h; // height of scene viewport

pjs.system.setTitle('PointJS Game'); // Set Title for Tab or Window
var stumpArr = [];
var score = 0;
var helpScore = 0;
var lives = 3;

var scoreAchieve = 'No';

var spaceLock = 0;
// Game Loop
game.newLoopFromConstructor('myGame', function () {
    var bg1 = game.newImageObject({
        x: 0, y: 0,
        file: 'bg.png',
        h: height,
        onload: function () {
            bg2.x = bg1.x + bg1.w;
        },
    });
    var bg2 = game.newImageObject({
        x: bg1.x + bg1.w, y: 0,
        file: 'bg.png',
        h: height
    });

    var gr1 = game.newImageObject({
        x: 0, y: 0,
        file: 'gr.png',
        w: width,
        onload: function () {
            gr2.y = gr1.y = height - gr1.h;
            gr2.x = gr1.x + gr1.w;
        },
    });

    var gr2 = game.newImageObject({
        x: gr1.x + gr1.w, y: 0,
        file: 'gr.png',
        w: width,
        onload: function () {
            runner.y = gr1.y - runner.h / 1.5;
        }
    });
    var runner = game.newAnimationObject({
        x: width / 5, y: 0,
        h: 124,
        w: 79,
        delay: 6,
        animation: tiles.newAnimation('running.png', 79, 124, 6),
    });

    var scoreText = game.newTextObject({
        x: 0, y: 0,
        size: 15,
        color: '#000',
        text: 'Score: ' + score,
        font: 'Courier'
    });

    var achievements = game.newTextObject({
        x: 530, y: 0,
        size: 15,
        color: '#000',
        text: '',
        font: 'Courier'
    });

    var moveBackGround = function (s) {
        bg1.move(point(-s / 2, 0));
        bg2.move(point(-s / 2, 0));

        gr1.move(point(-s, 0));
        gr2.move(point(-s, 0));

        for (let stumps of stumpArr) {
            stumps.move(point(-s, 0));
        }
        if (gr1.x + gr1.w < 0) {
            gr1.x = gr2.x + gr2.w;
        }

        if (gr2.x + gr2.w < 0) {
            gr2.x = gr1.x + gr1.w;
        }

        if (bg1.x + bg1.w < 0) {
            bg1.x = bg2.x + bg2.w;
        }

        if (bg2.x + bg2.w < 0) {
            bg2.x = bg1.x + bg1.w;
        }
    };
    var generateStump = function (counter) {
        let stump1 = game.newImageObject({
            x: (width / 3) + counter, y: 237,
            file: 'stump.png',
            w: 100,
        });
        stumpArr.push(stump1);
    };

    this.update = function () {
        helpScore++;
        if (helpScore % 50 === 0) {
            score++;
        }

        game.clear();
        bg1.draw();
        bg2.draw();
        gr1.draw();
        gr2.draw();
        scoreText.text = 'Score: ' + score;
        scoreText.draw();
        if (score >= 100) {
            scoreAchieve = 'Yes';
        }
        achievements.text = "Score 100 points:" + scoreAchieve;
        achievements.draw();
        let counter = Math.floor((Math.random() * 2000 - 1200) + 1200);
        let chance = Math.floor((Math.random() * 30) + 1);
        if (chance === 3) {
            generateStump(counter);
        }
        for (let stumps of stumpArr) {
            stumps.draw();
        }
        if (key.isDown('SPACE') && runner.y >= 0) {
            runner.move(point(0, -3));
        }

        if (runner.y <= 155.83 && !key.isDown('SPACE')) {
            runner.move(point(0, 3));
        }

        for (let stumps of stumpArr) {
            if (runner.x >= stumps.x - 30 && runner.x <= stumps.x + 50 && runner.y + 90 >= stumps.y) {
                game.setLoop('endGame');
            }
        }
        runner.draw();
        moveBackGround(5);
    };

    this.entry = function () { // optional
    };

    this.exit = function () { // optional
        log('myGame is stopped');
    };

});
game.newLoopFromConstructor('menu', function () {
    var startText = game.newTextObject({
        positionC: point(game.getWH2().w, game.getWH2().h),
        size: 30,
        color: '#000000',
        text: 'Press SPACE to start game',
        font: 'Courier'
    });

    this.update = function () {
        game.clear();
        startText.draw();
        if (key.isPress('SPACE')) {
            stumpArr = [];
            game.startLoop('myGame');

        }

    };
});
game.newLoopFromConstructor('endGame', function () {
    var endText = game.newTextObject({
        positionC: point(game.getWH2().w, game.getWH2().h),
        size: 30,
        color: '#000',
        text: 'You lose,\nPress SPACE to start new game',
        font: 'Courier'
    });
    var scoreText = game.newTextObject({
        positionC: point(game.getWH2().w, game.getWH2().h),
        size: 30,
        color: '#000',
        text: '',
        font: 'Courier'
    });
    var lifeText = game.newTextObject({
        positionC: point(game.getWH2().w / 3, game.getWH2().h / 2),
        size: 30,
        color: '#000',
        text: '',
        font: 'Courier'
    });

    this.update = function () {
        game.clear();
        if (lives < 1) {
            endText.draw();
            scoreText.text = 'Your final score is: ' + score;
            scoreText.y = endText.y / 2;
            scoreText.x = endText.x / 2;
            scoreText.draw();
        } else {
            lifeText.text = 'Press SPACE to continue, your lives: ' + lives;
            lifeText.draw();

            scoreText.text = 'Your score is: ' + score;
            scoreText.draw();
        }

        if (key.isPress('SPACE')) {
            stumpArr = [];
            lives--;
            if (lives < 0) {
                score = 0;
                lives = 3;
            }
            game.setLoop('myGame');
        }

    };
});
game.startLoop('menu');

