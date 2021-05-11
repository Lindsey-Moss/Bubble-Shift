console.log('Mic check')
/////////////////////////////////////
//// GLOBAL VARIABLES
/////////////////////////////////////
const body = document.querySelector('body')
const main = document.querySelector('main')
const bubbleList = document.querySelectorAll('.bubble')
const playerBoard = document.querySelector('.playerboard')
const boardCells = [];
const rotate = document.querySelector('.rotate')


let bubbleSize = 5;
let assume = 'vertical'

/////////////////////////////////////
//// BOARD BUILD
/////////////////////////////////////

let colCount = 0;
let pointer = 0;
let letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
for (i = 1; i <= 121; i++) {
  let newCell = document.createElement('div');
  playerBoard.appendChild(newCell)
  newCell.innerText = `${letters[pointer]}${colCount}`
  newCell.setAttribute('id', `${letters[pointer]}${colCount}`)
  if (colCount === 0 || i < 12) {
    newCell.classList.add('label')
  }
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

function checkAvailable() {
  if (assume === 'horizontal') {
    switch (bubbleSize) {
      case 5:
        for (i = 0; i < boardCells.length; i++) {
          boardCells[i].classList.add('available')
          if (i === 5 || boardCells[i].id.includes(6, 1)) {
            i += 4;
          }
        }
        break;
      case 4:
        for (i = 0; i < boardCells.length; i++) {
          boardCells[i].classList.add('available')
          if (i === 6 || boardCells[i].id.includes(7, 1)) {
            i += 3;
          }
        }
        break;
      case 3:
        for (i = 0; i < boardCells.length; i++) {
          boardCells[i].classList.add('available')
          if (i === 7 || boardCells[i].id.includes(8, 1)) {
            i += 2;
          }
        }
        break;
      case 2:
        for (i = 0; i < boardCells.length; i++) {
          boardCells[i].classList.add('available')
          if (i === 8 || boardCells[i].id.includes(9, 1)) {
            i += 1;
          }
        }
        break;
      default:

    }
  } else if (assume === 'vertical') {
    switch (bubbleSize) {
      case 5:
        for (i = 0; i < 60; i++) {
          boardCells[i].classList.add('available')
        }
        break;
      case 4:
        for (i = 0; i < 70; i++) {
          boardCells[i].classList.add('available')
        }
        break;
      case 3:
        for (i = 0; i < 80; i++) {
          boardCells[i].classList.add('available')
        }
        break;
      case 2:
        for (i = 0; i < 90; i++) {
          boardCells[i].classList.add('available')
        }
        break;
      default:
        boardCells.forEach((cell) => {
          cell.classList.remove('available')
        })
    }
  }
}

function hoverCell(e) {
  activeCell = e.target;
  checkAvailable()
  if (assume === 'horizontal') {
    if (activeCell.classList.contains('available')) {
      for (i = 1; i < 5; i++) {
        activeCell.classList.add('active')
        activeCell.nextSibling.classList.add('active')
        activeCell = activeCell.nextSibling
      }
    }
  } else if (assume === 'vertical') {
    if (activeCell.classList.contains('available')) {
      activeCell.classList.add('active')
      let activeCellID = e.target.id;
      let place = boardCells.findIndex(function (index) {
        if (index.id === `${activeCellID}`) {
          return true;
        }
      })
      for (i = place; i < boardCells.length; i++) {
        if (boardCells[i].id.includes(`${activeCellID[1]}`) && !boardCells[i].id.includes(10)) {
          boardCells[i].classList.add('active')
        } else if (activeCellID.includes(10) && boardCells[i].id.includes(10)) {
          boardCells[i].classList.add('active')
        }
        if (document.getElementsByClassName('active').length === bubbleSize) {
          break;
        }
      }
    }
  }
}



function idleCell() {
  for (i = 0; i < boardCells.length; i++) {
    boardCells[i].classList.remove('active');
  }
}

function rotateFunc() {
  if (assume === 'horizontal') {
    assume = 'vertical'
    boardCells.forEach((cell) => {
      cell.classList.remove('available')
    })
  } else if (assume === 'vertical') {
    assume = 'horizontal'
    boardCells.forEach((cell) => {
      cell.classList.remove('available')
    })
  }
}



/////////////////////////////////////
//// EVENT LISTENERS
/////////////////////////////////////

for (i = 0; i < bubbleList.length; i++) {
  bubbleList[i].addEventListener('click', function (e) {
    bubbleSize = e.target.innerText;
    console.log(bubbleSize)
  })
}

for (i = 0; i < boardCells.length; i++) {
  boardCells[i].addEventListener('mouseover', hoverCell);
  boardCells[i].addEventListener('mouseout', idleCell);
}

for (i = 0; i < boardCells.length; i++) {
  boardCells[i].addEventListener('click', function (e) {
    console.log(e.target.id);
  });
}

rotate.addEventListener('click', rotateFunc);