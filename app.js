console.log('Mic check')
/////////////////////////////////////
//// GLOBAL VARIABLES
/////////////////////////////////////
const body = document.querySelector('body')
const main = document.querySelector('main')
const playerBoard = document.querySelector('.playerboard')


/////////////////////////////////////
//// BOARD BUILD
/////////////////////////////////////
const boardCells = [];
let colCount = 0;
let pointer = 0;
let letters = ['_', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
for (i = 1; i <= 121; i++) {
  let newCell = document.createElement('div');
  playerBoard.appendChild(newCell)
  newCell.innerText = `${letters[pointer]}${colCount}`
  newCell.setAttribute('id', `${letters[pointer]}${colCount}`)
  colCount++
  if (i > 11 && colCount >= 2 && colCount <= 11) {
    newCell.classList.add('playable')
    boardCells.push(newCell)
  }
  if (i % 11 === 0) {
    colCount = 0
    pointer++
  }
}
console.log(boardCells)

/////////////////////////////////////
//// FUNCTIONS
/////////////////////////////////////

function hoverCell(e) {
  e.target.style.color = 'yellow';
}

function idleCell(e) {
  e.target.style.color = 'black';
}





/////////////////////////////////////
//// EVENT LISTENERS
/////////////////////////////////////

for (i = 0; i < boardCells.length; i++) {
  boardCells[i].addEventListener('mouseover', hoverCell);
  boardCells[i].addEventListener('mouseout', idleCell);
}