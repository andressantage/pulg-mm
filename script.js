let isMMtoInches = true; // Estado inicial: mm → pulgadas

// Cambiar la dirección de la conversión
function toggleDirection() {
    isMMtoInches = !isMMtoInches;
    const button = document.getElementById("toggle-direction");
    const mmSection = document.getElementById("mm-section");
    const inchesSection = document.getElementById("inches-section");

    if (isMMtoInches) {
        button.textContent = "mm → pulgadas";
        mmSection.style.display = "block";
        inchesSection.style.display = "none";
        convertFromMM();
    } else {
        button.textContent = "Pulgadas → mm";
        mmSection.style.display = "none";
        inchesSection.style.display = "block";
        convertFromInches();
    }
}

// Convertir de milímetros a pulgadas
function convertFromMM() {
    if (!isMMtoInches) return;

    const mmInput = parseFloat(document.getElementById("mm-input").value);
    const resultElement = document.getElementById("result-value");

    if (isNaN(mmInput) || mmInput < 0) {
        resultElement.textContent = "0";
        return;
    }

    // 1 mm = 0.0393701 pulgadas
    const inches = mmInput * 0.0393701;

    // Separar la parte entera y la fracción
    const wholeInches = Math.floor(inches);
    const fractionalInches = inches - wholeInches;

    // Convertir la fracción a numerador y denominador (usando denominadores comunes: 2, 4, 8, 16, 32)
    const denominators = [2, 4, 8, 16, 32];
    let bestNumerator = 0;
    let bestDenominator = 1;
    let smallestError = Infinity;

    for (let denominator of denominators) {
        const numerator = Math.round(fractionalInches * denominator);
        const fractionValue = numerator / denominator;
        const error = Math.abs(fractionalInches - fractionValue);

        if (error < smallestError) {
            smallestError = error;
            bestNumerator = numerator;
            bestDenominator = denominator;
        }
    }

    // Simplificar la fracción
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(bestNumerator, bestDenominator);
    bestNumerator = bestNumerator / divisor;
    bestDenominator = bestDenominator / divisor;

    // Si el numerador es igual al denominador, sumar 1 a la parte entera
    let finalWholeInches = wholeInches;
    if (bestNumerator === bestDenominator) {
        finalWholeInches += 1;
        bestNumerator = 0;
        bestDenominator = 1;
    }

    // Mostrar el resultado
    let resultText = finalWholeInches > 0 ? finalWholeInches : "";
    if (bestNumerator > 0) {
        resultText += (resultText ? " " : "") + `${bestNumerator}/${bestDenominator}`;
    }
    resultText = resultText || "0";
    resultElement.textContent = `${resultText}"`;
}

// Convertir de pulgadas a milímetros
function convertFromInches() {
    if (isMMtoInches) return;

    const wholeInches = parseFloat(document.getElementById("inches-whole").value) || 0;
    const numerator = parseFloat(document.getElementById("inches-numerator").value) || 0;
    const denominator = parseFloat(document.getElementById("inches-denominator").value) || 1;
    const resultElement = document.getElementById("result-value");

    if (wholeInches < 0 || numerator < 0 || denominator <= 0) {
        resultElement.textContent = "0";
        return;
    }

    // Calcular el valor total en pulgadas
    const totalInches = wholeInches + (numerator / denominator);

    // 1 pulgada = 25.4 mm
    const mm = totalInches * 25.4;

    // Mostrar el resultado redondeado a 2 decimales
    resultElement.textContent = `${mm.toFixed(2)} mm`;
}

// Inicializar la conversión al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    convertFromMM();
});
