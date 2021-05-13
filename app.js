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
let activeCells = document.getElementsByClassName('active')



let bubbleSize = 0;
let assume = 'vertical'
bubbleCont.classList.add('verticalized')
bubbleList.forEach((bubble) => {
  bubble.style.height = `${bubble.innerText}em`
  bubble.style.width = `1em`
})

let placed5 = false;
let placed4 = false;
let placed3 = false;
let placed2 = false;

gameActive = false;



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


//// GAME MESSAGES

const preGame = document.createElement('span')
preGame.innerText = `Place all your bubbles where you'd like them. :)`
if (gameActive === false) {
  jsyk.appendChild(preGame)
  jsyk.setAttribute('class', 'gentle')
  jsyk.style.opacity = '1'
  jsyk.style.transition = 'opacity 0.5s'
} else {
  jsyk.removeChild(preGame)
}

const gameStart = document.createElement('button')
gameStart.innerText = 'Yes'
const redo = document.createElement('button')
redo.innerText = 'No'
const readyMsg = document.createElement('span')
readyMsg.innerHTML = `<p>Are you happy with this placement?</p><p>Would you like to begin the game?</p>`



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
        boardCells.forEach((cell) => {
          cell.classList.remove('available')
        })
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
  switch (bubbleSize) {
    case 5:
      if (placed5 === true) {
        activeCells.forEach((cell) => {
          cell.classList.remove('active')
        })
      }
      break;
    case 4:
      if (placed4 === true) {
        activeCells.forEach((cell) => {
          cell.classList.remove('active')
        })
      }
      break;
    case 3:
      if (placed3 === true) {
        activeCells.forEach((cell) => {
          cell.classList.remove('active')
        })
      }
      break;
    case 2:
      if (placed2 === true) {
        activeCells.forEach((cell) => {
          cell.classList.remove('active')
        })
      }
      break;
    default:
  }
}

function hoverCell(e) {
  let activeCell = e.target;
  switch (bubbleSize) {
    case 0:
      jsyk.style.opacity = '1';
      break;
    default:
      jsyk.style.opacity = '0';
  }
  checkAvailable()
  if ((!activeCell.classList.contains('available')) && (!activeCell.classList.contains('taken')) && (bubbleSize > 0)) {
    jsyk.setAttribute('class', 'alert')
    jsyk.innerText = `Bubbles must fit on the board.`
    jsyk.style.opacity = '1'
    jsyk.style.transition = 'opacity 0.5s'
  } else if (activeCell.classList.contains('taken')) {
    jsyk.setAttribute('class', 'alert')
    jsyk.innerText = `You can't overlap bubbles!`
    jsyk.style.opacity = '1'
    jsyk.style.transition = 'opacity 0.5s'
  } else {
    jsyk.style.opacity = '0'
  }
  if (assume === 'horizontal') {
    if (activeCell.classList.contains('available') && (!activeCell.classList.contains('taken'))) {
      for (i = 1; i < bubbleSize; i++) {
        activeCell.classList.add('active')
        activeCell.nextSibling.classList.add('active')
        if ((activeCell.classList.contains('taken')) || (activeCell.nextSibling.classList.contains('taken'))) {
          for (i = 0; i < boardCells.length; i++) {
            boardCells[i].classList.remove('active');
          }
          jsyk.setAttribute('class', 'alert')
          jsyk.innerText = `You can't overlap bubbles!`
          jsyk.style.opacity = '1'
          jsyk.style.transition = 'opacity 0.5s'
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
      let bubCellOne = letters.indexOf(letter) //=> 0
      let bubLastCell = letters[bubCellOne + bubbleSize - 1] //=> e
      let lastCell = activeCells[activeCells.length - 1].id[0]
      const checkForBreak = () => {
        if (bubLastCell === lastCell) {
          jsyk.style.opacity = '0'
        } else {
          for (i = 0; i < boardCells.length; i++) {
            boardCells[i].classList.remove('active');
          }
          jsyk.setAttribute('class', 'alert')
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
      switch (bubbleSize) {
        case 5:
          placed5 = true;
          bubbleList[0].classList.add('taken')
          break;
        case 4:
          placed4 = true;
          bubbleList[1].classList.add('taken')
          break;
        case 3:
          placed3 = true;
          bubbleList[2].classList.add('taken')
          break;
        case 2:
          placed2 = true;
          bubbleList[3].classList.add('taken')
          break;
        default:
      }
      cell.classList.remove('available', 'active')
      cell.classList.add('taken')
    })
  } else if ((hoveredCells.length === 0) && (bubbleSize != 0)) {
    jsyk.setAttribute('class', 'alert')
    jsyk.innerText = 'You may only place one of each bubble.'
    jsyk.style.opacity = '1'
    jsyk.style.transition = 'opacity 0.5s'
  }
}

let checkReadyInterval = setInterval(checkReady, 500);
function checkReady() {
  if ((placed5 === true) && (placed4 === true) && (placed3 === true) && (placed2 === true) && gameActive === false) {
    boardCells.forEach((cell) => {
      cell.removeEventListener('mouseover', hoverCell);
      cell.removeEventListener('mouseout', idleCell);
      cell.removeEventListener('click', setBubble);
    })
    bubbleList.forEach((bubble) => {
      bubble.removeEventListener('click', function (e) {
        bubbleSize = parseInt(e.target.innerText);
        boardCells.forEach((cell) => {
          cell.classList.remove('available')
        })
        checkAvailable()
      })
    })
    jsyk.innerText = ''
    jsyk.setAttribute('class', 'gentle')
    jsyk.appendChild(readyMsg)
    readyMsg.appendChild(gameStart)
    readyMsg.appendChild(redo)
    jsyk.style.opacity = '1'
    jsyk.style.transition = 'opacity 0.5s'
  } else {
  }
}



/////////////////////////////////////
//// EVENT LISTENERS
/////////////////////////////////////

bubbleList.forEach((bubble) => {
  bubble.addEventListener('click', function (e) {
    bubbleSize = parseInt(e.target.innerText);
    switch (bubbleSize) {
      case 5:
        if (placed5 === true) {
          jsyk.setAttribute('class', 'alert')
          jsyk.innerText = 'You may only place one of each bubble.'
          jsyk.style.opacity = '1'
          jsyk.style.transition = 'opacity 0.5s'
        } else {
          jsyk.style.opacity = '0';
        }
        break;
      case 4:
        if (placed4 === true) {
          jsyk.setAttribute('class', 'alert')
          jsyk.innerText = 'You may only place one of each bubble.'
          jsyk.style.opacity = '1'
          jsyk.style.transition = 'opacity 0.5s'
        } else {
          jsyk.style.opacity = '0';
        }
        break;
      case 3:
        if (placed3 === true) {
          jsyk.setAttribute('class', 'alert')
          jsyk.innerText = 'You may only place one of each bubble.'
          jsyk.style.opacity = '1'
          jsyk.style.transition = 'opacity 0.5s'
        } else {
          jsyk.style.opacity = '0';
        }
        break;
      case 2:
        if (placed2 === true) {
          jsyk.setAttribute('class', 'alert')
          jsyk.innerText = 'You may only place one of each bubble.'
          jsyk.style.opacity = '1'
          jsyk.style.transition = 'opacity 0.5s'
        } else {
          jsyk.style.opacity = '0';
        }
        break;
      default:
        jsyk.style.opacity = '0';
    }

    boardCells.forEach((cell) => {
      cell.classList.remove('available')
    })
    checkAvailable()
  })
})

boardCells.forEach((cell) => {
  cell.addEventListener('mouseover', hoverCell);
  cell.addEventListener('mouseout', idleCell);
  cell.addEventListener('click', setBubble);
})

rotate.addEventListener('click', rotateFunc);

gameStart.addEventListener('click', () => {
  gameActive = true;
  bubbleCont.style.display = 'none';
  jsyk.style.opacity = '0';
  jsyk.innerText = '';
  clearInterval(checkReadyInterval)
})

redo.addEventListener('click', () => {
  boardCells.forEach((cell) => {
    cell.classList.remove('taken')
    cell.classList.remove('active')
    cell.addEventListener('mouseover', hoverCell);
    cell.addEventListener('mouseout', idleCell);
    cell.addEventListener('click', setBubble);
  })
  bubbleList.forEach((bubble) => {
    bubble.classList.remove('taken')
    bubble.addEventListener('click', function (e) {
      bubbleSize = parseInt(e.target.innerText);
      boardCells.forEach((cell) => {
        cell.classList.remove('available')
      })
      checkAvailable()
    })
  })
  jsyk.innerText = ''
  jsyk.style.opacity = '0'
  placed5 = false;
  placed4 = false;
  placed3 = false;
  placed2 = false;
})