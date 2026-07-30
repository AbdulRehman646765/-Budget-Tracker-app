"use client";

import React, { useState, useEffect, useCallback } from "react";

interface QuickCalculatorModalProps {
  show: boolean;
  onClose: () => void;
}

export const QuickCalculatorModal: React.FC<QuickCalculatorModalProps> = ({
  show,
  onClose,
}) => {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay((prev) => (prev === "0" ? digit : prev + digit));
      }
    },
    [waitingForOperand]
  );

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay((prev) => prev + ".");
    }
  }, [display, waitingForOperand]);

  const performOperation = useCallback(
    (nextOp: string) => {
      const inputValue = parseFloat(display);

      if (prevValue === null) {
        setPrevValue(inputValue);
      } else if (operation) {
        const currentValue = prevValue || 0;
        let result = currentValue;

        switch (operation) {
          case "+":
            result = currentValue + inputValue;
            break;
          case "-":
            result = currentValue - inputValue;
            break;
          case "*":
            result = currentValue * inputValue;
            break;
          case "/":
            result = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
          case "%":
            result = (currentValue * inputValue) / 100;
            break;
          default:
            break;
        }

        const formattedResult = Number.isInteger(result)
          ? String(result)
          : String(parseFloat(result.toFixed(6)));

        setPrevValue(result);
        setDisplay(formattedResult);
      }

      setWaitingForOperand(true);
      setOperation(nextOp);
    },
    [display, prevValue, operation]
  );

  const handleEquals = useCallback(() => {
    if (operation === null || prevValue === null) return;
    performOperation("=");
    setOperation(null);
    setPrevValue(null);
  }, [operation, prevValue, performOperation]);

  const toggleSign = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(String(-value));
    }
  };

  const deleteLastChar = () => {
    if (waitingForOperand) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
      } else if (e.key === ".") {
        inputDot();
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        performOperation(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") {
        deleteLastChar();
      } else if (e.key === "Escape") {
        clearAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, inputDigit, inputDot, performOperation, handleEquals]);

  if (!show) return null;

  return (
    <div
      className="popup-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content calc-modal-box">
        <div className="popup-header">
          <h3>
            <i className="fa-solid fa-calculator"></i> Quick Calculator
          </h3>
          <button className="popup-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="calc-display-wrap">
          <div className="calc-history">
            {prevValue !== null && operation ? `${prevValue} ${operation}` : ""}
          </div>
          <div className="calc-main-display">{display}</div>
        </div>

        <div className="calc-keypad">
          <button className="calc-btn calc-action" onClick={clearAll}>
            C
          </button>
          <button className="calc-btn calc-action" onClick={deleteLastChar}>
            <i className="fa-solid fa-backspace"></i>
          </button>
          <button className="calc-btn calc-action" onClick={toggleSign}>
            ±
          </button>
          <button
            className={`calc-btn calc-op ${operation === "/" ? "active" : ""}`}
            onClick={() => performOperation("/")}
          >
            ÷
          </button>

          <button className="calc-btn" onClick={() => inputDigit("7")}>
            7
          </button>
          <button className="calc-btn" onClick={() => inputDigit("8")}>
            8
          </button>
          <button className="calc-btn" onClick={() => inputDigit("9")}>
            9
          </button>
          <button
            className={`calc-btn calc-op ${operation === "*" ? "active" : ""}`}
            onClick={() => performOperation("*")}
          >
            ×
          </button>

          <button className="calc-btn" onClick={() => inputDigit("4")}>
            4
          </button>
          <button className="calc-btn" onClick={() => inputDigit("5")}>
            5
          </button>
          <button className="calc-btn" onClick={() => inputDigit("6")}>
            6
          </button>
          <button
            className={`calc-btn calc-op ${operation === "-" ? "active" : ""}`}
            onClick={() => performOperation("-")}
          >
            −
          </button>

          <button className="calc-btn" onClick={() => inputDigit("1")}>
            1
          </button>
          <button className="calc-btn" onClick={() => inputDigit("2")}>
            2
          </button>
          <button className="calc-btn" onClick={() => inputDigit("3")}>
            3
          </button>
          <button
            className={`calc-btn calc-op ${operation === "+" ? "active" : ""}`}
            onClick={() => performOperation("+")}
          >
            +
          </button>

          <button className="calc-btn" onClick={() => inputDigit("0")}>
            0
          </button>
          <button className="calc-btn" onClick={inputDot}>
            .
          </button>
          <button
            className={`calc-btn calc-op ${operation === "%" ? "active" : ""}`}
            onClick={() => performOperation("%")}
          >
            %
          </button>
          <button className="calc-btn calc-equals" onClick={handleEquals}>
            =
          </button>
        </div>
      </div>
    </div>
  );
};
