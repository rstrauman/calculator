/* ------------- DOM ELEMENTS ------------- */
const NUMBERBUTTONS   = document.querySelectorAll('.numbers');       // All number buttons
const OPERATORBUTTONS = document.querySelectorAll('.operators');     // All operator buttons
const OUTPUT          = document.getElementById('userOutput');       // Main display
const EQUATION        = document.getElementById('userInput');        // Equation line (optional)

/* ------------- STATE ------------- */
let calculated      = false;    // Whether a calculation just happened
let currentInput    = '';       // Current number being entered
let previousInput   = '';       // Unused but reserved for future use
let operator        = '';       // Unused but reserved for future use
let fullExpression  = '';       // Full math expression as string

/* ------------- INIT ------------- */
OUTPUT.value         = '0';
EQUATION.textContent = '';

/* ------------- HELPER FUNCTIONS ------------- */
// Update the equation line to show previous + operator + current
function refreshEquation() {
  EQUATION.textContent = `${previousInput} ${operator} ${currentInput}`.trim();
}

/* ------------- NUMBER BUTTONS ------------- */
NUMBERBUTTONS.forEach(btn => {
  btn.addEventListener('click', () => {
    // Reset state if previous calc was completed or starting from 0
    if (OUTPUT.value === '0' || calculated) {
      OUTPUT.value        = '';
      EQUATION.textContent = '';
      currentInput        = '';
      fullExpression      = '';
      calculated          = false;
    }

    currentInput   += btn.textContent;
    fullExpression += btn.textContent;
    OUTPUT.value    = fullExpression;
  });
});

/* ------------- OPERATOR BUTTONS ------------- */
/* ------------- OPERATOR BUTTONS ------------- */
OPERATORBUTTONS.forEach(btn => {
  btn.addEventListener('click', () => {
    const symbol = btn.textContent;

    /* ---------- 1. User pressed "=" ---------- */
    if (symbol === '=') {
      calculate();          // evaluate fullExpression
      calculated = true;    // mark that a result is now on screen
      return;
    }

    /* ---------- 2. User pressed an operator AFTER "=" ---------- */
    if (calculated) {
      /*
        We just showed a result and the user now wants to keep
        that result as the first operand of a new calculation.
      */
      calculated     = false;          // exit the post-equals state
      fullExpression = currentInput;   // currentInput already holds the result
      // (previousInput / operator variables are optional; omit if unused)
    }

    /* ---------- 3. Prevent two operators in a row ---------- */
    if (currentInput === '') return;

    /* ---------- 4. Build the new expression ---------- */
    fullExpression += symbol; // append chosen operator
    currentInput    = '';     // start capturing the next number
    OUTPUT.value    = fullExpression;
    refreshEquation();
  });
});


/* ------------- CALCULATE FUNCTION ------------- */
function calculate() {
  try {
    // Replace visual symbols with JS operators
    const safeExpr = fullExpression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    const result = eval(safeExpr); // Note: eval is used here for simplicity

    OUTPUT.value         = result;
    EQUATION.textContent = fullExpression;

    // Prepare for next chain calc
    currentInput    = result.toString();
    fullExpression  = currentInput;
  } catch (e) {
    OUTPUT.value = 'Error';
  }
}

/* ------------- CLEAR / AC BUTTON ------------- */
document.getElementById('ac').addEventListener('click', () => {
  calculated      = false;
  currentInput    = '';
  fullExpression  = '';
  OUTPUT.value    = '0';
  EQUATION.textContent = '';
});

/* ------------- PLUS/MINUS TOGGLE ------------- */
document.getElementById('plusMinus').addEventListener('click', () => {
  if (currentInput !== '' && currentInput !== '0') {
    // Flip the sign of the current number
    currentInput = (parseFloat(currentInput) * -1).toString();

    // Replace the last number in the expression visually and logically
    fullExpression = fullExpression.replace(/(\(?-?\d+\.?\d*\)?)(?!.*\d)/, `(${currentInput})`);

    OUTPUT.value = fullExpression;
    refreshEquation();
  }
});

/* ------------- PERCENT BUTTON ------------- */
document.getElementById('percent').addEventListener('click', () => {
  if (currentInput !== '' && currentInput !== '0') {
    const originalValue = currentInput;
    const percentValue  = (parseFloat(originalValue) / 100).toString();

    // Apply math logic
    currentInput   = percentValue;
    fullExpression = fullExpression.replace(/(\(?-?\d+\.?\d*\)?)(?!.*\d)/, currentInput);

    // Visual display: show percent symbol
    const visualExpression = fullExpression.replace(currentInput, `${originalValue}%`);
    OUTPUT.value = visualExpression;

    refreshEquation();
  }
});

/* ------------- DECIMAL BUTTON ------------- */
document.getElementById('decimal').addEventListener('click', () => {
  if (calculated) {
    // Start new decimal input after result
    currentInput    = '0.';
    fullExpression  = '0.';
    calculated      = false;
    OUTPUT.value    = fullExpression;
    refreshEquation();
    return;
  }

  // Only allow one decimal point in a number
  if (!currentInput.includes('.')) {
    if (currentInput === '') {
      currentInput   = '0.';
      fullExpression += '0.';
    } else {
      currentInput   += '.';
      fullExpression += '.';
    }

    OUTPUT.value = fullExpression;
    refreshEquation();
  }
});








