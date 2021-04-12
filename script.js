const enteredSum = document.querySelector('#entered-sum');
const currentValue = document.querySelector('#current-value');
const buttons = document.querySelectorAll('.btn');

let inputNum1 = '';
let inputOperator = '';
let inputNum2 = '';
let result = '';
let clearOnInput = false;

const operators = ['/', '*', 'x', '-', '+'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']

let lastLengthES;
const adjustEnteredSum = function(method, value) {
    if(method === '=') { enteredSum.innerHTML = value }
    if(method === '+=') { enteredSum.innerHTML += value }
    let length = enteredSum.innerHTML.toString().length;
    if(length < lastLengthES) { enteredSum.classList = 'values' };
    if(length >= 21) {
        if(enteredSum.classList.contains(`smaller-text-${length-1}`)) {
            enteredSum.classList.remove(`smaller-text-${length-1}`)
        }
        enteredSum.classList.add(`smaller-text-${length}`);
        lastLengthES = length;
}}

let lastLengthCV;
const adjustCurrentValue = function(method, value) {
    if(method === '=') { currentValue.innerHTML = value }
    if(method === '+=') { currentValue.innerHTML += value }
    let length = currentValue.innerHTML.toString().length;
    if(length < lastLengthCV) {currentValue.classList = 'values'};
    if(length >= 10) {
        if(currentValue.classList.contains(`smaller-text-${length-1}`)) {
            currentValue.classList.remove(`smaller-text-${length-1}`)
        }
        currentValue.classList.add(`smaller-text-${length}`);
        lastLengthCV = length;
}}

const inputSelection = function(e) {
    if(e === 'Backspace') { return removeValue() }
    if(e === 'AC' || e === 'Escape') { return clear() }
    if(e === '+/-') { posNeg() }
    if(e === '%') { return percentage() }
    if(numbers.includes(e) || numbers.includes(e)) { return userInputNr(e) }
    if(operators.includes(e) || operators.includes(e)) { return userInputOpr(e) }
    if(e === '=' || e === 'Enter') { return equals(inputOperator, inputNum1, inputNum2) }
}

const removeValue = function() {
    if(clearOnInput) { return clear() }
    if(inputOperator === '') {
        inputNum1 = inputNum1.slice(0, -1);
        adjustCurrentValue('=',currentValue.innerHTML.slice(0, -1));
    } else {
        inputNum2 = inputNum2.slice(0, -1);
        adjustCurrentValue('=',currentValue.innerHTML.slice(0, -1));
    }
}

const clear = function() {
    adjustEnteredSum('=', '');
    adjustCurrentValue('=','');
    inputNum1 = '';
    inputOperator = '';
    inputNum2 = '';
    result = '';
    clearOnInput = false;
    lastLengthES = undefined;
    lastLengthCV = undefined;
}

const posNeg = function() {
        if(clearOnInput) { return clear() }
        if(!isNaN(currentValue.innerHTML)) {
            if(currentValue.innerHTML.charAt(0) === '-') {
                if(result !== '') {
                    result = result.toString().slice(1);
                    adjustCurrentValue('=', currentValue.innerHTML.slice(1));                    
                } else if(inputOperator === '') {
                    inputNum1 = inputNum1.toString().slice(1);
                    adjustCurrentValue('=', currentValue.innerHTML.slice(1));                    
                } else {
                    inputNum2 = inputNum2.toString().slice(1);
                    adjustCurrentValue('=', currentValue.innerHTML.slice(1));                    
                }
            } else {
                if(result !== '') {
                    result = '-' + result;
                    adjustCurrentValue('=', '-' + currentValue.innerHTML);
                } else if(inputOperator === '') {
                    inputNum1 = '-' + inputNum1;
                    adjustCurrentValue('=', '-' + currentValue.innerHTML);
                } else {
                    inputNum2 = '-' + inputNum2;
                    adjustCurrentValue('=', '-' + currentValue.innerHTML);
                }                
            }
        }
    }

const percentage = function() {
    if(clearOnInput) { return clear() }
    if(result !== '') {
        result = math('%', result);
        adjustCurrentValue('=', math('%', currentValue.innerHTML));
    } else if(inputOperator === '') {
        if(inputNum1 === '') { return }
        inputNum1 = math('%', inputNum1);
        adjustCurrentValue('=', math('%', currentValue.innerHTML));
    } else {
        if(inputNum2 === '') { return }
        inputNum2 = math('%', inputNum2);
        adjustCurrentValue('=', math('%', currentValue.innerHTML));
    }
}

const userInputNr = function(input) {
    if(result !== '' && clearOnInput) { clear() }
    if((input === ',' || input === '.') && currentValue.innerHTML.indexOf('.') !== -1) { return }
    if(currentValue.innerHTML.replace('.', '').length >= 9) { return }
    if(inputOperator === '') {
        inputNum1 += input;
        adjustCurrentValue('+=', input);
    } else {
        inputNum2 += input;
        adjustCurrentValue('+=', input);
    }
}

const userInputOpr = function(opr) {
    if(opr === 'x') {opr = '*'};
    if(inputNum1 !== '' && inputNum2 !== '' && result === '') { //when user has entered num1, num2 but has not pressed equals, and entering another operator
        inputNum1 = math(inputOperator, inputNum1, inputNum2);
        inputOperator = `${opr}`;
        inputNum2 = '';
        adjustEnteredSum('=', inputNum1 + ` ${opr} `);
        adjustCurrentValue('=', '');
    } else if(result !== '') { //when user has pressed equals and wants to enter another operator
        if(isNaN(result)) { return clear() };
        inputOperator = `${opr}`;
        inputNum1 = result;
        result = '';
        inputNum2 = '';
        adjustEnteredSum('=', inputNum1 + ` ${opr} `);        
        adjustCurrentValue('=', '');
    } else if(currentValue.innerHTML === '' && enteredSum.innerHTML !== '') { //when user dubbel clicks operator
        inputOperator = `${opr}`;
        enteredSum.innerHTML = inputNum1 + ` ${opr} `;
    } else { //when user has only entered num1 and enters the first operator
    inputOperator = `${opr}`;
    adjustEnteredSum('=', currentValue.innerHTML + ` ${opr} `);
    adjustCurrentValue('=', '');
    }
}

const equals = function(opr, aNr, bNr) {
    if(inputOperator !=='') {
        adjustEnteredSum('=', aNr + ' ' + opr + ' ' + bNr);
    }
    if(inputNum2 ==='') { return; }
    result = math(opr, aNr, bNr);
    if(isNaN(result)) { 
        clearOnInput = true; 
        return adjustCurrentValue('=', 'Error :(');
    }
    adjustCurrentValue('=', result);
    inputOperator = '';
    clearOnInput = true;
}

const math = function(opr, x, y) {
    x = parseFloat(x);
    y = parseFloat(y);
    const formulas = {
    '/': (x, y) => {return (x / y).toFixed(8)},
    '*': (x, y) => {return (x * y).toFixed(8)},
    '-': (x, y) => {return (x - y).toFixed(8)},
    '+': (x, y) => {return (x + y).toFixed(8)},
    '%': (x, y) => {return (x / 100).toFixed(8)}}
    let formulaResult = parseFloat(formulas[opr](x, y));
    adjustCurrentValue(currentValue, formulaResult);
    return formulaResult;
}

document.addEventListener('keydown', (e) => inputSelection(e.key));
buttons.forEach((button) => {
    button.addEventListener('click', (e) => inputSelection(e.target.textContent));
})