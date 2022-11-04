function newWorld(rows,cols,density) {
    world = {};world.rows = rows;world.cols = cols;world.cells = [];
    for (let row = 0 ; row < rows ; row++) { 
        for (let col = 0 ; col < cols ; col++) {
            if (Math.random() < density) {world.cells.push(1);} else {world.cells.push(0);}
        }
    }
    return world;
}
function newConnectionsMap(rows, cols) {
    return {
        rows : rows,
        cols : cols,
        cell_data : new Array(rows*cols).fill(0),
        get_cell : function(row,col) {
            if (row >= 0 && row < this.rows && col >=0 && col < this.cols) {
                return this.cell_data[row*this.cols + col];
            } else {
                return undefined;
            }
        },
        set_cell : function( row, col, value) {
            if (row >= 0 && row < this.rows && col >=0 && col < this.cols) {
                this.cell_data[row*this.cols + col] = value;
            }
        },

    };
}
function showWorld(world) {
    for (let row = 0 ; row < world.rows ; row++) {
        for (let col = 0 ; col < world.cols ; col++) {
            process.stdout.write(`${avatarOf(world.cells[row*world.cols+col])} `);
        }
        process.stdout.write("\n");
    }
}

function avatarOf(pieceCode) {
    switch(pieceCode) {
        case 0  : return "O";
        case 1  : return "I";
        default : return "?";
    }
}
function setColor(r,g,b) {
	process.stdout.write(`\x1B[38;2;${r};${g};${b}m`);
}
function activateBoldText() {
    process.stdout.write(`\x1B[1m`);
}
function deactivateBoldText() {
    process.stdout.write(`\x1B[22m`);
}
function activateReverseText() {
    process.stdout.write(`\x1B[7m`);
}
function deactivateReverseText() {
    process.stdout.write(`\x1B[27m`);
}
function activateBlinkingText() {
    process.stdout.write(`\x1B[5m`);
}
function deactivateReverseText() {
    process.stdout.write(`\x1B[27m`);
}

function connectionWorld(target_row, target_col, source_world, rounds) {
    let counter = 2;
    let connection_world = newConnectionsMap(source_world.rows,source_world.cols);
    if (source_world.cells[target_row*source_world.cols + target_col] == 1 ) {
        connection_world.set_cell(target_row,target_col,1);
    }
    for (let round = 1 ; round <= rounds; round++) {
        for (let row = 0; row < connection_world.rows ; row++) {
            for (let col = 0 ; col  <= connection_world.cols; col++) {
                if (connectionAdjacent(connection_world, row, col) && source_world.cells[row*connection_world.cols + col] == 1  ) {
                    if (connection_world.get_cell(row, col) == 0) {
                        connection_world.set_cell(row, col,counter);
                        counter++;
                    }
                }           
            }
        }
    }
    return connection_world;
}

function connectionAdjacent(connection_world, check_row, check_col) {
    //does not count itself as proximate connection
    for (let row_mod = -1; row_mod <= 1; row_mod++) {
        for (let col_mod = -1; col_mod <= 1; col_mod++) {
            this_row = check_row + row_mod; this_col = check_col + col_mod;
            if ((this_row != check_row) || (this_col != check_col)) {
                if (this_row >= 0 && this_row < connection_world.rows && this_col >= 0 && this_col < connection_world.cols ) {
                    if (connection_world.get_cell(this_row, this_col) > 0 ) {
                            return true;
                    }
                }
            }

        }
    }
    return false;
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function displayCluster(source_world,source_row,source_col) {
    connection_world = connectionWorld(source_row, source_col, source_world,source_world.rows+1);
    for (let row = 0 ; row < world.rows ; row++) {
        for (let col = 0 ; col < world.cols ; col++) {
            if (connection_world.get_cell(row,col) > 0) {
                setColor(255,0,0);activateReverseText();

                //process.stdout.write(`${avatarOf(connection_world.cells[row*world.cols+col])} `);
                process.stdout.write(pad(connection_world.get_cell(row,col),2) + ' ');
                deactivateReverseText();setColor(255,255,255);
            } else {
                setColor(255,255,255);
                //process.stdout.write(pad(source_world.cells[row*world.cols+col],2) + ' ');
                process.stdout.write(` ${avatarOf(source_world.cells[row*world.cols+col])} `);
                //process.stdout.write(pad(0,2) + ' ');
            }
        }
        process.stdout.write("\n");
    }
}
//setColor(255,0,0);
new_world = newWorld(24,38,0.5);
//showWorld(new_world);
target_row = Math.floor(Math.random() * new_world.rows);
target_col = Math.floor(Math.random() * new_world.cols);
new_world.cells[target_row*new_world.cols + target_col] = 1;
displayCluster(new_world,target_row,target_col);
// c = connectionWorld(0,0,new_world);
// setColor(255,0,0);
// showWorld(c);

// setColor(255,255,255);