/////////////////////////////////////
//// GLOBAL VARIABLES
/////////////////////////////////////
const body = document.querySelector('body')
const main = document.querySelector('main')
const bubbleCont = document.querySelector('.bubble-list')
const bubbleList = document.querySelectorAll('.bubble')
const playerBoard = document.querySelector('.playerboard')
const boardCells = [];
const rotate = document.querySelector('.rotate')
const jsyk = document.querySelector('#jsyk')


let bubbleSize = 0;
let assume = 'vertical'
bubbleCont.classList.add('verticalized')
bubbleList.forEach((bubble) => {
  bubble.style.height = `${bubble.innerText}em`
  bubble.style.width = `1em`
})
console.log(bubbleList)

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
  boardCells.forEach((cell) => {
    if (cell.classList.contains('taken')) {
      cell.classList.remove('available')
    }
  })
}

function hoverCell(e) {
  let activeCell = e.target;
  let activeCells = document.getElementsByClassName('active')
  checkAvailable()
  if (assume === 'horizontal') {
    if (activeCell.classList.contains('available') && (!activeCell.classList.contains('taken'))) {
      for (i = 1; i < bubbleSize; i++) {
        activeCell.classList.add('active')
        activeCell.nextSibling.classList.add('active')
        if ((activeCell.classList.contains('taken')) || (activeCell.nextSibling.classList.contains('taken'))) {
          for (i = 0; i < boardCells.length; i++) {
            boardCells[i].classList.remove('active');
          }
        }
        activeCell = activeCell.nextSibling
      }
    }
  } else if (assume === 'vertical') {
    if ((activeCell.classList.contains('available')) && (!activeCell.classList.contains('taken'))) {
      activeCell.classList.add('active')
      let activeCellID = e.target.id;
      let place = boardCells.findIndex(function (index) {
        if (index.id === `${activeCellID}`) {
          return true;
        }
      })
      for (i = (place); i < boardCells.length; i++) {
        if ((boardCells[i].id.includes(`${activeCellID[1]}`)) && (!boardCells[i].id.includes(10)) && (!boardCells[i].classList.contains('taken'))) {
          boardCells[i].classList.add('active')
        } else if (activeCellID.includes(10) && boardCells[i].id.includes(10)) {
          boardCells[i].classList.add('active');
          i++
          boardCells[10].classList.remove('active');
          boardCells[20].classList.remove('active');
          boardCells[30].classList.remove('active');
          boardCells[40].classList.remove('active');
          boardCells[50].classList.remove('active');
          boardCells[60].classList.remove('active');
          boardCells[70].classList.remove('active');
          boardCells[80].classList.remove('active');
          boardCells[90].classList.remove('active');
        }
        switch (activeCellID) {
          case 'A10':
            boardCells[10].classList.remove('active')
            break;
          case 'B10':
            boardCells[20].classList.remove('active')
            break;
          case 'C10':
            boardCells[30].classList.remove('active')
            break;
          case 'D10':
            boardCells[40].classList.remove('active')
            break;
          case 'E10':
            boardCells[50].classList.remove('active')
            break;
          case 'F10':
            boardCells[60].classList.remove('active')
            break;
          case 'G10':
            boardCells[70].classList.remove('active')
            break;
          case 'H10':
            boardCells[80].classList.remove('active')
            break;
          case 'I10':
            boardCells[90].classList.remove('active')
            break;
        }
        if (activeCells.length === bubbleSize) {
          break;
        }
      }
      let letter = activeCellID[0] //=> a
      let shipBlockOne = letters.indexOf(letter) //=> 0
      let theShipsLastSquare = letters[shipBlockOne + bubbleSize - 1] //=> e
      console.log(theShipsLastSquare)
      let lastCell = activeCells[activeCells.length - 1].id[0]
      console.log(lastCell)
      const checkForBreak = () => {
        if (theShipsLastSquare === lastCell) {
          jsyk.style.opacity = '0'
        } else {
          for (i = 0; i < boardCells.length; i++) {
            boardCells[i].classList.remove('active');
          }
          jsyk.innerText = `You can't overlap bubbles!`
          jsyk.style.opacity = '1'
          jsyk.style.transition = 'opacity 0.5s'
        }
      }
      checkForBreak()
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
    bubbleCont.classList.remove('horizontalized')
    bubbleCont.classList.add('verticalized')
    bubbleList.forEach((bubble) => {
      bubble.style.height = `${bubble.innerText}em`
      bubble.style.width = `1em`
    })
    boardCells.forEach((cell) => {
      cell.classList.remove('available')
    })
    checkAvailable()
  } else if (assume === 'vertical') {
    assume = 'horizontal'
    bubbleCont.classList.remove('verticalized')
    bubbleCont.classList.add('horizontalized')
    bubbleList.forEach((bubble) => {
      bubble.style.width = `${bubble.innerText}em`
      bubble.style.height = `1em`
    })
    boardCells.forEach((cell) => {
      cell.classList.remove('available')
    })
    checkAvailable()
  }
}

function setBubble() {
  let hoveredCells = document.querySelectorAll('.active')
  if ((hoveredCells.length > 0) && (hoveredCells.length === bubbleSize)) {
    hoveredCells.forEach((cell) => {
      cell.classList.remove('available', 'active')
      cell.classList.add('taken')
    })
  }
}

/////////////////////////////////////
//// EVENT LISTENERS
/////////////////////////////////////

bubbleList.forEach((bubble) => {
  bubble.addEventListener('click', function (e) {
    bubbleSize = parseInt(e.target.innerText);
    boardCells.forEach((cell) => {
      cell.classList.remove('available')
    })
    checkAvailable()
  })
})

boardCells.forEach((cell) => {
  cell.addEventListener('mouseover', hoverCell);
  cell.addEventListener('mouseout', idleCell);
})

boardCells.forEach((cell) => {
  cell.addEventListener('click', setBubble);
})

rotate.addEventListener('click', rotateFunc);