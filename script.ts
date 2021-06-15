class Calculator{
    preOperandTextElement: HTMLElement;
    curOperandTextElement: HTMLElement;
    curOperand: string = '0';
    preOperand: string = '';
    operation : string = '';
    resultNumber:number = 0;
    memoryNumber: number = 0;
    stackNumber: number = 0;
    stackOperation: string = '';
    clearFlag: boolean = false;
    calculateError:boolean = false;

    constructor(preOperandTextElement: HTMLElement, curOperandTextElement:HTMLElement){
        this.preOperandTextElement = preOperandTextElement;
        this.curOperandTextElement = curOperandTextElement;
    }

    clear(type: string){
        if(type === 'C'){
            this.resultNumber = 0;
            this.curOperand = '0';
            this.preOperand = '';
            this.operation = '';
            this.stackNumber = 0;
            this.stackOperation = ''
        }
        else
            this.curOperand = '0';
    }

    delete(){
        this.curOperand = this.curOperand.toString().slice(0,-1);
        if(this.curOperand === '')
            this.curOperand = '0';
    }

    appendNumber(number: string){
        if(this.clearFlag){
            this.curOperand = '';
            this.clearFlag = false;
        }
        if(number === '.' && this.curOperand.indexOf('.') != -1)
            return;
        if(this.curOperand === '0')
            this.curOperand = '';
        if(number === '.' && this.curOperand === '')
            this.curOperand = '0';
        this.curOperand += number;
    }

    chooseOperation(operation: string){
        if(!this.clearFlag && this.preOperand !== ''){
            this.compute();
            this.operation = operation;
            this.preOperand = this.preOperand + ' ' + this.operation;
            return;
        }
        this.operation = operation;
        if(this.preOperand === ''){
            this.resultNumber = parseFloat(this.curOperand);
            this.preOperand = this.curOperand + ' ' + this.operation
        }
        if(this.clearFlag){
            this.preOperand = this.preOperand.toString().slice(0,-2) + ' ' + this.operation;
        }
    }

    negate(){
        let cur = parseFloat(this.curOperand);
        cur *= -1;
        this.curOperand = cur.toString();
    }

    sqrt(){
        let cur = parseFloat(this.curOperand);
        if(cur < 0){
            this.calculateError = true;
            this.curOperand = '輸入無效';
            return;
        }
        cur = Math.sqrt(cur);
        this.curOperand = cur.toString();
    }

    reciprocal(){
        let cur = parseFloat(this.curOperand);
        if(cur === 0){
            this.calculateError = true;
            this.curOperand = '不能除以0';
            return;
        }
        cur = 1/cur;
        this.curOperand = cur.toString();
    }

    equal(){
        if(this.preOperand === '' && this.stackOperation !== ''){
            switch(this.stackOperation){
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
        else{
            this.stackNumber = parseFloat(this.curOperand);
            this.stackOperation = this.operation;
            this.compute();
            this.preOperand = '';
        }
    }

    compute(){
        const cur = parseFloat(this.curOperand);
        this.stackNumber = cur;
        switch(this.operation){
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
                if(cur === 0){
                    this.calculateError = true;
                    break;
                }
                this.resultNumber = this.resultNumber / cur;
                break;
            default:
                return;
        }
        if(this.calculateError){
            this.curOperand = '不能除以0';
            return;
        }
        this.preOperand = this.preOperand + ' ' + this.curOperand;
        this.curOperand = this.resultNumber.toString();
        this.operation = '';
    }

    mCompute(option: string){
        switch(option){
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
    }

    getDisplayNumber(number: string){
        const stringNumber = number;
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay: string;
        if(isNaN(integerDigits))
            integerDisplay = '';
        else
            integerDisplay = integerDigits.toLocaleString('en',{maximumFractionDigits: 0});
        if(decimalDigits != null)
            return `${integerDisplay}.${decimalDigits}`;
        else
            return integerDisplay;
    }

    updateDisplay(){
        if(this.calculateError){
            this.curOperandTextElement.innerText = this.curOperand;
            this.calculateError = false;
        }
        else{
            this.curOperandTextElement.innerText = this.getDisplayNumber(this.curOperand);
            this.preOperandTextElement.innerText = this.preOperand;
        }
    }
}

const numberButtons = Array.prototype.slice.call(document.querySelectorAll('[data-number]'));
const operationButtons = Array.prototype.slice.call(document.querySelectorAll('[data-operation]'));
const equalsButton = document.querySelector('[data-equals]')!;
const deleteButton = document.querySelector('[data-delete]')!;
const clearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-clear]'));
const negateButton = document.querySelector('[data-negate]')!;
const squareRootButton = document.querySelector('[data-square-root]')!;
const reciprocalButton = document.querySelector('[data-reciprocal]')!;
const mOperationButtons = Array.prototype.slice.call(document.querySelectorAll('[data-M-operation]')) ;
const preOperandTextElement = document.querySelector('[data-pre-operand]') as HTMLElement;
const curOperandTextElement = document.querySelector('[data-cur-operand]') as HTMLElement;

const calculator = new Calculator(preOperandTextElement, curOperandTextElement);

numberButtons.forEach(button=>{
    button.addEventListener('click', ()=>{
        calculator.appendNumber((button as HTMLElement).innerText)
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button=>{
    button.addEventListener('click', ()=>{
        calculator.chooseOperation((button as HTMLElement).innerText);
        calculator.clearFlag = true;
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', button=>{
    calculator.equal();
    calculator.clearFlag = true;
    calculator.updateDisplay();
})

clearButtons.forEach(button=>{
    button.addEventListener('click', ()=>{
        calculator.clear((button as HTMLElement).innerText)
        calculator.updateDisplay();
    })
})

deleteButton.addEventListener('click', button=>{
    calculator.delete();
    calculator.updateDisplay();
})

negateButton.addEventListener('click', button=>{
    calculator.negate();
    calculator.updateDisplay();
})

squareRootButton.addEventListener('click',button=>{
    calculator.sqrt();
    calculator.updateDisplay();
})

reciprocalButton.addEventListener('click', button=>{
    calculator.reciprocal();
    calculator.updateDisplay();
})

mOperationButtons.forEach(button=>{
    button.addEventListener('click', ()=>{
        calculator.mCompute((button as HTMLElement).innerText)
        calculator.clearFlag = true;
        calculator.updateDisplay();
    })
})