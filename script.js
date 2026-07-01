const GET_RANDOM_WORD = 'https://words.dev-apis.com/word-of-the-day?random=1';
const POST_WORD_URL = 'https://words.dev-apis.com/validate-word';

const LINES = 6;
const LETTERS = 5;

let currentWord = '';
let wordleWord;
let validWord;
let currentLine = 0;


const table = document.querySelector('.main');
const ww = document.querySelector('.wordle');
const hi = document.createElement('input');
table.appendChild(hi);
hi.focus();
hi.maxLength = 5;

hi.addEventListener('input', (e) => {
  // if ((hi.value)) {
    console.log(hi.value);
    typeLetter(hi.value.toUpperCase());
  // }
  // else if (e.key === 'Backspace') {
  //   console.log(currentWord);
  //   currentWord = currentWord.slice(0, -1);
  //   const line = document.querySelectorAll(`.line-${currentLine}`);
  //   line[currentWord.length].textContent = '';
  //   for (let i = 0; i < line.length; i++) {
  //     line[i].parentElement.classList.remove('nope')
  //   }
    
  //   currentWord.length >= 0 ?
  //   line[currentWord.length + 1].parentElement.classList.remove('focus-cell')
  //   : null;
  //   currentWord.length <= LETTERS ?
  //   line[(currentWord.length)].parentElement.classList.add('focus-cell')
  //   : null;
  // }
});

table.appendChild(getTable());
getNewWord();

async function getNewWord() {
  const promise = (await fetch(GET_RANDOM_WORD));
  wordleWord = await promise.json();
  console.log(wordleWord)
}

async function validateCurrentWord() {
  const promise = (await fetch(POST_WORD_URL, {
    method: 'POST',
    body: JSON.stringify({ 'word': currentWord.toString() })
  }));
  validWord = await promise.json();
  console.log(validWord)
}

function isLetter(symbol) {
  return /^[A-Za-z]$/.test(symbol);
}

function getTable() {
  const table = document.createElement('div');
  table.classList.add('table');
  for (let i = 0; i < LINES; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    for (let j = 0; j < LETTERS; j++) {
      const cell = document.createElement('div');
      i == 0 && j == 0 ? cell.classList.add('focus-cell') : null;
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

function typeLetter(letters) {
  console.log(letters);
  console.log(currentWord);
  const line = document.querySelectorAll(`.line-${currentLine}`);
  if (currentWord.length < LETTERS) {
    currentWord = letters;
    for (let i = 0; i < currentWord.length; i++) {
      line[i].textContent = currentWord[i];
    }
    if (currentWord.length === LETTERS) {
      checkWord(currentWord);
    }
  }
  currentWord.length > 0 ?
    line[currentWord.length - 1].parentElement.classList.remove('focus-cell')
    : null;
  currentWord.length < LETTERS ?
    line[(currentWord.length)].parentElement.classList.add('focus-cell')
    : null;

  console.log(currentWord);
}

async function checkWord(word) {
  if (word === wordleWord.word.toUpperCase()) {
    console.log('YES');
    const line = document.querySelectorAll(`.line-${currentLine}`);
    for (let i = 0; i < line.length; i++) {
      line[i].parentElement.classList.add('correct');
    }
  }
  else {
    await validateCurrentWord();
    console.log(validWord.validWord);
    if (validWord.validWord) {
      const line = document.querySelectorAll(`.line-${currentLine}`);
      for (let i = 0; i < line.length; i++) {
        if (line[i].textContent.toLowerCase() === wordleWord.word[i]) {
          console.log(line[i].textContent, wordleWord.word.toUpperCase())
          line[i].parentElement.classList.add('correct');
        }
        if (wordleWord.word.includes(line[i].textContent.toLocaleLowerCase()))
          line[i].parentElement.classList.add('miss');
        else
          line[i].parentElement.classList.add('empty');

      }
      currentWord = '';
      currentLine++;
      hi.value = '';
    }
    else {
      const line = document.querySelectorAll(`.line-${currentLine}`);
      for (let i = 0; i < line.length; i++) {
        line[i].parentElement.classList.add('nope');
        console.log('nope')
      }
      currentWord = '';
    }
    if (currentLine == 6) {
      ww.textContent = wordleWord.word;
    }
  }
}
