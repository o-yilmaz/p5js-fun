var cols = 25;
var rows = 25;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];

function Spot(x, y) {
    this.x = x;
    this.y = y;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous;

    this.show = function (color) {
        fill(color);
        noStroke();
        rect(this.x * w, this.y * h, w, h);
    }

    this.addNeighbors = function (grid) {
        var x = this.x;
        var y = this.y;
        // check edges
        if (x < cols - 1)
            this.neighbors.push(grid[x + 1][y]);
        if (x > 0)
            this.neighbors.push(grid[x - 1][y]);
        if (y > 0)
            this.neighbors.push(grid[x][y - 1]);
        if (y < rows - 1)
            this.neighbors.push(grid[x][y + 1]);
    }
}

function setup() {
    createCanvas(600, 600);

    w = width / cols;
    h = height / rows;

    // make a 2d array
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // adding spots
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    // adding neighbors of spots
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[13][9];

    openSet.push(start);

    console.log(grid);
}

function draw() {
    background(255, 255, 255);
    background(0, 0, 0, 150);

    if (openSet.length > 0) {
        // keep going
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];

        if (current === end) {            
            noLoop();
            console.log("Done!");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                var tempG = current.g + 1;

                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }

    } else {
        // can't reach end
    }

    for (var i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            grid[i][j].show(color(0, 0, 150));
        }
    }

    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(0));
    }

    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(255, 0, 0));
    }

    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    for (var i = 0; i < path.length; i++) {
        path[i].show(color(0, 255, 0));
    }
}


// Helpers
function removeFromArray(arr, item) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == item)
            arr.splice(i, 1);
    }
}

function heuristic(a, b) {
    return abs(a.x - b.x) + abs(a.y - b.y);
}