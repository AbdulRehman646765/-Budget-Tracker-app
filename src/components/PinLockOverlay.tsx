"use client";

import React, { useState, useEffect, useRef } from "react";

// ----------------------------------------------------------------
// Mode:
//   "unlock"   → show when app is locked (enter PIN to open)
//   "setup"    → show when user clicks "Set PIN" in settings
//   "disable"  → show when user clicks to disable PIN (confirm current PIN)
// ----------------------------------------------------------------
interface PinLockOverlayProps {
  show: boolean;
  mode: "unlock" | "setup" | "disable";
  onUnlock: (pin: string) => boolean; // unlock mode
  onSetPin?: (pin: string) => void; // setup mode
  onDisablePin?: (pin: string) => boolean; // disable mode
  onCancel?: () => void; // cancel setup/disable
}

const MAX_ATTEMPTS = 3; // غلط tries کی حد
const LOCKOUT_SECONDS = 30; // lockout duration

export const PinLockOverlay: React.FC<PinLockOverlayProps> = ({
  show,
  mode,
  onUnlock,
  onSetPin,
  onDisablePin,
  onCancel,
}) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");

  // Lockout state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when overlay opens/mode changes
  useEffect(() => {
    if (show) {
      setPin("");
      setConfirmPin("");
      setStep("enter");
      setShake(false);
      setMessage("");
      // Do NOT reset failedAttempts/lockedOut on show — keep lockout persistent
    }
  }, [show, mode]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockedOut && lockoutRemaining > 0) {
      timerRef.current = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setLockedOut(false);
            setFailedAttempts(0);
            setMessage("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockedOut]);

  // ---- Helpers ----
  const triggerShake = (msg: string) => {
    setShake(true);
    setMessage(msg);
    setPin("");
    setConfirmPin("");
    setTimeout(() => setShake(false), 500);
  };

  const handleFailedAttempt = () => {
    const next = failedAttempts + 1;
    setFailedAttempts(next);

    if (next >= MAX_ATTEMPTS) {
      // Start lockout
      setLockedOut(true);
      setLockoutRemaining(LOCKOUT_SECONDS);
      setPin("");
      setMessage("");
    } else {
      const remaining = MAX_ATTEMPTS - next;
      triggerShake(
        `Incorrect PIN. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      );
    }
  };

  const pressPin = (digit: string) => {
    if (lockedOut) return;

    const current = step === "confirm" ? confirmPin : pin;
    const setter = step === "confirm" ? setConfirmPin : setPin;

    if (current.length < 4) {
      const newVal = current + digit;
      setter(newVal);

      if (newVal.length === 4) {
        setTimeout(() => handleComplete(newVal), 150);
      }
    }
  };

  const clearLast = () => {
    if (lockedOut) return;
    if (step === "confirm") {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
    setMessage("");
  };

  const handleComplete = (enteredPin: string) => {
    if (mode === "unlock") {
      const ok = onUnlock(enteredPin);
      if (!ok) {
        handleFailedAttempt();
      } else {
        // Reset on success
        setFailedAttempts(0);
      }
    } else if (mode === "setup") {
      if (step === "enter") {
        setStep("confirm");
        setMessage("");
        setConfirmPin("");
      } else {
        if (enteredPin === pin) {
          onSetPin && onSetPin(pin);
        } else {
          triggerShake("PINs don't match. Try again.");
          setStep("enter");
          setPin("");
        }
      }
    } else if (mode === "disable") {
      const ok = onDisablePin && onDisablePin(enteredPin);
      if (!ok) {
        handleFailedAttempt();
      }
    }
  };

  // Keyboard Support
  useEffect(() => {
    if (!show || lockedOut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys
      if (/^[0-9]$/.test(e.key)) {
        pressPin(e.key);
        return;
      }

      // Numpad numbers
      if (e.code.startsWith("Numpad")) {
        const num = e.code.replace("Numpad", "");
        if (/^[0-9]$/.test(num)) {
          pressPin(num);
          return;
        }
      }

      // Backspace/Delete
      if (e.key === "Backspace" || e.key === "Delete") {
        clearLast();
        return;
      }

      // Escape (only setup/disable)
      if (
        e.key === "Escape" &&
        (mode === "setup" || mode === "disable") &&
        onCancel
      ) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, lockedOut, pin, confirmPin, step, mode, onCancel]);

  if (!show) return null;

  // ---- Dynamic UI labels ----
  const currentDots = step === "confirm" ? confirmPin : pin;

  const title = lockedOut
    ? "Too Many Attempts"
    : mode === "unlock"
      ? "App Locked"
      : mode === "setup"
        ? step === "enter"
          ? "Set New PIN"
          : "Confirm PIN"
        : "Disable PIN Lock";

  const subtitle = lockedOut
    ? `Try again in ${lockoutRemaining}s`
    : mode === "unlock"
      ? "Enter your PIN to continue"
      : mode === "setup"
        ? step === "enter"
          ? "Enter a new 4-digit PIN"
          : "Re-enter your PIN to confirm"
        : "Enter your current PIN to disable lock";

  const iconClass = lockedOut
    ? "fa-solid fa-ban"
    : mode === "unlock"
      ? "fa-solid fa-lock"
      : mode === "setup"
        ? "fa-solid fa-lock-open"
        : "fa-solid fa-unlock-keyhole";

  // Attempt indicators (only for unlock & disable)
  const showAttemptDots =
    (mode === "unlock" || mode === "disable") && !lockedOut;

  return (
    <div className={`pin-overlay show`} id="pinOverlay">
      <div
        className={`pin-box ${shake ? "pin-shake" : ""} ${lockedOut ? "pin-lockout" : ""}`}
      >
        <div className={`pin-icon ${lockedOut ? "pin-icon-danger" : ""}`}>
          <i className={iconClass}></i>
        </div>
        <h3 id="pinBoxTitle">{title}</h3>
        <p id="pinBoxSub">{subtitle}</p>

        {/* Lockout countdown ring */}
        {lockedOut && (
          <div className="pin-lockout-ring">
            <svg viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" className="ring-bg" />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="ring-progress"
                style={{
                  strokeDasharray: `${2 * Math.PI * 28}`,
                  strokeDashoffset: `${2 * Math.PI * 28 * (1 - lockoutRemaining / LOCKOUT_SECONDS)}`,
                }}
              />
            </svg>
            <span className="ring-label">{lockoutRemaining}</span>
          </div>
        )}

        {/* Error / Info Message */}
        {message && !lockedOut && <p className="pin-message">{message}</p>}

        {/* Attempt indicator dots (●●●) */}
        {showAttemptDots && failedAttempts > 0 && (
          <div className="pin-attempts">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <span
                key={i}
                className={`attempt-dot ${i < failedAttempts ? "used" : ""}`}
              />
            ))}
          </div>
        )}

        {/* PIN dots */}
        {!lockedOut && (
          <div className="pin-dots" id="pinDots">
            <span
              className={`dot ${currentDots.length >= 1 ? "filled" : ""}`}
            ></span>
            <span
              className={`dot ${currentDots.length >= 2 ? "filled" : ""}`}
            ></span>
            <span
              className={`dot ${currentDots.length >= 3 ? "filled" : ""}`}
            ></span>
            <span
              className={`dot ${currentDots.length >= 4 ? "filled" : ""}`}
            ></span>
          </div>
        )}

        {/* Keypad */}
        <div className={`pin-keypad ${lockedOut ? "pin-keypad-disabled" : ""}`}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button key={d} onClick={() => pressPin(d)} disabled={lockedOut}>
              {d}
            </button>
          ))}
          <button
            className="pin-action"
            onClick={clearLast}
            disabled={lockedOut}
          >
            <i className="fa-solid fa-delete-left"></i>
          </button>
          <button onClick={() => pressPin("0")} disabled={lockedOut}>
            0
          </button>
          {(mode === "setup" || mode === "disable") && onCancel ? (
            <button
              className="pin-action pin-cancel"
              onClick={onCancel}
              disabled={lockedOut}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          ) : (
            <button className="pin-action pin-disabled" disabled>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          )}
        </div>

        {/* Step indicator for setup */}
        {mode === "setup" && !lockedOut && (
          <div className="pin-step-indicator">
            <span
              className={`pin-step-dot ${step === "enter" ? "active" : "done"}`}
            ></span>
            <span
              className={`pin-step-dot ${step === "confirm" ? "active" : ""}`}
            ></span>
          </div>
        )}
      </div>
    </div>
  );
};
