// Daniel Shiffman
// Neuro-Evolution Flappy Bird with TensorFlow.js
// http://thecodingtrain.com
// https://youtu.be/cdUNkwXx-I4

const TOTAL = 250;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;

let c1, c2;
let scroll = 0;

function keyPressed() {
    if (key === "S") {
        let bird = birds[0];
        saveJSON(bird.brain, "bird.json");
    }
}

function setup() {
    createCanvas(900, 1200);
    tf.setBackend("cpu");
    slider = createSlider(1, 10, 1);
    for (let i = 0; i < TOTAL; i++) {
        birds[i] = new Bird();
    }

    c1 = color(52, 197, 162);
    c2 = color(137, 106, 228);
}

function draw() {
    for (let n = 0; n < slider.value(); n++) {
        if (counter % 75 == 0) {
            pipes.push(new Pipe());
        }
        counter++;

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].update();

            for (let j = birds.length - 1; j >= 0; j--) {
                if (pipes[i].hits(birds[j])) {
                    savedBirds.push(birds.splice(j, 1)[0]);
                }
            }

            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
            }
        }

        for (let i = birds.length - 1; i >= 0; i--) {
            if (birds[i].offScreen()) {
                savedBirds.push(birds.splice(i, 1)[0]);
            }
        }

        for (let bird of birds) {
            bird.think(pipes);
            bird.update();
        }

        if (birds.length === 0) {
            counter = 0;
            nextGeneration();
            pipes = [];
        }
    }

    // All the drawing stuff

    drawBackground();
    drawSinusoidalPattern();

    for (let bird of birds) {
        bird.show();
    }

    for (let pipe of pipes) {
        pipe.show();
    }

    scroll += 2;
}

function drawBackground() {
    for (let y = 0; y < height; y++) {
        const n = map(y, 0, height, 0, 1);
        const newc = lerpColor(c1, c2, n);
        stroke(newc);
        line(0, y, width, y);
    }
}

function drawSinusoidalPattern() {
    for (let x = 0; x < width; x++) {
        const y = map(sin(radians(x + scroll)), -1, 1, 300, 900);
        noStroke();
        fill(255, 255, 255);
        ellipse(x, y, 15, 15);
    }
}
