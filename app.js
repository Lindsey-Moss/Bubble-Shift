/////////////////////////////////////
//// GLOBAL VARIABLES
/////////////////////////////////////

const body = document.querySelector('body')
const main = document.querySelector('main')
const aside = document.querySelector('aside')
const bubbleCont = document.querySelector('.bubble-list')
const bubbleList = document.querySelectorAll('.bubble')
const playingMenu = document.querySelector('.playing')
const playerBoard = document.querySelector('.playerboard')
const npcBoard = document.querySelector('.npcboard')
const boardCells = [];
const rotate = document.querySelector('.rotate')
const jsyk = document.querySelector('#jsyk')
let activeCells = document.getElementsByClassName('active')
const oppMap = document.querySelector('#opponent')
const npcBoardCells = [];
const myBoard = document.querySelector('#mine')
const reviewRules = document.querySelector('#rules')

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

turnIs = 'player';

let playerHits = 0;
let npcHits = 0;

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

const npcChoices = [];

function buildNPC() {
  colCount = 0;
  pointer = 0;
  for (i = 1; i <= 121; i++) {
    let newCell = document.createElement('div');
    npcBoard.appendChild(newCell)
    newCell.innerText = `${letters[pointer]}${colCount}`
    newCell.setAttribute('id', `${letters[pointer]}${colCount}`)
    if (colCount === 0 || i < 12) {
      newCell.classList.add('label')
    }
    colCount++
    if (i > 11 && colCount >= 2 && colCount <= 11) {
      npcBoardCells.push(newCell)
    }
    if (i % 11 === 0) {
      colCount = 0
      pointer++
    }
  }
  for (i = 0; i < 99; i++) {
    npcChoices.push(i)
  }
  place = 0
  for (i = 0; i < 14; i++) {
    npcBoardCells[place].classList.add('secret')
    place += 1
  }
  // //random placement of npc's bubbles
  // function setRow() {
  //   return 1 + Math.floor(Math.random() * 9);
  // }
  // function startPoint(max) {
  //   Math.floor(Math.random() * max)
  // }
  // for (i = 0; i < 4; i++) {
  //   pointer = setRow()
  //   let npcBubble = 5

  //   let letter = letters[pointer]
  //   console.log(letter)
  //   let startingCell = npcBoardCells.findIndex(function (index) {
  //     if (index.id === `${letter}${startPoint([10 - npcBubble])}`) {
  //       return true;
  //     }
  //   })
  //   console.log(startingCell)
  //   // letter + random (max of 10-npcBubble)
  //   // for (i = 0; i < npcBubble; i++) {
  //   //   npcBoardCells[startingCell].classList.add('taken')
  //   // }
  // }
  // npcBubble--
}


//// GAME MESSAGES

const preGame = document.createElement('span')
preGame.innerText = `Place all your bubbles where you'd like them. :)`
if (gameActive === false) {
  jsyk.setAttribute('class', 'gentle')
  jsyk.appendChild(preGame)
  jsyk.style.opacity = '1'
  jsyk.style.transition = 'opacity 0.5s'
} else { }

const gameStart = document.createElement('button')
gameStart.innerText = 'Yes'
const redo = document.createElement('button')
redo.innerText = 'No'
const readyMsg = document.createElement('span')
readyMsg.innerHTML = `<p>Are you happy with this placement?</p><p>Would you like to begin the game?</p>`

const turnMsg = document.createElement('span')
turnMsg.innerText = `Go ahead! It's your turn. :)`
const npcTurnMsg = document.createElement('span')
npcTurnMsg.innerText = `Now it's your opponent's turn...`

const hitMsg = document.createElement('span')
hitMsg.innerHTML = `<i>Pop!</i> You got one!`
const npcHitMsg = document.createElement('span')
npcHitMsg.innerHTML = `<i>Pop!</i> They got one!`


const missMsg = document.createElement('span')
missMsg.innerHTML = `Ohp, there wasn't anything there, that time...`
const npcMissMsg = document.createElement('span')
npcMissMsg.innerHTML = `Ohp! They missed this time!`


/////////////////////////////////////
//// FUNCTIONS
/////////////////////////////////////

function closeSide() {
  aside.style.width = 0;
  aside.style.padding = 0;
  bubbleCont.style.opacity = 0;
  playingMenu.style.opacity = 0;
}

function openSide() {
  aside.style.width = '120px';
  aside.style.padding = '2vmin';
  bubbleCont.style.opacity = 1;
  playingMenu.style.opacity = 1;
}

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
    switch (bubbleSize) {
      case 0:
        jsyk.style.opacity = '1';
        break;
      default:
        jsyk.style.opacity = '0';
    }
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
          switch (bubbleSize) {
            case 0:
              jsyk.style.opacity = '1';
              break;
            default:
              jsyk.style.opacity = '0';
          }
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
    clearInterval(checkReadyInterval)
  } else {
  }
}

function openOppMap() {
  if (gameActive === false) {
    jsyk.innerHTML = ''
    jsyk.innerText = `The game hasn't even started yet!`
    jsyk.style.opacity = '1'
    jsyk.setAttribute('class', 'alert')
  } else if (npcBoard.classList.contains('visible')) {

  } else {
    jsyk.innerHTML = ''
    playerBoard.classList.add('invisible')
    playerBoard.classList.remove('visible')
    npcBoard.classList.add('visible')
    npcBoard.classList.remove('invisible')
    jsyk.style.opacity = '0'
  }
}

function backToMyBoard() {
  if (playerBoard.classList.contains('visible')) {

  } else {
    playerBoard.classList.remove('invisible')
    playerBoard.classList.add('visible')
    npcBoard.classList.remove('visible')
    npcBoard.classList.add('invisible')
  }
}

function gameHoverCell(e) {
  if (turnIs === 'player') {
    activeCell = e.target
    activeCell.classList.add('active')
  } else { }
}

function gameIdleCell() {
  if (turnIs === 'player') {
    for (i = 0; i < npcBoardCells.length; i++) {
      npcBoardCells[i].classList.remove('active');
    }
  } else { }
}

function setGuess() {
  if (turnIs === 'player') {
    activeCell = document.querySelector('.active')
    if (activeCell.classList.contains('secret') && (!activeCell.classList.contains('hit') || !activeCell.classList.contains('miss'))) {
      activeCell.classList.add('hit')
      playerHits++
      checkWin()
      jsyk.innerHTML = ''
      jsyk.style.opacity = '1'
      jsyk.appendChild(hitMsg)
      setTimeout(switchTurn, 2500);
    } else if (!activeCell.classList.contains('secret') && (!activeCell.classList.contains('hit') || !activeCell.classList.contains('miss'))) {
      activeCell.classList.add('miss')
      jsyk.innerHTML = ''
      jsyk.style.opacity = '1'
      jsyk.appendChild(missMsg)
      setTimeout(switchTurn, 2500);
    }
  } else { }

}

function checkWin() {
  if (playerHits === 14) {
    jsyk.innerHTML = ''
    jsyk.innerText = `Player wins!`
    jsyk.setAttribute('class', 'gentle')
    jsyk.style.opacity = '1'
    npcBoardCells.forEach((cell) => {
      cell.removeEventListener('mouseover', gameHoverCell);
      cell.removeEventListener('mouseout', gameIdleCell);
      cell.removeEventListener('click', setGuess);
    })
  } else if (npcHits === 14) {
    jsyk.innerHTML = ''
    jsyk.innerText = `The computer wins!`
    jsyk.setAttribute('class', 'alert')
    jsyk.style.opacity = '1'
    npcBoardCells.forEach((cell) => {
      cell.removeEventListener('mouseover', gameHoverCell);
      cell.removeEventListener('mouseout', gameIdleCell);
      cell.removeEventListener('click', setGuess);
    })
  }
}

function npcTurn() {
  let index = Math.floor(Math.random() * npcChoices.length);
  let npcGuess = npcChoices[index]
  npcChoices.splice(index, 1);
  // if (boardCells[npcGuess].classList.contains('hit') || boardCells[npcGuess].classList.contains('miss')) {
  //   npcGuess = npcChoice()
  // }
  // else 
  if (!boardCells[npcGuess].classList.contains('taken')) {
    boardCells[npcGuess].classList.add('miss')
    jsyk.innerHTML = ''
    jsyk.appendChild(npcMissMsg)
    setTimeout(switchTurn, 2500)
  } else if (boardCells[npcGuess].classList.contains('taken')) {
    boardCells[npcGuess].classList.add('hit')
    jsyk.innerHTML = ''
    jsyk.appendChild(npcHitMsg)
    npcHits++
    setTimeout(switchTurn, 2500)
  }
}

function switchTurn() {
  if (turnIs === 'player') {
    turnIs = 'npc'
    jsyk.innerHTML = ''
    jsyk.style.opacity = '1'
    jsyk.setAttribute('class', 'alert')
    jsyk.appendChild(npcTurnMsg)
    backToMyBoard()
    setTimeout(npcTurn, 2500)
  } else if (turnIs === 'npc') {
    turnIs = 'player'
    jsyk.innerHTML = ''
    jsyk.setAttribute('class', 'gentle')
    jsyk.style.opacity = '1'
    jsyk.appendChild(turnMsg)
    setTimeout(function () {
      openOppMap()
    }, 2000)
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
  buildNPC()
  bubbleCont.style.display = 'none';
  jsyk.style.opacity = '0';
  jsyk.removeChild(readyMsg)
  jsyk.style.opacity = '1'
  jsyk.appendChild(turnMsg)
  const lilHint = document.createElement('span')
  lilHint.innerHTML = `<p><sub><i>Check your opponent's map and make your guess!</i></sub></p>`
  setTimeout(function () {
    jsyk.appendChild(lilHint)
  }, 2000)
  npcBoardCells.forEach((cell) => {
    cell.addEventListener('mouseover', gameHoverCell);
    cell.addEventListener('mouseout', gameIdleCell);
    cell.addEventListener('click', setGuess);
  })

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
  jsyk.removeChild(readyMsg)
  jsyk.style.opacity = '0'
  placed5 = false;
  placed4 = false;
  placed3 = false;
  placed2 = false;
})

oppMap.addEventListener('click', openOppMap)

myBoard.addEventListener('click', backToMyBoard)