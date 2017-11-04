var cols = 50;
var rows = 50;
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
    this.wall = false;

    if (random(1) < 0.4)
        this.wall = true;

    this.show = function (color) {
        fill(color);
        if (this.wall) {
            fill(0);
        }
        noStroke();
        rect(this.x * w, this.y * h, w, h);
    }

    this.addNeighbors = function (grid) {
        var x = this.x;
        var y = this.y;

        if (x < cols - 1)
            this.neighbors.push(grid[x + 1][y]);
        if (x > 0)
            this.neighbors.push(grid[x - 1][y]);
        if (y > 0)
            this.neighbors.push(grid[x][y - 1]);
        if (y < rows - 1)
            this.neighbors.push(grid[x][y + 1]);
        if (x > 0 && y > 0)
            this.neighbors.push(grid[x - 1][y - 1]);
        if (x < cols - 1 && y > 0)
            this.neighbors.push(grid[x + 1][y - 1]);
        if (x > 0 && y < rows - 1)
            this.neighbors.push(grid[x - 1][y + 1]);
        if (x < cols - 1 && y < rows - 1)
            this.neighbors.push(grid[x + 1][y + 1]);
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
    end = grid[cols - 1][rows - 1];

    start.wall = false;
    end.wall = false;

    openSet.push(start);
}

function draw() {
    background(255, 255, 255);

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

            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                var tempG = current.g + 1;
                var newPath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }
    } else {
        // can't reach end
        document.getElementById("noSolution").hidden = false;
        noLoop();
        return;
    }

    for (var i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(100));
    }

    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(255, 100, 100));
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
    return dist(a.x, a.y, b.x, b.y);
}