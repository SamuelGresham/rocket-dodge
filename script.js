
// Todo for next time 
//  - Fuel tank functionality 
//  - Better art / interface design 
//  - High score function 
//  - Designing / adding sound effects
//  - Spacing out asteroids

// Todo for me not streaming
//  - Try to figure out why some asteroids pause for a while 
//  - Refine the maths behind level speed/asteroid density 

const NUM_ROWS = 19;
const NUM_COLS = 19;

const shipimg = "<img class='icon' src='./assets/rocket.png'>'";
const astimg = "<img class='icon' src='./assets/asteroid.png'>'";

frame = 0;

game_data = {
    lost: 0,
    level: 1
}

ship = {
    xpos: 9,
    ypos: 16
}

asteroids = [];

game = [[]];

document.addEventListener("keydown", function (john) {
    if (john.code == "ArrowLeft" && ship.xpos > 0) {
        ship.xpos += -1;
    } else if (john.code == "ArrowRight" && ship.xpos < 18) {
        ship.xpos += 1;
    }
})

function start () {
    create_blank_gameboard();
    place_items()
}

function create_blank_gameboard () {
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            document.getElementById("content").innerHTML += "<div class='space' id='" + row + "," + col + "'></div>";
        }
        document.getElementById("content").innerHTML += "<br>";
    }

}

/*
function setup_game () {
    for (let row = 0; row < NUM_ROWS; row++) {
        game[row] = new Array(NUM_COLS);
        for (let col = 0; col < NUM_COLS; col++) {
            game[row][col] = 0;
        }
    }
}
*/

function clear () {
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            document.getElementById(row + "," + col).innerHTML = "";
        }
    }
}

function place_items () {
    // Placing the ship down 
    document.getElementById(ship.ypos + "," + ship.xpos).innerHTML = shipimg;

    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i].ypos != undefined) {
            document.getElementById(asteroids[i].ypos + "," + asteroids[i].xpos).innerHTML = astimg;
        }
    }

    document.getElementById("level").innerHTML = "Level " + game_data.level;


}

function start_button_press () {
    game_data.lost = 1;
    setTimeout(() => {
        document.getElementById("title").innerHTML = "Rocket Dodge";
        document.getElementById("title").style = "color: white;"
        clear();
        asteroids = [];
        game_data.level = 1;
        game_data.lost = 0;
        ship.xpos = 9;
        frame = 0;
        loop();
    }, 100);
}

function loop () {
    frame++;

    if (frame > game_data.level*1000) {
        game_data.level++;
    }

    seed_asteroids();
    clear();
    move_asteroids(frame);
    place_items();
    if (!game_data.lost) {
        window.requestAnimationFrame(loop);
    } else {
        document.getElementById("title").innerHTML = "You lost, loser!";
        document.getElementById("title").style = "color: red;";
    }
}

function move_asteroids (frame) {
    if (frame % Math.floor(50/game_data.level) == 0) {
        for (let i = 0; i < asteroids.length; i++) {
        
            asteroids[i].ypos++; 
            
            if (asteroids[i].ypos == ship.ypos && asteroids[i].xpos == ship.xpos) {
                game_data.lost = 1;
            }

            if (asteroids[i].ypos > 18) {
                asteroids.splice(i,1);
            }

            
        }
    }
}

function seed_asteroids() {
    var num = Math.random();

    if (num > (0.99 - game_data.level/75)) {
        var col = Math.floor(Math.random()*19);
        var temp = {
            ypos: 0,
            xpos: col,
            velocity: 1
        }
        asteroids.push(temp);
    }
}

