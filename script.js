const form = document.querySelector("#converter-form");
const input = document.querySelector("#temperature-input");
const fromUnit = document.querySelector("#from-unit");
const errorMessage = document.querySelector("#error-message");
const resultValue = document.querySelector("#result-value");
const resultDescription = document.querySelector("#result-description");
const unitButtons = document.querySelectorAll(".unit-button");

let toUnit = "C";

const unitNames = {
  C: "Celsius",
  F: "Fahrenheit",
  K: "Kelvin"
};

function toCelsius(value, unit) {
  if (unit === "F") return (value - 32) * 5 / 9;
  if (unit === "K") return value - 273.15;
  return value;
}

function fromCelsius(value, unit) {
  if (unit === "F") return (value * 9 / 5) + 32;
  if (unit === "K") return value + 273.15;
  return value;
}

function formatNumber(value) {
  return Number(value.toFixed(2)).toLocaleString("en-US", {
    maximumFractionDigits: 2
  });
}

function validateTemperature(value, unit) {
  if (value.trim() === "") return "Please enter a temperature value.";
  const number = Number(value);
  if (!Number.isFinite(number)) return "Please enter a valid number.";
  if (unit === "K" && number < 0) return "Kelvin cannot be below 0 K.";
  if (unit === "C" && number < -273.15) return "Celsius cannot be below −273.15 °C.";
  if (unit === "F" && number < -459.67) return "Fahrenheit cannot be below −459.67 °F.";
  return "";
}

function updateSelectedButton() {
  unitButtons.forEach((button) => {
    const selected = button.dataset.unit === toUnit;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function convertTemperature() {
  const rawValue = input.value;
  const error = validateTemperature(rawValue, fromUnit.value);

  if (error) {
    errorMessage.textContent = error;
    resultValue.innerHTML = `— <small>${toUnit === "K" ? "K" : `°${toUnit}`}</small>`;
    resultDescription.textContent = "Check your input to see the conversion.";
    return;
  }

  errorMessage.textContent = "";
  const originalValue = Number(rawValue);
  const celsiusValue = toCelsius(originalValue, fromUnit.value);
  const convertedValue = fromCelsius(celsiusValue, toUnit);
  const outputUnit = toUnit === "K" ? "K" : `°${toUnit}`;

  resultValue.innerHTML = `${formatNumber(convertedValue)} <small>${outputUnit}</small>`;
  resultDescription.textContent = `${formatNumber(originalValue)}°${fromUnit.value === "K" ? "K" : fromUnit.value} equals ${formatNumber(convertedValue)} ${unitNames[toUnit]}.`;
  console.log("Temperature conversion:", {
    input: originalValue,
    from: unitNames[fromUnit.value],
    output: convertedValue,
    to: unitNames[toUnit]
  });
}

unitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toUnit = button.dataset.unit;
    updateSelectedButton();
    if (input.value.trim() !== "") convertTemperature();
  });
});

input.addEventListener("input", () => {
  if (input.value.trim() !== "") convertTemperature();
  else {
    errorMessage.textContent = "";
    resultValue.innerHTML = `— <small>${toUnit === "K" ? "K" : `°${toUnit}`}</small>`;
    resultDescription.textContent = "Your converted temperature will appear here.";
  }
});

fromUnit.addEventListener("change", () => {
  if (input.value.trim() !== "") convertTemperature();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  convertTemperature();
});

updateSelectedButton();
