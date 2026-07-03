const GET_RANDOM_WORD = 'https://words.dev-apis.com/word-of-the-day?random=1';
const POST_WORD_URL = 'https://words.dev-apis.com/validate-word';

const LINES = 6;
const LETTERS = 5;

let currentWord = '';
let wordleWord;
let validWord;
let currentLine = 0;


const main = document.querySelector('.main');
const wordle = document.querySelector('.wordle');

main.appendChild(getTable());

const hideInput = document.createElement('input');
hideInput.addEventListener('input', (e) => {
  hideInput.value = hideInput.value.replace(/\W|\d|_/g, '');
  writeWord(hideInput.value);
  const line = document.querySelectorAll(`.line-${currentLine}`);
  for (let i = 0; i < LETTERS; i++) {
    line[i].parentElement.classList.remove('nope');
  }
});
hideInput.addEventListener('click', (e) => {
  wordle.textContent = 'Wordle! type words';
  main.firstChild.firstChild.firstChild.classList.add('focus-cell');
});
hideInput.name = 'word';
hideInput.maxLength = 5;
main.appendChild(hideInput);


getNewWord();

async function getNewWord() {
  const promise = (await fetch(GET_RANDOM_WORD));
  wordleWord = await promise.json();
  console.log(`wordleWord: ${wordleWord.word}`)
}

function getTable() {
  const table = document.createElement('div');
  table.classList.add('table');
  for (let i = 0; i < LINES; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    for (let j = 0; j < LETTERS; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const letter = document.createElement('p');
      letter.classList.add(`line-${i}`);
      letter.classList.add(`cell-${j}`);
      cell.appendChild(letter);
      line.appendChild(cell);
    }
    table.appendChild(line);
  }
  return table;
}

function writeWord(word) {
  const line = document.querySelectorAll(`.line-${currentLine}`);
  currentWord = word;
  for (let i = 0; i < LETTERS; i++) {
    if (currentWord.length > i) {
      line[i].textContent = currentWord[i].toLocaleUpperCase();
    }
    else {
      line[i].textContent = '';
    }
  }

  currentWord.length > 0 ?
    line[currentWord.length - 1].parentElement.classList.remove('focus-cell')
    : null;
  currentWord.length < LETTERS - 1 ?
    line[currentWord.length + 1].parentElement.classList.remove('focus-cell')
    : null
  currentWord.length < LETTERS ?
    line[(currentWord.length)].parentElement.classList.add('focus-cell')
    : null;

    
  if (currentWord.length == LETTERS) {
    checkWord(currentWord);
  }
}

async function checkWord(word) {
  if (word === wordleWord.word) {
    wordle.textContent = 'You WIN))'
    const line = document.querySelectorAll(`.line-${currentLine}`);
    for (let i = 0; i < line.length; i++) {
      line[i].parentElement.classList.add('correct');
    }
  }
  else {
    await validateCurrentWord();
    if (validWord.validWord) {
      const line = document.querySelectorAll(`.line-${currentLine}`);
      for (let i = 0; i < line.length; i++) {
        if (line[i].textContent.toLowerCase() === wordleWord.word[i]) {
          line[i].parentElement.classList.add('correct');
        }
        if (wordleWord.word.includes(line[i].textContent.toLocaleLowerCase()))
          line[i].parentElement.classList.add('miss');
        else
          line[i].parentElement.classList.add('empty');
        
      }
      currentLine++;
      currentWord = '';
      hideInput.value = '';
      
      currentLine < LINES 
        ? () => {
          const nextLine = document.querySelectorAll(`.line-${currentLine}`)
          nextLine[0].parentElement.classList.add('focus-cell');
        }
        : null;
    }
    else {
      const line = document.querySelectorAll(`.line-${currentLine}`);
      for (let i = 0; i < line.length; i++) {
        line[i].parentElement.classList.add('nope');
      }
      currentWord = '';
    }
    if (currentLine == 6) {
      wordle.textContent = `Word is "${wordleWord.word}"((`;
    }
  }
}

async function validateCurrentWord() {
  const promise = (await fetch(POST_WORD_URL, {
    method: 'POST',
    body: JSON.stringify({ 'word': currentWord.toString() })
  }));
  validWord = await promise.json();
}
