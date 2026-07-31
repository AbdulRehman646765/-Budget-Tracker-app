"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

export interface CalcHistoryItem {
  id: string;
  expression: string;
  result: string;
}

interface QuickCalculatorModalProps {
  show: boolean;
  onClose: () => void;
}

export const QuickCalculatorModal: React.FC<QuickCalculatorModalProps> = ({
  show,
  onClose,
}) => {
  useScrollLock(show);
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [lastOperand, setLastOperand] = useState<number | null>(null);
  const [lastOperator, setLastOperator] = useState<string | null>(null);
  const [historyText, setHistoryText] = useState("");

  const [historyList, setHistoryList] = useState<CalcHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("budget_calc_history");
      if (saved) {
        setHistoryList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load calculator history", e);
    }
  }, []);

  const addHistoryItem = useCallback((expression: string, result: string) => {
    const newItem: CalcHistoryItem = {
      id: Date.now().toString(),
      expression,
      result,
    };
    setHistoryList((prev) => {
      const updated = [newItem, ...prev].slice(0, 30);
      try {
        localStorage.setItem("budget_calc_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const clearHistory = () => {
    setHistoryList([]);
    try {
      localStorage.removeItem("budget_calc_history");
    } catch (e) {}
  };

  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return "Cannot divide by zero";
    // Avoid floating point precision issues like 0.1 + 0.2 = 0.30000000000000004
    const precisionFixed = parseFloat(num.toPrecision(12));
    return String(precisionFixed);
  };

  const getOpSymbol = (op: string): string => {
    switch (op) {
      case "*":
        return "×";
      case "/":
        return "÷";
      case "-":
        return "−";
      default:
        return op;
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setLastOperand(null);
    setLastOperator(null);
    setHistoryText("");
  };

  const calculate = (a: number, b: number, op: string): number | string => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? "Cannot divide by zero" : a / b;
      case "%":
        return (a * b) / 100;
      default:
        return b;
    }
  };

  const inputDigit = useCallback(
    (digit: string) => {
      if (display === "Cannot divide by zero" || display === "Error") {
        setDisplay(digit);
        setPrevValue(null);
        setOperation(null);
        setWaitingForOperand(false);
        setHistoryText("");
        return;
      }

      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay((prev) => (prev === "0" ? digit : prev.length < 16 ? prev + digit : prev));
      }
    },
    [display, waitingForOperand]
  );

  const inputDot = useCallback(() => {
    if (display === "Cannot divide by zero" || display === "Error") {
      setDisplay("0.");
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      setHistoryText("");
      return;
    }

    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay((prev) => prev + ".");
    }
  }, [display, waitingForOperand]);

  const performOperation = useCallback(
    (nextOp: string) => {
      if (display === "Cannot divide by zero" || display === "Error") return;

      const currentValue = parseFloat(display);

      // If user presses another operator right after an operator, change operator without calculating!
      if (waitingForOperand && operation !== null) {
        setOperation(nextOp);
        setHistoryText(`${formatNumber(prevValue ?? 0)} ${getOpSymbol(nextOp)}`);
        return;
      }

      if (prevValue === null) {
        setPrevValue(currentValue);
        setOperation(nextOp);
        setWaitingForOperand(true);
        setHistoryText(`${formatNumber(currentValue)} ${getOpSymbol(nextOp)}`);
      } else if (operation) {
        const rawResult = calculate(prevValue, currentValue, operation);

        if (typeof rawResult === "string") {
          setDisplay(rawResult);
          setPrevValue(null);
          setOperation(null);
          setWaitingForOperand(true);
          setHistoryText("");
          return;
        }

        const formatted = formatNumber(rawResult);
        addHistoryItem(
          `${formatNumber(prevValue)} ${getOpSymbol(operation)} ${formatNumber(currentValue)}`,
          formatted
        );
        setDisplay(formatted);
        setPrevValue(rawResult);
        setOperation(nextOp);
        setWaitingForOperand(true);
        setHistoryText(`${formatted} ${getOpSymbol(nextOp)}`);
      }
    },
    [display, prevValue, operation, waitingForOperand, addHistoryItem]
  );

  const handleEquals = useCallback(() => {
    if (display === "Cannot divide by zero" || display === "Error") return;

    const currentValue = parseFloat(display);

    if (operation !== null && prevValue !== null) {
      // Perform calculation
      const rawResult = calculate(prevValue, currentValue, operation);

      if (typeof rawResult === "string") {
        setDisplay(rawResult);
        setPrevValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        setHistoryText("");
        return;
      }

      const formatted = formatNumber(rawResult);
      addHistoryItem(
        `${formatNumber(prevValue)} ${getOpSymbol(operation)} ${formatNumber(currentValue)}`,
        formatted
      );
      setDisplay(formatted);
      setHistoryText(
        `${formatNumber(prevValue)} ${getOpSymbol(operation)} ${formatNumber(currentValue)} =`
      );
      setLastOperator(operation);
      setLastOperand(currentValue);
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    } else if (lastOperator !== null && lastOperand !== null) {
      // Repeat last operation on repeated '=' press
      const rawResult = calculate(currentValue, lastOperand, lastOperator);

      if (typeof rawResult === "string") {
        setDisplay(rawResult);
        setPrevValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        setHistoryText("");
        return;
      }

      const formatted = formatNumber(rawResult);
      addHistoryItem(
        `${formatNumber(currentValue)} ${getOpSymbol(lastOperator)} ${formatNumber(lastOperand)}`,
        formatted
      );
      setDisplay(formatted);
      setHistoryText(
        `${formatNumber(currentValue)} ${getOpSymbol(lastOperator)} ${formatNumber(lastOperand)} =`
      );
      setWaitingForOperand(true);
    }
  }, [display, operation, prevValue, lastOperator, lastOperand, addHistoryItem]);

  const toggleSign = () => {
    if (display === "Cannot divide by zero" || display === "Error") return;
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(formatNumber(-value));
    }
  };

  const deleteLastChar = () => {
    if (display === "Cannot divide by zero" || display === "Error") {
      clearAll();
      return;
    }
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
      } else if (e.key === "%") {
        performOperation("%");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") {
        deleteLastChar();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              className={`calc-history-toggle ${showHistory ? "active" : ""}`}
              onClick={() => setShowHistory((prev) => !prev)}
              title="Calculation History"
            >
              <i className="fa-solid fa-clock-rotate-left"></i>
              {historyList.length > 0 && (
                <span className="history-badge">{historyList.length}</span>
              )}
            </button>
            <button className="popup-close" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {showHistory ? (
          <div className="calc-history-panel">
            <div className="calc-history-header">
              <span><i className="fa-solid fa-list-ul"></i> Saved History</span>
              {historyList.length > 0 && (
                <button type="button" className="calc-history-clear-btn" onClick={clearHistory}>
                  <i className="fa-solid fa-trash-can"></i> Clear
                </button>
              )}
            </div>
            {historyList.length === 0 ? (
              <div className="calc-history-empty">
                <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: "24px", marginBottom: "8px", opacity: 0.4 }}></i>
                <p>No calculation history yet</p>
              </div>
            ) : (
              <div className="calc-history-list">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    className="calc-history-item"
                    onClick={() => {
                      setDisplay(item.result);
                      setWaitingForOperand(true);
                      setShowHistory(false);
                    }}
                    title="Click to use this result"
                  >
                    <div className="calc-history-expr">{item.expression} =</div>
                    <div className="calc-history-res">{item.result}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="calc-display-wrap">
              <div className="calc-history">
                {historyText}
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
          </>
        )}
      </div>
    </div>
  );
};
