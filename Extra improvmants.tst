Update the existing `QuickCalculatorModal` without changing its UI, styling, layout, or component structure. Only fix and improve the calculator logic.

Requirements:

* Make it behave like a real Windows/Android calculator.
* Pressing `+`, `-`, `×`, `÷`, or `%` multiple times in a row should **not** execute the calculation repeatedly. It should only change the selected operator.
* Example:

  * `10 + + + 5 =` → `15`
  * `10 + - × 5 =` → `50` (only the last operator should be used).
* After pressing an operator, entering a number should replace the display instead of appending to the previous number.
* Chained calculations should work correctly:

  * `10 + 5 × 2 =` → perform calculations the same way a standard calculator does.
* Repeated `=` presses should repeat the last operation like a normal calculator.
* Division by zero should be handled gracefully.
* Decimal calculations should remain accurate.
* Keyboard shortcuts (`0-9`, `.`, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, `Escape`) must continue to work.
* Keep the current React component, props, TypeScript types, and styling unchanged.
* Do not rewrite the UI. Only refactor and fix the calculator logic.
* Ensure there are no React, TypeScript, or ESLint errors.
