class CalcController {
  constructor() {
    this._lastOperator = " ";
    this._lastNumber = " ";

    this._operation = [];
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._locale = "en-US";
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
    this.initKeyboard();
  }

  initialize() {

    this.setDisplayDateTime();

    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000); // a cada um segundo

    this.setLastNumberDisplay();

  }

  initKeyboard() {

    document.addEventListener('keyup', event => {

      switch (event.key) {
        case 'Escape':
          this.clearAll();
          break;
        case 'Backspace':
          this.clearEntry();
          break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
          this.addOperation(event.key);
          break;
        case 'Enter':
        case '=':
          this.calc();
          break;
        case '.':
        case ',':
          this.addDot();
          break;
  
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(event.key);
          break;
      }
      console.log('keyup',event.key);
      
    });
  }

  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }

  get displayTime() {
    return this._timeEl.innerHTML;
  }

  set displayTime(value) {
    this._timeEl.innerHTML = value;
  }

  get displayDate() {
    return this._dateEl.innerHTML;
  }

  set displayDate(value) {
    this._dateEl.innerHTML = value;
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    this._displayCalcEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(value) {
    this._currentDate = value;
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  isOperator(value) {

    return (['+', '-', '%', '/', '*'].indexOf(value) > -1);
  }

  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {

      this.calc();

    }
  }

  getResult() {

    return eval(this._operation.join("")); // executa a operção do array
  }

  calc() {

    let last = "";
    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {

      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];

    }

    if (this._operation.length > 3) {

      last = this._operation.pop();//tira o ultimo item do array

      this._lastNumber = this.getResult();

    } else if (this._operation.length == 3) {

      this._lastNumber = this.getLastItem(false);

    }

    let result = this.getResult();

    if (last == '%') {

      result /= 100; //  result = result / 100;
      this._operation = [result];

    } else {

      this._operation = [result];

      if (last) this._operation.push(last);

    }
    this.setLastNumberDisplay();

  }

  getLastItem(isOperator = true) {

    let lastItem;
    for (let i = this._operation.length - 1; i >= 0; i--) {

      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }

    }

    if (!lastItem) { //não encontrou, provalvelmente esta undefined

      lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
      //pegando da memória o operador ou o numero

    }

    return lastItem;

  }

  setLastNumberDisplay() {

    let lastNumber = this.getLastItem(false);

    if (!lastNumber || lastNumber == ' ') lastNumber = 0;

    this.displayCalc = lastNumber;

  }

  addOperation(value) {

    if (isNaN(this.getLastOperation())) {
      //string
      if (this.isOperator(value)) {

        this.setLastOperation(value);

      } else {
        //primeira vez que adicionou um número
        this.pushOperation(value);
        this.setLastNumberDisplay();

      }
    } else {
      //number
      if (this.isOperator(value)) {

        this.pushOperation(value);

      } else {

        let newValue = this.getLastOperation().toString() + value;
        this.setLastOperation(newValue);

        //update display
        this.setLastNumberDisplay();
      }

    }
    console.log(this._operation)
  }

  clearAll() {
    this._operation = [];
    this._lastNumber = '';
    this._lastOperator = '';

    this.setLastNumberDisplay();
  }

  clearEntry() {
    this._operation.pop();
    this.setLastNumberDisplay();
  }

  addDot() {

    let lastOperation = this.getLastOperation();

    if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > - 1) return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation('0.');
    } else {
      this.setLastOperation(lastOperation.toString() + '.');
    }
    this.setLastNumberDisplay();

  }

  setError() {
    this.displayCalc = "Error"
  }

  execBtn(value) {
    switch (value) {
      case 'ac':
        this.clearAll();
        break;
      case 'ce':
        this.clearEntry();
        break;
      case 'soma':
        this.addOperation('+');
        break;
      case 'subtracao':
        this.addOperation('-');
        break;
      case 'divisao':
        this.addOperation('/');
        break;
      case 'multiplicacao':
        this.addOperation('*');
        break;
      case 'porcento':
        this.addOperation('%');
        break;
      case 'igual':
        this.calc();
        break;
      case 'ponto':
        this.addDot();
        break;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addOperation(parseInt(value));
        break;

      default:
        this.setError();
        break;

    }
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {

      element.addEventListener(event, fn, false);

    });
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    buttons.forEach((btn, index) => {

      this.addEventListenerAll(btn, "click drag", e => {

        // console.log(btn.className.baseVal.replace("btn-", ""));
        let textBtn = btn.className.baseVal.replace("btn-", "");
        this.execBtn(textBtn);

      });

      this.addEventListenerAll(btn, "mouseover", e => {
        btn.style.cursor = "pointer";
      });

    });
  }
}
