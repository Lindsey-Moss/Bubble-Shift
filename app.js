/////////////////////////////////////
//// GLOBAL VARIABLES
/////////////////////////////////////

const body = document.querySelector('body')
const main = document.querySelector('main')
const endScreen = document.querySelector('#end-screen')
const aside = document.querySelector('aside')
const bubbleCont = document.querySelector('.box')
const bubbleCont2 = document.querySelector('.bubble-list')
const bubbleList = document.querySelectorAll('.bubble')
const playingMenu = document.querySelector('.playing')
const playerBoard = document.querySelector('.playerboard')
const npcBoard = document.querySelector('.npcboard')
const boardCells = [];
const rotate = document.querySelector('.rotate')
const jsyk = document.querySelector('#jsyk')
let activeCells = document.getElementsByClassName('active')
const oppMap = document.querySelector('#opponent')
const scoreboard = document.querySelector('.scoreboard')
const npcBoardCells = [];
const myBoard = document.querySelector('#mine')
const reviewRules = document.querySelector('#rules')
const theRules = document.querySelector('.rules-doc')

let bubbleSize = 0;
let assume = 'vertical'
bubbleCont.classList.add('verticalized')
bubbleList.forEach((bubble) => {
  bubble.style.height = `${bubble.innerText}em`
  bubble.style.lineHeight = `${bubble.innerText}em`
  bubble.style.width = `1em`
})

let placed5 = false;
let placed4 = false;
let placed3 = false;
let placed2 = false;

gameActive = false;

turnIs = 'player';

let playerHits = 0;
let playerMisses = 0;
const showHits = document.querySelector('#hits')
const showMisses = document.querySelector('#misses')
let npcHits = 0;
let npcMisses = 0;
const showNPCHits = document.querySelector('#npcHits')
const showNPCMisses = document.querySelector('#npcMisses')

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
    if (colCount === 0) {
      newCell.innerText = `${letters[pointer]}`
    }
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
const npcPlaceGrid = [];

function buildNPC() {
  colCount = 0;
  pointer = 0;
  for (i = 1; i <= 121; i++) {
    let newCell = document.createElement('div');
    newCell.classList.add('guessable')
    npcBoard.appendChild(newCell)
    newCell.innerText = `${letters[pointer]}${colCount}`
    newCell.setAttribute('id', `${letters[pointer]}${colCount}`)
    if (colCount === 0 || i < 12) {
      newCell.classList.remove('guessable')
      newCell.classList.add('label')
      if (colCount === 0) {
        newCell.innerText = `${letters[pointer]}`
      }
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
  for (i = 0; i <= 99; i++) {
    npcChoices.push(i)
  }

  // //random placement of npc's bubbles

  //bubble size
  let npcBub = 5;
  let direction
  function setDirection() {
    direction = Math.floor(Math.random() * 2) //=> 0 is horiz, 1 is vert
  }
  // iterate through each bubble (4 times, subtracting npcBub each time)
  for (i = 1; i <= 4; i++) {
    function placeRandom() {
      setDirection()
      function checkAvailableNPC() {
        npcPlaceGrid.splice(0, npcPlaceGrid.length)
        if (direction === 0) { //horizontal available to choose
          switch (npcBub) {
            case 5:
              for (k = 0; k < npcBoardCells.length; k++) {
                npcPlaceGrid.push(k)
                if (k === 5 || npcBoardCells[k].id.includes(6, 1)) {
                  k += 4;
                }
              }
              break;
            case 4:
              for (k = 0; k < npcBoardCells.length; k++) {
                npcPlaceGrid.push(k)
                if (k === 6 || npcBoardCells[k].id.includes(7, 1)) {
                  k += 3;
                }
              }
              break;
            case 3:
              for (k = 0; k < npcBoardCells.length; k++) {
                npcPlaceGrid.push(k)
                if (k === 7 || npcBoardCells[k].id.includes(8, 1)) {
                  k += 2;
                }
              }
              break;
            case 2:
              for (k = 0; k < npcBoardCells.length; k++) {
                npcPlaceGrid.push(k)
                if (k === 8 || npcBoardCells[k].id.includes(9, 1)) {
                  k += 1;
                }
              }
              break;
            default:
          }
        } else if (direction === 1) { // vertical available to choose
          switch (npcBub) {
            case 5:
              for (k = 0; k < 60; k++) {
                npcPlaceGrid.push(k)
              }
              break;
            case 4:
              for (k = 0; k < 70; k++) {
                npcPlaceGrid.push(k)
              }
              break;
            case 3:
              for (k = 0; k < 80; k++) {
                npcPlaceGrid.push(k)
              }
              break;
            case 2:
              for (k = 0; k < 90; k++) {
                npcPlaceGrid.push(k)
              }
              break;
            default:
          }
        }
      }
      checkAvailableNPC()
      let index = Math.floor(Math.random() * npcPlaceGrid.length);
      let npcSet = npcPlaceGrid[index]
      let placeable = false
      function checkPlaceable() {
        npcSetCheck = npcSet
        secretsHere = 0
        if (direction === 0) { // horizontal placement check
          switch (npcBub) {
            case 5:
              for (h = 0; h < 5; h++) {
                let result = npcBoardCells[npcSetCheck].classList.contains('secret')
                if (result) {
                  secretsHere += 1
                  npcSetCheck++
                } else {
                  npcSetCheck++
                }
              }
              if (secretsHere > 0) {
                placeable = false
              } else {
                placeable = true
              }
              break;
            case 4:
              for (h = 0; h < 4; h++) {
                let result = npcBoardCells[npcSetCheck].classList.contains('secret')
                if (result) {
                  secretsHere += 1
                  npcSetCheck++
                } else {
                  npcSetCheck++
                }
              }
              if (secretsHere > 0) {
                placeable = false
              } else {
                placeable = true
              }
              break;
            case 3:
              for (h = 0; h < 3; h++) {
                let result = npcBoardCells[npcSetCheck].classList.contains('secret')
                if (result) {
                  secretsHere += 1
                  npcSetCheck++
                } else {
                  npcSetCheck++
                }
              }
              if (secretsHere > 0) {
                placeable = false
              } else {
                placeable = true
              }
              break;
            case 2:
              for (h = 0; h < 2; h++) {
                let result = npcBoardCells[npcSetCheck].classList.contains('secret')
                if (result) {
                  secretsHere += 1
                  npcSetCheck++
                } else {
                  npcSetCheck++
                }
              }
              if (secretsHere > 0) {
                placeable = false
              } else {
                placeable = true
              }
              break;
            default:
          }
        } else if (direction === 1) { //vertical placement check
          switch (npcBub) {
            case 5:
              for (h = 0; h < 5; h++) {
                let result = npcBoardCells[npcSetCheck].classList.contains('secret')
                if (result) {
                  secretsHere++
                  npcSetCheck += 10
                } else {
                  npcSetCheck += 10
                }
              }
              if (secretsHere > 0) {
                placeable = false
              } else {
                placeable = true
              }
              break;
            case 4:
              for (h = 0; h < 4; h++) {
                let result = npcBoardCells[npcSetCheck].classList.contains('secret')
                if (result) {
                  secretsHere++
                  npcSetCheck += 10
                } else {
                  npcSetCheck += 10
                }
              }
              if (secretsHere > 0) {
                placeable = false
              } else {
                placeable = true
              }
              break;
            case 3:
              for (h = 0; h < 3; h++) {
                let result = npcBoardCells[npcSetCheck].classList.contains('secret')
                if (result) {
                  secretsHere++
                  npcSetCheck += 10
                } else {
                  npcSetCheck += 10
                }
              }
              if (secretsHere > 0) {
                placeable = false
              } else {
                placeable = true
              }
              break;
            case 2:
              for (h = 0; h < 2; h++) {
                let result = npcBoardCells[npcSetCheck].classList.contains('secret')
                if (result) {
                  secretsHere++
                  npcSetCheck += 10
                } else {
                  npcSetCheck += 10
                }
              }
              if (secretsHere > 0) {
                placeable = false
              } else {
                placeable = true
              }
              break;
            default:
          }
        }
        return placeable
      }
      checkPlaceable()
      if (placeable) {
        if (direction === 0) { // horizontal actual placement
          for (j = 1; j <= npcBub; j++) {
            npcBoardCells[npcSet].classList.add('secret')
            npcSet++
          }
        } else if (direction === 1) { // vertical actual placement
          for (j = 1; j <= npcBub; j++) {
            npcBoardCells[npcSet].classList.add('secret')
            npcSet += 10
          }
        }
        npcBub--
      } else {
        placeRandom()
      }
    }
    placeRandom()
  }
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
  bubbleCont2.style.opacity = 0;
  playingMenu.style.opacity = 0;
  scoreboard.style.opacity = 0;
}

function openSide() {
  aside.style.width = '126px';
  aside.style.padding = '2vmin';
  bubbleCont.style.opacity = 1;
  bubbleCont2.style.opacity = 1;
  playingMenu.style.opacity = 1;
  scoreboard.style.opacity = 1;
}

function checkAvailable() {
  if (assume === 'horizontal') {
    switch (bubbleSize) {
      case 5:
        if (placed5 === true) {
          boardCells.forEach((cell) => {
            cell.classList.remove('available')
          })
        } else {
          for (i = 0; i < boardCells.length; i++) {
            boardCells[i].classList.add('available')
            if (i === 5 || boardCells[i].id.includes(6, 1)) {
              i += 4;
            }
          }
        }
        break;
      case 4:
        if (placed4 === true) {
          boardCells.forEach((cell) => {
            cell.classList.remove('available')
          })
        } else {
          for (i = 0; i < boardCells.length; i++) {
            boardCells[i].classList.add('available')
            if (i === 6 || boardCells[i].id.includes(7, 1)) {
              i += 3;
            }
          }
        }
        break;
      case 3:
        if (placed3 === true) {
          boardCells.forEach((cell) => {
            cell.classList.remove('available')
          })
        } else {
          for (i = 0; i < boardCells.length; i++) {
            boardCells[i].classList.add('available')
            if (i === 7 || boardCells[i].id.includes(8, 1)) {
              i += 2;
            }
          }
        }
        break;
      case 2:
        if (placed2 === true) {
          boardCells.forEach((cell) => {
            cell.classList.remove('available')
          })
        } else {
          for (i = 0; i < boardCells.length; i++) {
            boardCells[i].classList.add('available')
            if (i === 8 || boardCells[i].id.includes(9, 1)) {
              i += 1;
            }
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
        if (placed5 === true) {
          boardCells.forEach((cell) => {
            cell.classList.remove('available')
          })
        } else {
          for (i = 0; i < 60; i++) {
            boardCells[i].classList.add('available')
          }
        }
        break;
      case 4:
        if (placed4 === true) {
          boardCells.forEach((cell) => {
            cell.classList.remove('available')
          })
        } else {
          for (i = 0; i < 70; i++) {
            boardCells[i].classList.add('available')
          }
        }
        break;
      case 3:
        if (placed3 === true) {
          boardCells.forEach((cell) => {
            cell.classList.remove('available')
          })
        } else {
          for (i = 0; i < 80; i++) {
            boardCells[i].classList.add('available')
          }
        }
        break;
      case 2:
        if (placed2 === true) {
          boardCells.forEach((cell) => {
            cell.classList.remove('available')
          })
        } else {
          for (i = 0; i < 90; i++) {
            boardCells[i].classList.add('available')
          }
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
  // switch (bubbleSize) {
  //   case 5:
  //     if (placed5 === true) {
  //       boardCells.forEach((cell) => {
  //         cell.classList.remove('active')
  //       })
  //     }
  //     break;
  //   case 4:
  //     if (placed4 === true) {
  //       boardCells.forEach((cell) => {
  //         cell.classList.remove('active')
  //       })
  //     }
  //     break;
  //   case 3:
  //     if (placed3 === true) {
  //       boardCells.forEach((cell) => {
  //         cell.classList.remove('active')
  //       })
  //     }
  //     break;
  //   case 2:
  //     if (placed2 === true) {
  //       boardCells.forEach((cell) => {
  //         cell.classList.remove('active')
  //       })
  //     }
  //     break;
  //   default:
  // }
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
  if ((!activeCell.classList.contains('available')) && (!activeCell.classList.contains('taken')) && (bubbleSize > 0) && ((bubbleSize === 5 && placed5 === false) || (bubbleSize === 4 && placed4 === false) || (bubbleSize === 3 && placed3 === false) || (bubbleSize === 2 && placed2 === false))) {
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
    rotate.innerText = `Rotate ⇋`
    bubbleCont.classList.remove('horizontalized')
    bubbleCont.classList.add('verticalized')
    bubbleList.forEach((bubble) => {
      bubble.style.height = `${bubble.innerText}em`
      bubble.style.lineHeight = `${bubble.innerText}em`
      bubble.style.width = `1em`
    })
    boardCells.forEach((cell) => {
      cell.classList.remove('available')
    })
    checkAvailable()
  } else if (assume === 'vertical') {
    assume = 'horizontal'
    rotate.innerText = `Rotate ⥮`
    bubbleCont.classList.remove('verticalized')
    bubbleCont.classList.add('horizontalized')
    bubbleList.forEach((bubble) => {
      bubble.style.width = `${bubble.innerText}em`
      bubble.style.height = `1em`
      bubble.style.lineHeight = `1em`
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
    if (!jsyk.id.includes('endscreen')) {
      jsyk.style.opacity = 0
      setTimeout(function () {
        jsyk.innerHTML = ''
        jsyk.innerText = `The game hasn't even started yet!`
        jsyk.style.opacity = '1'
        jsyk.style.transition = 'opacity 0.5s'
        jsyk.setAttribute('class', 'alert')
      }, 300)
      setTimeout(function () {
        jsyk.style.opacity = 0
      }, 1500)
      setTimeout(function () {
        jsyk.innerHTML = ''
        jsyk.appendChild(preGame)
        jsyk.setAttribute('class', 'gentle')
        jsyk.style.opacity = 1
      }, 1900)
    } else if (jsyk.id.includes('endscreen')) {
    }
  } else if (npcBoard.classList.contains('visible')) {

  } else {
    jsyk.innerHTML = ''
    playerBoard.classList.add('invisible')
    playerBoard.classList.remove('visible')
    myBoard.classList.remove('clicked')
    oppMap.classList.add('clicked')
    npcBoard.classList.add('visible')
    npcBoard.classList.remove('invisible')
    reviewRules.classList.remove('clicked')
    theRules.classList.remove('visibleRules')
    theRules.classList.add('invisible')
    jsyk.style.opacity = '0'
  }
}

function backToMyBoard() {
  if (playerBoard.classList.contains('visible')) {

  } else {
    playerBoard.classList.remove('invisible')
    playerBoard.classList.add('visible')
    myBoard.classList.add('clicked')
    npcBoard.classList.remove('visible')
    npcBoard.classList.add('invisible')
    oppMap.classList.remove('clicked')
    reviewRules.classList.remove('clicked')
    theRules.classList.remove('visibleRules')
    theRules.classList.add('invisible')
  }
}

function seeRules() {
  if (theRules.classList.contains('visible')) {

  } else {
    theRules.classList.remove('invisible')
    theRules.classList.add('visibleRules')
    reviewRules.classList.add('clicked')
    playerBoard.classList.remove('visible')
    playerBoard.classList.add('invisible')
    myBoard.classList.remove('clicked')
    npcBoard.classList.remove('visible')
    npcBoard.classList.add('invisible')
    oppMap.classList.remove('clicked')
    jsyk.style.opacity = '0'
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
    if (activeCell.classList.contains('secret') && !activeCell.classList.contains('hit')) {
      activeCell.classList.add('hit')
      playerHits++
      showHits.innerText = `${playerHits}`
      checkWin()
    } else if (!activeCell.classList.contains('secret') && !activeCell.classList.contains('miss')) {
      activeCell.classList.add('miss')
      jsyk.innerHTML = ''
      jsyk.style.opacity = '1'
      jsyk.appendChild(missMsg)
      playerMisses++
      showMisses.innerText = `${playerMisses}`
      setTimeout(switchTurn, 2000);
    }
  } else { }

}

function checkWin() {
  if (playerHits === 14) {
    jsyk.innerHTML = ''
    jsyk.style.opacity = '1'
    jsyk.setAttribute('id', 'endscreen')
    jsyk.innerHTML = `You won! Congratulations! :D`
    npcBoardCells.forEach((cell) => {
      cell.removeEventListener('mouseover', gameHoverCell);
      cell.removeEventListener('mouseout', gameIdleCell);
      cell.removeEventListener('click', setGuess);
    })
  } else if (npcHits === 14) {
    jsyk.innerHTML = ''
    jsyk.style.opacity = '1'
    jsyk.setAttribute('id', 'endscreen')
    jsyk.innerHTML = `The computer wins! Now wasn't that fun? :)`
    npcBoardCells.forEach((cell) => {
      cell.removeEventListener('mouseover', gameHoverCell);
      cell.removeEventListener('mouseout', gameIdleCell);
      cell.removeEventListener('click', setGuess);
    })
  } else {
    jsyk.innerHTML = ''
    jsyk.style.opacity = '1'
    if (turnIs === 'player') {
      jsyk.appendChild(hitMsg)
    } else if (turnIs === 'npc') {
      jsyk.appendChild(npcHitMsg)
    }
    setTimeout(switchTurn, 2000);
  }
}

function npcTurn() {
  let index = Math.floor(Math.random() * npcChoices.length);
  let npcGuess = npcChoices[index]
  npcChoices.splice(index, 1);
  if (!boardCells[npcGuess].classList.contains('taken')) {
    boardCells[npcGuess].classList.add('miss')
    jsyk.innerHTML = ''
    jsyk.appendChild(npcMissMsg)
    npcMisses++
    showNPCMisses.innerText = `${npcMisses}`
    setTimeout(switchTurn, 2500)
  } else if (boardCells[npcGuess].classList.contains('taken')) {
    boardCells[npcGuess].classList.add('hit')
    npcHits++
    showNPCHits.innerText = `${npcHits}`
    checkWin()
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
  bubbleCont2.style.display = 'none';
  scoreboard.style.opacity = 1;
  jsyk.style.opacity = '0';
  jsyk.removeChild(readyMsg)
  jsyk.style.opacity = '1'
  jsyk.appendChild(turnMsg)
  boardCells.forEach((cell) => {
    cell.style.cursor = 'not-allowed';
  })
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

reviewRules.addEventListener('click', seeRules)