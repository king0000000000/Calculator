"use strict";
var Calculator = /** @class */ (function () {
    function Calculator(preOperandTextElement, curOperandTextElement) {
        this.curOperand = '0';
        this.preOperand = '';
        this.operation = '';
        this.resultNumber = 0;
        this.memoryNumber = 0;
        this.stackNumber = 0;
        this.stackOperation = '';
        this.clearFlag = false;
        this.calculateError = false;
        this.preOperandTextElement = preOperandTextElement;
        this.curOperandTextElement = curOperandTextElement;
    }
    Calculator.prototype.clear = function (type) {
        if (type === 'C') {
            this.resultNumber = 0;
            this.curOperand = '0';
            this.preOperand = '';
            this.operation = '';
            this.stackNumber = 0;
            this.stackOperation = '';
        }
        else
            this.curOperand = '0';
    };
    Calculator.prototype.delete = function () {
        this.curOperand = this.curOperand.toString().slice(0, -1);
        if (this.curOperand === '')
            this.curOperand = '0';
    };
    Calculator.prototype.appendNumber = function (number) {
        if (this.clearFlag) {
            this.curOperand = '';
            this.clearFlag = false;
        }
        if (number === '.' && this.curOperand.indexOf('.') != -1)
            return;
        if (this.curOperand === '0')
            this.curOperand = '';
        if (number === '.' && this.curOperand === '')
            this.curOperand = '0';
        this.curOperand += number;
    };
    Calculator.prototype.chooseOperation = function (operation) {
        if (!this.clearFlag && this.preOperand !== '') {
            this.compute();
            this.operation = operation;
            this.preOperand = this.preOperand + ' ' + this.operation;
            return;
        }
        this.operation = operation;
        if (this.preOperand === '') {
            this.resultNumber = parseFloat(this.curOperand);
            this.preOperand = this.curOperand + ' ' + this.operation;
        }
        if (this.clearFlag) {
            this.preOperand = this.preOperand.toString().slice(0, -2) + ' ' + this.operation;
        }
    };
    Calculator.prototype.negate = function () {
        var cur = parseFloat(this.curOperand);
        cur *= -1;
        this.curOperand = cur.toString();
    };
    Calculator.prototype.sqrt = function () {
        var cur = parseFloat(this.curOperand);
        if (cur < 0) {
            this.calculateError = true;
            this.curOperand = '輸入無效';
            return;
        }
        cur = Math.sqrt(cur);
        this.curOperand = cur.toString();
    };
    Calculator.prototype.reciprocal = function () {
        var cur = parseFloat(this.curOperand);
        if (cur === 0) {
            this.calculateError = true;
            this.curOperand = '不能除以0';
            return;
        }
        cur = 1 / cur;
        this.curOperand = cur.toString();
    };
    Calculator.prototype.equal = function () {
        if (this.preOperand === '' && this.stackOperation !== '') {
            switch (this.stackOperation) {
                case '+':
                    this.resultNumber = this.resultNumber + this.stackNumber;
                    break;
                case '-':
                    this.resultNumber = this.resultNumber - this.stackNumber;
                    break;
                case '×':
                    this.resultNumber = this.resultNumber * this.stackNumber;
                    break;
                case '÷':
                    this.resultNumber = this.resultNumber / this.stackNumber;
                    break;
                default:
                    return;
            }
            this.curOperand = this.resultNumber.toString();
        }
        else {
            this.stackNumber = parseFloat(this.curOperand);
            this.stackOperation = this.operation;
            this.compute();
            this.preOperand = '';
        }
    };
    Calculator.prototype.compute = function () {
        var cur = parseFloat(this.curOperand);
        this.stackNumber = cur;
        switch (this.operation) {
            case '+':
                this.resultNumber = this.resultNumber + cur;
                break;
            case '-':
                this.resultNumber = this.resultNumber - cur;
                break;
            case '×':
                this.resultNumber = this.resultNumber * cur;
                break;
            case '÷':
                if (cur === 0) {
                    this.calculateError = true;
                    break;
                }
                this.resultNumber = this.resultNumber / cur;
                break;
            default:
                return;
        }
        if (this.calculateError) {
            this.curOperand = '不能除以0';
            return;
        }
        this.preOperand = this.preOperand + ' ' + this.curOperand;
        this.curOperand = this.resultNumber.toString();
        this.operation = '';
    };
    Calculator.prototype.mCompute = function (option) {
        switch (option) {
            case 'MC':
                this.memoryNumber = 0;
                break;
            case 'MR':
                this.curOperand = this.memoryNumber.toString();
                break;
            case 'MS':
                this.memoryNumber = parseFloat(this.curOperand);
                break;
            case 'M+':
                this.memoryNumber += parseFloat(this.curOperand);
                break;
            case 'M-':
                this.memoryNumber -= parseFloat(this.curOperand);
                break;
            default:
                return;
        }
    };
    Calculator.prototype.getDisplayNumber = function (number) {
        var stringNumber = number;
        var integerDigits = parseFloat(stringNumber.split('.')[0]);
        var decimalDigits = stringNumber.split('.')[1];
        var integerDisplay;
        if (isNaN(integerDigits))
            integerDisplay = '';
        else
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        if (decimalDigits != null)
            return integerDisplay + "." + decimalDigits;
        else
            return integerDisplay;
    };
    Calculator.prototype.updateDisplay = function () {
        if (this.calculateError) {
            this.curOperandTextElement.innerText = this.curOperand;
            this.calculateError = false;
        }
        else {
            this.curOperandTextElement.innerText = this.getDisplayNumber(this.curOperand);
            this.preOperandTextElement.innerText = this.preOperand;
        }
    };
    return Calculator;
}());
var numberButtons = Array.prototype.slice.call(document.querySelectorAll('[data-number]'));
var operationButtons = Array.prototype.slice.call(document.querySelectorAll('[data-operation]'));
var equalsButton = document.querySelector('[data-equals]');
var deleteButton = document.querySelector('[data-delete]');
var clearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-clear]'));
var negateButton = document.querySelector('[data-negate]');
var squareRootButton = document.querySelector('[data-square-root]');
var reciprocalButton = document.querySelector('[data-reciprocal]');
var mOperationButtons = Array.prototype.slice.call(document.querySelectorAll('[data-M-operation]'));
var preOperandTextElement = document.querySelector('[data-pre-operand]');
var curOperandTextElement = document.querySelector('[data-cur-operand]');
var calculator = new Calculator(preOperandTextElement, curOperandTextElement);
numberButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});
operationButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        calculator.chooseOperation(button.innerText);
        calculator.clearFlag = true;
        calculator.updateDisplay();
    });
});
equalsButton.addEventListener('click', function (button) {
    calculator.equal();
    calculator.clearFlag = true;
    calculator.updateDisplay();
});
clearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        calculator.clear(button.innerText);
        calculator.updateDisplay();
    });
});
deleteButton.addEventListener('click', function (button) {
    calculator.delete();
    calculator.updateDisplay();
});
negateButton.addEventListener('click', function (button) {
    calculator.negate();
    calculator.updateDisplay();
});
squareRootButton.addEventListener('click', function (button) {
    calculator.sqrt();
    calculator.updateDisplay();
});
reciprocalButton.addEventListener('click', function (button) {
    calculator.reciprocal();
    calculator.updateDisplay();
});
mOperationButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        calculator.mCompute(button.innerText);
        calculator.clearFlag = true;
        calculator.updateDisplay();
    });
});
