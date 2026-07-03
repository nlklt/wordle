import { LETTERS, LINES } from './constants.js'
import WordleGame from './game.js';

const wordle = document.querySelector('.wordle');
const container = document.querySelector('.main');

const table = [];
createTable(container);

const hideInput = document.createElement('input');
hideInput.name = 'word';
hideInput.type = 'text';
hideInput.maxLength = 5;

let firstClick = true;
hideInput.addEventListener('click', (e) => {
    wordle.textContent = 'Wordle! type words';
    if (firstClick) {
        firstClick = false;
        (table[0][0].cell).classList.add('focus-cell');
    }
});

hideInput.addEventListener('input', (e) => {
    hideInput.value = hideInput.value.replace(/\W|\d|_/g, '');
    game.writeWord(hideInput.value);
});

const game = new WordleGame({
    onWin: () => { wordle.textContent = 'You WIN))'; },
    onLose: (word) => { wordle.textContent = `Word is ${word}`; },
    onEvaluate: (idxLine, colors) => {
        for (let i = 0; i < LETTERS; i++) {
            table[idxLine][i].cell.classList.add(colors[i]);
        }
        if (colors[0] !== 'nope') {
            hideInput.value = '';
        }
    }
});

game.start(table);

container.appendChild(hideInput);

function createTable(container) {
    container.classList.add('table');
    for (let i = 0; i < LINES; i++) {
        table[i] = [];
        const line = document.createElement('div');
        line.classList.add('line');
        for (let j = 0; j < LETTERS; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const letter = document.createElement('p');

            table[i][j] = { cell, letter };

            cell.appendChild(letter);
            line.appendChild(cell);
        }
        container.appendChild(line);
    }
}