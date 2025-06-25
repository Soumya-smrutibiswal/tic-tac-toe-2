const winLine = document.getElementById('win-line');

// Mapping: index of board cells → x,y coordinates
const linePositions = {
    '0-1-2': { top: '50px', left: '0px', width: '316px', rotate: '0deg' },    // Top row
    '3-4-5': { top: '158px', left: '0px', width: '316px', rotate: '0deg' },   // Middle row
    '6-7-8': { top: '266px', left: '0px', width: '316px', rotate: '0deg' },   // Bottom row

    '0-3-6': { top: '0px', left: '50px', width: '316px', rotate: '90deg' },   // Left col
    '1-4-7': { top: '0px', left: '158px', width: '316px', rotate: '90deg' },  // Middle col
    '2-5-8': { top: '0px', left: '266px', width: '316px', rotate: '90deg' },  // Right col

    '0-4-8': { top: '0px', left: '0px', width: '447px', rotate: '45deg' },    // Diagonal \
    '2-4-6': { top: '0px', left: '0px', width: '447px', rotate: '-45deg' }    // Diagonal /
};


function showWinningLine(combination, player) {
    const key = combination.sort().join('-');
    const line = linePositions[key];

    if (line) {
        winLine.style.transition = 'none';
        winLine.style.width = '0';
        winLine.style.top = line.top;
        winLine.style.left = line.left;
        winLine.style.transform = `rotate(${line.rotate})`;
        winLine.style.backgroundColor = player === 'X' ? '#007bff' : '#ff4d4d';

        // Trigger line draw after short delay
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                winLine.style.transition = 'width 0.5s ease, transform 0.5s ease';
                winLine.style.width = line.width;
            });
        });
    }
}


const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let currentPlayer = 'X';
let gameActive = true;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleClick(e) {
    const cell = e.target;

    if (!gameActive || cell.textContent !== '') return;

    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    if (checkWin(currentPlayer)) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
    } else if (isDraw()) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWin(player) {
    return WINNING_COMBINATIONS.some(combination => {
        const hasWon = combination.every(index => {
            return cells[index].classList.contains(player);
        });

        if (hasWon) {
            showWinningLine(combination, player);
            return true;
        }
        return false;
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

function restartGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    winLine.style.width = '0';
    winLine.style.transform = 'none';
}


cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

restartBtn.addEventListener('click', restartGame);
