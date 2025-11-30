document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const preview = document.getElementById('preview');
    let currentInput = '';
    let operator = '';
    let firstOperand = null;

    const buttons = Array.from(document.querySelectorAll('button'));
    buttons.map(button => {
        button.addEventListener('click', (e) => {
            const value = e.target.innerText;

            if (value === 'C') {
                clear();
            } else if (value === '=') {
                calculate();
            } else {
                handleInput(value);
            }
        });
    });

    function handleInput(value) {
        if (['+', '-', '×', '÷'].includes(value)) {
            if (currentInput) {
                firstOperand = parseFloat(currentInput);
                operator = value;
                currentInput = '';
            }
        } else {
            currentInput += value;
        }
        updateDisplay();
    }

    function calculate() {
        if (firstOperand !== null && operator && currentInput) {
            const secondOperand = parseFloat(currentInput);
            let result;

            switch (operator) {
                case '+':
                    result = firstOperand + secondOperand;
                    break;
                case '-':
                    result = firstOperand - secondOperand;
                    break;
                case '×':
                    result = firstOperand * secondOperand;
                    break;
                case '÷':
                    result = firstOperand / secondOperand;
                    break;
            }

            currentInput = result.toString();
            operator = '';
            firstOperand = null;
            updateDisplay();
        }
    }

    function clear() {
        currentInput = '';
        operator = '';
        firstOperand = null;
        updateDisplay();
    }

    function updateDisplay() {
        display.value = currentInput || '0';
    }

    function updatePreview() {
        const expr = display.value || '';
        if (!expr.trim()) {
            preview.textContent = '';
            return;
        }
        try {
            const result = evaluateExpression(expr);
            preview.textContent = '= ' + result;
        } catch (e) {
            preview.textContent = '...';
        }
    }

    function calculateResult() {
        const expr = display.value || '';
        if (!expr.trim()) return;
        try {
            const result = evaluateExpression(expr);
            // show result and clear preview
            display.value = String(result);
            preview.textContent = '';
        } catch (e) {
            preview.textContent = 'Error';
        }
    }

    function appendToDisplay(char) {
        // convert visible symbols to JS operators where needed
        if (char === '×') char = '*';
        if (char === '÷') char = '/';
        display.value = (display.value || '') + char;
        updatePreview();
    }

    function clearDisplay() {
        display.value = '';
        preview.textContent = '';
    }

    function backspace() {
        display.value = (display.value || '').slice(0, -1);
        updatePreview();
    }

    function sanitizeExpression(expr) {
        // allow digits, operators, parentheses, decimals and spaces
        expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
        // remove any characters not allowed
        if (!/^[0-9+\-*/().\s]+$/.test(expr)) return null;
        return expr;
    }

    function evaluateExpression(expr) {
        const clean = sanitizeExpression(expr);
        if (clean === null) throw new Error('Invalid characters in expression');
        // avoid accidental long-running code by using Function on validated string
        // parentheses, decimals and standard operators are permitted
        // eslint-disable-next-line no-new-func
        return Function('"use strict"; return (' + clean + ')')();
    }

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (!isNaN(key) || ['+', '-', '*', '/', 'Enter', 'Backspace'].includes(key)) {
            if (key === 'Enter') {
                calculateResult();
            } else if (key === 'Backspace') {
                backspace();
            } else {
                handleInput(key === '*' ? '×' : key === '/' ? '÷' : key);
            }
        }
    });
});