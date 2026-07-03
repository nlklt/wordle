import { GET_RANDOM_WORD, VALIDATE_WORD_URL, LETTERS, LINES } from './constants.js'

export default class WordleGame {
    #secretWord = '';
    #currentLine = 0;
    #currentWord = '';
    #isGameOver = false;

    #onWin;
    #onLose;
    #onEvaluate;

    constructor({ onWin, onLose, onEvaluate }) {
        this.#onWin = onWin;
        this.#onLose = onLose;
        this.#onEvaluate = onEvaluate;
    }

    table = [];
    isBusy = false;

    async start(table) {
        this.table = table;
        await this.#fetchWord();
    }

    async #fetchWord() {
        this.isBusy = true;
        const promise = (await fetch(GET_RANDOM_WORD));
        const data = await promise.json();
        this.#secretWord = data.word;
        this.isBusy = false;
    }

    writeWord(word) {
        if (this.#isGameOver) return;
        if (!this.isBusy) {
            this.#currentWord = word;
            for (let i = 0; i < LETTERS; i++) {
                this.table[this.#currentLine][i].cell.classList.remove('nope');
                if (this.#currentWord.length > i) {
                    (this.table[this.#currentLine][i].letter).textContent = this.#currentWord[i].toLocaleUpperCase();
                }
                else {
                    (this.table[this.#currentLine][i].letter).textContent = '';
                }
            }

            this.updateFocus(this.table[this.#currentLine], this.#currentWord)

            if (this.#currentWord.length === LETTERS) {
                this.checkWord(this.#currentWord);
            }
        }
    }

    async validateWord(word) {
        const promise = (await fetch(VALIDATE_WORD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'word': word })
        }));

        const data = await promise.json();
        return data.validWord;
    }

    async checkWord(word) {
        if (word === this.#secretWord) {
            this.#isGameOver = true;
            this.#onWin();
        }
        this.isBusy = true;
        const colors = this.evaluateWord(word, this.#secretWord);
        this.#onEvaluate(this.#currentLine, (await colors));
        if (await this.validateWord(word)) {
            this.#currentLine++;
            this.updateFocus(this.table[this.#currentLine], this.#currentWord);
            if (this.#currentLine === LINES) {
                this.#isGameOver = true;
                this.#onLose(this.#secretWord);
            }
        }
        this.isBusy = false;
    }

    async evaluateWord(word, secretWord) {
        const result = Array(LETTERS).fill('nope');
        console.log(`word: ${word}`)
        console.log(`secret: ${secretWord}`)
        this.isBusy = true;
        if (!await this.validateWord(word)) {
            return result;
        }
        this.isBusy = false;
        for (let i = 0; i < LETTERS; i++) {
            if (word[i] === secretWord[i]) {
                result[i] = 'correct';
            }
            else if (secretWord.includes(word[i])) {
                result[i] = 'miss';
            }
            else {
                result[i] = 'empty';
            }
        }
        return result;
    }

    updateFocus(line, word) {
        if (this.#currentLine < LINES) {
            if (word.length > 0) {
                line[word.length - 1].cell.classList.remove('focus-cell')
            }
            if (word.length < LETTERS) {
                line[word.length].cell.classList.add('focus-cell')
            }
            if (word.length < LETTERS - 1) {
                console.log(word);
                line[word.length + 1].cell.classList.remove('focus-cell')
            }
        }
    }
}