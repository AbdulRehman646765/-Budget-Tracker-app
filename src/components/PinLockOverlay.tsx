"use client";

import React, { useState } from "react";

interface PinLockOverlayProps {
  show: boolean;
  onUnlock: (pin: string) => boolean;
}

export const PinLockOverlay: React.FC<PinLockOverlayProps> = ({ show, onUnlock }) => {
  const [pin, setPin] = useState("");

  if (!show) return null;

  const pressPin = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          const success = onUnlock(newPin);
          if (!success) {
            setPin("");
          }
        }, 150);
      }
    }
  };

  const clearPin = () => setPin("");

  const submitPin = () => {
    if (pin.length === 4) {
      const success = onUnlock(pin);
      if (!success) {
        setPin("");
      }
    }
  };

  return (
    <div className={`pin-overlay ${show ? "show" : ""}`} id="pinOverlay">
      <div className="pin-box">
        <div className="pin-icon"><i className="fa-solid fa-lock"></i></div>
        <h3 id="pinBoxTitle">Enter PIN</h3>
        <p id="pinBoxSub">App is locked for your privacy</p>
        <div className="pin-dots" id="pinDots">
          <span className={`dot ${pin.length >= 1 ? "filled" : ""}`}></span>
          <span className={`dot ${pin.length >= 2 ? "filled" : ""}`}></span>
          <span className={`dot ${pin.length >= 3 ? "filled" : ""}`}></span>
          <span className={`dot ${pin.length >= 4 ? "filled" : ""}`}></span>
        </div>
        <div className="pin-keypad">
          <button onClick={() => pressPin("1")}>1</button>
          <button onClick={() => pressPin("2")}>2</button>
          <button onClick={() => pressPin("3")}>3</button>
          <button onClick={() => pressPin("4")}>4</button>
          <button onClick={() => pressPin("5")}>5</button>
          <button onClick={() => pressPin("6")}>6</button>
          <button onClick={() => pressPin("7")}>7</button>
          <button onClick={() => pressPin("8")}>8</button>
          <button onClick={() => pressPin("9")}>9</button>
          <button className="pin-action" onClick={clearPin}><i className="fa-solid fa-rotate-left"></i></button>
          <button onClick={() => pressPin("0")}>0</button>
          <button className="pin-action" onClick={submitPin}><i className="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  );
};
