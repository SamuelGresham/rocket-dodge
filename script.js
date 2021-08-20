// Size of the gameboard
var NUM_ROWS = 15;
const NUM_COLS = 19;

new Audio('./assets/level-up.mp4');
new Audio('./assets/refuel_2.mp4');
new Audio("./assets/fuel-low.mp4");
new Audio("./assets/fuel-low.mp3");

var window_height = window.innerHeight;
NUM_ROWS = Math.floor(window_height/ 50)

window.onresize = function () {
    var window_height = window.innerHeight;
    console.log("Resized to " + window_height)
    NUM_ROWS = Math.floor(window_height/ 50)
}

// Sources for icon images
const shipimg = "<img class='icon ship' src='./assets/rocket.png'>";
const astimg = "<img class='icon' src='./assets/asteroid.png'>";
const fuelimg = "<img class='icon' src='./assets/fuel.png'>";

// Set the current frame to 0
frame = 0;

// Global game data
game_data = {
    lost: 0,
    level: 1,
    started: 0,
    last_frame_run: 0,
    score: 0
}

// Ship position data
ship = {
    xpos: 9,
    ypos: NUM_ROWS - 3, 
    fuel: 100
}

// List of asteroids
asteroids = [];

fuels = [];

// Event listener for keydown events
document.addEventListener("keydown", function (john) {
    if ((john.code == "ArrowLeft" || john.code == "KeyA") && ship.xpos > 0) {
        ship.xpos += -1;
        fuels.forEach((element, i) => {
            if (ship.xpos == element.xpos && ship.ypos == element.ypos) {
                ship.fuel += 20;
                fuels.splice(i,1);
                var refuel_audio = new Audio('./assets/refuel_2.mp4');
                refuel_audio.play()
                if (ship.fuel > 100) {
                    ship.fuel = 100;
                }
            }
        });
    } else if ((john.code == "ArrowRight" || john.code == "KeyD") && ship.xpos < (NUM_COLS - 1)) {

        ship.xpos += 1;
        fuels.forEach((element, i) => {
            if (ship.xpos == element.xpos && ship.ypos == element.ypos) {
                ship.fuel += 20;
                fuels.splice(i,1);
                var refuel_audio = new Audio('./assets/refuel_2.mp4');
                refuel_audio.play()
                if (ship.fuel > 100) {
                    ship.fuel = 100;
                }
            }
        });
    }
})

// Run when the page has loaded
function start () {
    let highScore = localStorage.getItem("rocketdodge_highscore");

    if (highScore == null) {
        localStorage.setItem("rocketdodge_highscore", 0);
        document.getElementById("high_score").innerHTML = "High Score: 0 :("
    } else {
        document.getElementById("high_score").innerHTML = "High Score: " + highScore;
    }
    
    create_blank_gameboard();
    place_items();
}

// Builds the DOM structure
function create_blank_gameboard () {
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            document.getElementById("content").innerHTML += "<div class='space' id='" + row + "," + col + "'></div>";
        }
        document.getElementById("content").innerHTML += "<br>";
    }

}

// Clears the divs on the page
function clear () {
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            document.getElementById(row + "," + col).innerHTML = "";
        }
    }
}

// Places the ships and asteroids on the page
function place_items () {
    // Placing the ship down 
    document.getElementById(ship.ypos + "," + ship.xpos).innerHTML = shipimg;

    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i].ypos != undefined && asteroids[i].ypos != null) {
            document.getElementById(asteroids[i].ypos + "," + asteroids[i].xpos).innerHTML = astimg;
        }
    }

    for (let i = 0; i < fuels.length; i++) {
        if (fuels[i].ypos != undefined) {
            document.getElementById(fuels[i].ypos + "," + fuels[i].xpos).innerHTML = fuelimg;
        }
    }

    document.getElementById("level").innerHTML = "Level " + game_data.level;
}

// Runs when the start button is pressed
function start_button_press () {
    // Mark the game as lost
    game_data.lost = 1;
    // Wait for any final animation frames to proceed before reseting game status as won 
    setTimeout(() => {
        document.getElementById("title").innerHTML = "Rocket Dodge";
        document.getElementById("title").style = "color: white;"
        clear();
        // Reset all the global game data (should probably be a function but whatever)
        // Set the current frame to 0
        frame = 0;

        // Global game data
        game_data = {
            lost: 0,
            level: 1,
            started: 0,
            last_frame_run: 0,
            score: 0
        }

        // Ship position data
        ship = {
            xpos: 9,
            ypos: NUM_ROWS - 3, 
            fuel: 100
        }

        // List of asteroids
        asteroids = [];

        fuels = [];
        // Begin the game loop (again)
        loop();
    }, 100);
}

// The main game loop
function loop (timestamp) {
    frame++;

    // Level up
    if (frame > game_data.level*1000) {
        game_data.level++;
        var l_up_audio = new Audio('./assets/level-up.mp4');
        l_up_audio.play();
        
    }

    if (timestamp && (timestamp - game_data.last_frame_run > (500/game_data.level) || game_data.started == 0)) {
        ship.fuel += -1;
        document.getElementById("fuel").innerHTML = "Fuel Level: " + ship.fuel + "%";

        if (ship.fuel <= 0) {
            game_data.lost = 1;
        } 
        
        if (ship.fuel <= 20) {
            if (ship.fuel == 20) {
                var a1 = new Audio("./assets/fuel-low.mp4")
                var a2 = new Audio("./assets/fuel-low.mp3")
                a1.play()
                a2.play()
            }
            document.getElementById("fuel").style = "color: red;"
        } else {
            document.getElementById("fuel").style = "color: white;"
        }

        game_data.started = 1;
        game_data.last_frame_run = timestamp;
        
        // Do lots of things
        seed_asteroids();
        seed_fuel();
        move_fuels();
        move_asteroids();
        
    }
    clear();
    place_items();
    if (!game_data.lost) {
        window.requestAnimationFrame(loop);
        document.getElementById("current_score").innerHTML = "Current Score: " + game_data.score;
    } else {
        var die_audio = new Audio('./assets/lost.mp4');
        die_audio.play()
        if (ship.fuel > 0) {
            document.getElementById("title").innerHTML = "You crashed!";
        } else {
            document.getElementById("title").innerHTML = "You ran out of fuel!";
        }
        document.getElementById("title").style = "color: red;";
        const prev = localStorage.getItem("rocketdodge_highscore");

        if (prev < game_data.score) {
            localStorage.setItem("rocketdodge_highscore", game_data.score);
            document.getElementById("high_score").innerHTML = "High Score: " + game_data.score;
        }
    }
    
}

function move_asteroids () {
    if (asteroids.length != 0) {
        for (let i = asteroids.length - 1; i >= 0; i += -1) {
            asteroids[i].ypos++; 
                
            if (asteroids[i].ypos == ship.ypos && asteroids[i].xpos == ship.xpos) {
                game_data.lost = 1;
            }

            if (asteroids[i].ypos > (NUM_ROWS - 1)) {
                asteroids.splice(i,1);
                game_data.score++;
            }
        }
    }
}

function move_fuels () {
    for (let i = fuels.length - 1; i >= 0; i+= -1) {
      
        fuels[i].ypos++; 
            
        if (fuels[i].ypos == ship.ypos && fuels[i].xpos == ship.xpos) {
            var refuel_audio = new Audio('./assets/refuel_2.mp4');
            refuel_audio.play()
            ship.fuel += 20;
            fuels.splice(i,1);

            if (ship.fuel > 100) {
                ship.fuel = 100;
            }
        }

        if (fuels[i] && fuels[i].ypos > (NUM_ROWS - 1)) {
            fuels.splice(i,1);
        }
    }
}

function seed_asteroids() {
    var num = Math.random();

    if (num > (0.5 - game_data.level/75)) {
        var col = Math.floor(Math.random()*NUM_COLS);
        var temp = {
            ypos: 0,
            xpos: col,
            velocity: 1
        }
        asteroids.push(temp);
    }
}

function seed_fuel () {
    var num = Math.random();

    if (num > (0.95 - game_data.level/75) || ship.fuel == 20) {
        var col = Math.floor(Math.random()*NUM_COLS);
        var cont = 1;
        asteroids.forEach(element => {
            if (element.xpos == col && element.ypos < 3) {
                cont = 0;
            }
        });
        if (cont) {
            var temp = {
                ypos: 0,
                xpos: col,
                velocity: 1
            }
            fuels.push(temp);
        }
    }
}
