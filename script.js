const blocks = document.querySelectorAll('.block');
const colours = document.querySelectorAll('.colour');
const indicator = document.querySelector('.indicator');
const pickerwrapper = document.querySelector('.pickerwrapper');
const canvas = document.querySelector('.canvas');
const reset = document.querySelector('.reset');
const save = document.querySelector('.save');
const load = document.querySelector('.load');
const fill = document.querySelector('.fill');
const rows = canvas.querySelectorAll('.row');
let colour = 'white';
let mousedownind = false;
let floodIndic = false;
colourpicker();
drawing();
palette();
resetpush();
savepush();
loadpush();
fillpush();
fillingTool();

for (block of blocks) {
    block.style.backgroundColor = 'white';
}

const grid = [];
for (i = 0; i < rows.length; i++) {
    rowblocks = rows[i].querySelectorAll('div');
    grid.push(rowblocks);
}

function palette() {
    for (i = 0; i < colours.length; i++) {
        colours[i].addEventListener('click', function(e) {
            colour = e.target.getAttribute('data-color');
            indicator.style.backgroundColor = colour;
        });
    }
}

//Bonus 1 - Improve the mouse so it behaves like a real paintbrush.

function drawing() {
    canvas.addEventListener('mouseover', function(e) {
        e.preventDefault();
        if (mousedownind && !floodIndic) {
            e.target.style.backgroundColor = colour;
        }
    });
    canvas.addEventListener('mousedown', function(e) {
        if (!floodIndic) {
            e.preventDefault();
            e.target.style.backgroundColor = colour;
            mousedownind = true;
        }
    });
    canvas.addEventListener('mouseup', function(e) {
        if (!floodIndic) {
            mousedownind = false;
        }
    });   
}

// Bonus 2 - Add a color picker.

function colourpicker() {
    pickerwrapper.style.backgroundColor = 'white';
    pickerwrapper.addEventListener('change', function(e) {
        colour = e.target.value;
        pickerwrapper.style.backgroundColor = colour;
        indicator.style.backgroundColor = colour;
    });
}

//Additional functionality - RESET button =)

function resetpush() {
    reset.addEventListener('click', function() {
        for (block of blocks) {
            block.style.backgroundColor = 'white';
        }
    });
}

//Bonus 3 - Make a way to Save and Load a drawing. Currently can save only one.

function savepush() {
    save.addEventListener('click', function() {
        let image = [];
        for (block of blocks) {
            image.push(block.style.backgroundColor);
        }
        localStorage.clear();
        localStorage.setItem('image', JSON.stringify(image));
        save.textContent = 'SAVED';
    });
}

function loadpush() {
    load.addEventListener('click', function() {
        let image = JSON.parse(localStorage.getItem('image'));
        for (let i = 0; i < image.length; i++) {
            blocks[i].style.backgroundColor = image[i];
        }
        save.textContent = 'SAVE';
    });

}

//Bonus 4 - Create a fill tool that will flood fill boundaries with a chosen paint color.

function fillpush() {
    fill.addEventListener('click', function() {
        if (floodIndic) {
            floodIndic = false;
            fill.textContent = 'FILL OFF';
        } else if (!floodIndic) {
            floodIndic = true;
            fill.textContent = 'FILL ON';
        }
    })
}

function fillingTool() {
    var grid = [];
    for (i = 0; i < rows.length; i++) {
        rows[i].setAttribute('rownum', i);
        rowblocks = rows[i].querySelectorAll('div');
        grid.push(rowblocks);
        for (it = 0; it < rowblocks.length; it++) {
            rowblocks[it].setAttribute('blocknum', it);
        }
    }
    for (block of blocks) {
        block.addEventListener('click', function(e) {
            if (floodIndic) {
                let replcol = e.target.style.backgroundColor;
                let rownum = e.target.parentNode.getAttribute('rownum');
                let blocknum = e.target.getAttribute('blocknum');
                floodFill(rownum, blocknum, e.target.style.backgroundColor);
            }
        });
    }
    
}


function floodFill(ro, co, replacedColour) {
    const fillColour = colour;
    if (ro < 0 || ro > grid.length - 1) {
        return
    }
    if (co < 0 || co > grid[0].length - 1) {
        return
    }
    let node = grid[ro][co];
    let targetColour = node.style.backgroundColor;
    if (targetColour !== replacedColour) {
        return
    }
    node.style.backgroundColor = fillColour;
    floodFill(parseInt(ro) - 1, co, replacedColour);
    floodFill(parseInt(ro) + 1, co, replacedColour);
    floodFill(ro, parseInt(co) - 1, replacedColour);
    floodFill(ro, parseInt(co) + 1, replacedColour);
}