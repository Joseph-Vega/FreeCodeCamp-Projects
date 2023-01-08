import * as React from "https://cdn.skypack.dev/react@17.0.1";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";
import { evaluate } from "https://cdn.skypack.dev/mathjs@9.4.3";
const { useState, useEffect } = React;

const DIVIDE = "/";
const MULTIPLY = "*";
const SUBTRACT = "-";
const ADD = "+";
const EQUALS = "=";
const DECIMAL = ".";
const AC = "AC";
const C = "C";
const buttonsArr = [
  {
    id: "zero",
    value: 0,
    className: "gray-btn"
  },
  {
    id: "one",
    value: 1,
    className: "gray-btn"
  },
  {
    id: "two",
    value: 2,
    className: "gray-btn"
  },
  {
    id: "three",
    value: 3,
    className: "gray-btn"
  },
  {
    id: "four",
    value: 4,
    className: "gray-btn"
  },
  {
    id: "five",
    value: 5,
    className: "gray-btn"
  },
  {
    id: "six",
    value: 6,
    className: "gray-btn"
  },
  {
    id: "seven",
    value: 7,
    className: "gray-btn"
  },
  {
    id: "eight",
    value: 8,
    className: "gray-btn"
  },
  {
    id: "nine",
    value: 9,
    className: "gray-btn"
  },
  {
    id: "divide",
    value: DIVIDE,
    className: "light-gray-btn"
  },
  {
    id: "multiply",
    value: MULTIPLY,
    className: "light-gray-btn"
  },
  {
    id: "subtract",
    value: SUBTRACT,
    className: "light-gray-btn"
  },
  {
    id: "add",
    value: ADD,
    className: "light-gray-btn"
  },
  {
    id: "equals",
    value: EQUALS,
    className: "light-gray-btn"
  },
  {
    id: "decimal",
    value: DECIMAL,
    className: "gray-btn"
  },
  {
    id: "clear",
    value: AC,
    className: "red-btn"
  },
  {
    id: "c",
    value: C,
    className: "red-btn"
  }
];

const Display = ({ formulaText, displayText }) => {
  return (
    <div id="display-container">
      <p id="display">{displayText}</p>
      <p id="formula">{formulaText}</p>
    </div>
  );
};

const App = ({ buttonsArr }) => {
  const [formulaText, setFormulaText] = useState("0");
  const [displayText, setDisplayText] = useState("0");
  const [answer, setAnswer] = useState(null);
  const [evaluated, setEvaluated] = useState(false);

  const setText = (displayTxt, formulaTxt) => {
    setDisplayText(displayTxt);
    setFormulaText(formulaTxt);
  };

  const handleNumbers = (num) => {
    if (evaluated) {
      setText(num, num);
      setEvaluated(false);
    } else if (formulaText === "0") {
      setText(num, num);
    } else if (/[0-9.-]$/.test(formulaText)) {
      setText(displayText + num, formulaText + num);
    } else {
      setText(num, formulaText + num);
    }
  };

  const handleDecimal = () => {
    if (evaluated) {
      setText(DECIMAL, DECIMAL);
      setEvaluated(false);
    } else if (displayText.indexOf(DECIMAL) === -1) {
      setText(displayText + DECIMAL, formulaText + DECIMAL);
    }
  };

  const handleOperators = (operator) => {
    if (evaluated) {
      setText(operator, answer + operator);
      setEvaluated(false);
    } else if (formulaText === "0") {
      setText(operator, formulaText + operator);
    } else if (/[/*+-]{2}$/.test(formulaText)) {
      setText(operator, formulaText.slice(0, -2) + operator);
    } else if (/[/*+-]{1}$/.test(formulaText)) {
      if (operator === SUBTRACT) {
        setText(operator, formulaText + operator);
      } else {
        setText(operator, formulaText.slice(0, -1) + operator);
      }
    } else {
      setText(operator, formulaText + operator);
    }
  };

  const handleC = () => {
    if (evaluated) {
      setText("0", "0");
      setEvaluated(false);
    } else if (formulaText.length <= 1) {
      setText("0", "0");
    } else if (displayText.length > 1) {
      setText(displayText.slice(0, -1), formulaText.slice(0, -1));
    } else {
      setText(formulaText.slice(-2, -1), formulaText.slice(0, -1));
    }
  };

  const handleEquals = () => {
    const total = evaluate(formulaText);
    setAnswer(total);
    setText(total, formulaText + EQUALS + total);
    setEvaluated(true);
  };

  const handleClick = (e) => {
    const value = e.target.value;

    switch (value) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        handleNumbers(value);
        break;
      case DIVIDE:
      case MULTIPLY:
      case SUBTRACT:
      case ADD:
        handleOperators(value);
        break;
      case DECIMAL:
        handleDecimal();
        break;
      case EQUALS:
        handleEquals();
        break;
      case AC:
        setText("0", "0");
        setEvaluated(false);
        break;
      case C:
        handleC();
    }
  };

  const buttons = buttonsArr.map((btn, i) => {
    return (
      <button
        key={i}
        id={btn.id}
        className={btn.className}
        value={btn.value}
        onClick={handleClick}
      >
        {btn.value}
      </button>
    );
  });
  return (
    <div id="main">
      <Display formulaText={formulaText} displayText={displayText} />
      {buttons}
    </div>
  );
};

ReactDOM.render(
  <App buttonsArr={buttonsArr} />,
  document.getElementById("root")
);
