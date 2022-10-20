(function() { // 구현 기능 목록
  var calculator = (function() {
    var _view = null;
    var numArray = [0];
    var operArray = [];
    var numArray2 = [];
    var operArray2 = [];
    var equal = null;

    function _init(view) {
      _view = view;
    }

    function _handleInputNumber() { // 숫자 입력 기능 구현
      var num = this.innerHTML;
      if (equal == "=") {
        console.log("hi");
        console.log(numArray);
        numArray.pop();
      }
      if (numArray.length == operArray.length) {
        numArray.push(Number(num));
      } else {
        var numStr = String(numArray.pop());
        numArray.push(Number(numStr + num));
        if (num == ".") {
          numArray.push(String(numArray.pop() + num));
        }
      }
      _newView();
    }

    function _getOperWeigth(oper) {  
      return oper === "+" || oper === "-" ? 0 : 1;
    }

    function _compareOper(oper1, oper2) { // 값 비교 기능 구현
      if (_getOperWeigth(oper1) > _getOperWeigth(oper2)) {
        return 1;
      } else if (_getOperWeigth(oper1) == _getOperWeigth(oper2)) {
        return 0;
      }
      return -1;
    }

    function _calculator(num2, num1, oper) { // 사칙연산 기능 구현
      switch (oper) {
        case "+":
          return num1 + num2;
        case "-":
          return num1 - num2;
        case "*":
          return num1 * num2;
        case "/":
          return num1 / num2;
      }
    }

    function _numPush() {
      numArray.push(
        _calculator(numArray.pop(), numArray.pop(), operArray.pop())
      );
    }

    function _newView() {
      _view.innerHTML = numArray[operArray.length];
    }

    function _saemLength(currOper) {
      console.log("hi");
      if (currOper == "=") {
        var newNum = numArray.pop();
        numArray.push(_calculator(newNum, newNum, operArray.pop()));

        if (numArray.length == 2 && operArray.length == 1) {
          _numPush();
        }
        _newView();
      } else {
        if (numArray.length == 1) {
          if (numArray2.length > 0) {
            numArray = numArray2.slice();
            operArray = operArray2.slice();
            _newView();
          } else {
            operArray.push(currOper);
            operArray.shift();
          }
          numArray2 = [];
          operArray2 = [];
        } else {
          operArray.pop();
          operArray.push(currOper);
          _tempView(numArray, operArray);
        }
      }
    }

    function _noEqualOper(currOper) {
      numArray2 = numArray.slice();
      operArray2 = operArray.slice();
      _numPush();
      _newView();
      operArray.push(currOper);

      if (operArray.length == 2) {
        tempOper = operArray.pop();
        if (_getOperWeigth(tempOper) == 0) {
          _numPush();
          _view.innerHTML = numArray[0];
          operArray.push(tempOper);
        } else {
          operArray.push(tempOper);
        }
      }
    }

    function _equalOper(currOper) {
      if (operArray.length == 0) return _newView();

      _numPush();

      if (numArray.length == 2 && operArray.length == 1 && currOper == "=") {
        _numPush();
      }
      _newView();
    }

    function _tempView() {
      var newNumArray = numArray.slice();
      var newOperArray = operArray.slice();
      tempOper = newOperArray.pop();
      if (_getOperWeigth(tempOper) == 0) {
        newNumArray.push(
          _calculator(newNumArray.pop(), newNumArray.pop(), newOperArray.pop())
        );
        _view.innerHTML = newNumArray[0];
      } else {
        _view.innerHTML = newNumArray[1];
      }
      newOperArray.push(tempOper);
    }

    function _handleInputOper() {
      var lastOper = operArray[operArray.length - 1];
      var currOper = this.innerHTML;
      equal = currOper;
      console.log(equal);
      if (numArray.length == operArray.length) {
        _saemLength(currOper);
      } else if (
        lastOper &&
        currOper != "=" &&
        _compareOper(lastOper, currOper) >= 0
      ) {
        _noEqualOper(currOper);
      } else if (
        lastOper &&
        currOper != "=" &&
        _compareOper(lastOper, currOper) == -1
      ) {
        operArray.push(currOper);
      } else if (currOper == "=") {
        _equalOper();
      } else {
        operArray.push(currOper);
      }
      console.log("기호입력");
      console.log(lastOper);
      console.log(currOper);
    }

    function _handleInputEtc() {
      var etc = this.innerHTML;
      if (etc == "AC") {
        numArray = [0];
        operArray = [];
      } else if (etc == "%") {
        var percentView = numArray.pop() / 100;
        numArray.push(percentView);
      } else if (etc == "+/-") {
        var pm = numArray.pop();
        numArray.push(pm * -1);
      }
      _newView();
    }

    return {
      init: _init,
      handleInputNumber: _handleInputNumber,
      handleInputOper: _handleInputOper,
      handleInputEtc: _handleInputEtc
    };
  })();

  window.addEventListener("DOMContentLoaded", function() {
    calculator.init(document.getElementById("ivalue"));

    var cols = document.querySelectorAll("div.calculator-button > button");

    Array.prototype.forEach.call(cols, function(col) {
      if (col.dataset.numvalue) {
        col.addEventListener("click", calculator.handleInputNumber, false);
      } else if (col.dataset.opervalue) {
        col.addEventListener("click", calculator.handleInputOper, false);
      } else {
        col.addEventListener("click", calculator.handleInputEtc, false);
      }
    });
  });
})();
