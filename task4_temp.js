

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

// Conversion functions
function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

function fahrenheitToCelsius(f) {
  return ((f - 32) * 5) / 9;
}

function celsiusToKelvin(c) {
  return c + 273.15;
}

function kelvinToCelsius(k) {
  return k - 273.15;
}

function convert(value, from, to) {
  // Normalize to Celsius first
  let celsius;
  if (from === "C") celsius = value;
  else if (from === "F") celsius = fahrenheitToCelsius(value);
  else celsius = kelvinToCelsius(value); // Kelvin

  // Convert from Celsius to target
  if (to === "C") return celsius;
  if (to === "F") return celsiusToFahrenheit(celsius);
  return celsius + 273.15; // Kelvin
}

async function main() {
  console.log("====================================");
  console.log("     TEMPERATURE CONVERTER - JS     ");
  console.log("====================================");

  while (true) {
    console.log("\nUnits: C (Celsius) | F (Fahrenheit) | K (Kelvin)");

    const input = await ask("Enter temperature (e.g. 100 C): ");
    const parts = input.trim().toUpperCase().split(" ");

    if (parts.length !== 2) {
      console.log("❌ Invalid format. Example: 100 C");
      continue;
    }

    const value = parseFloat(parts[0]);
    const from = parts[1];

    if (isNaN(value)) {
      console.log("❌ Invalid number.");
      continue;
    }

    if (!["C", "F", "K"].includes(from)) {
      console.log("❌ Unknown unit. Use C, F, or K.");
      continue;
    }

    // Show all conversions
    const units = ["C", "F", "K"];
    const labels = { C: "Celsius", F: "Fahrenheit", K: "Kelvin" };

    console.log(`\n🌡️  ${value}° ${labels[from]} =`);
    units
      .filter((u) => u !== from)
      .forEach((to) => {
        const result = convert(value, from, to);
        console.log(`   ➜  ${result.toFixed(2)}° ${labels[to]}`);
      });

    const again = await ask("\nConvert another? (y/n): ");
    if (again.toLowerCase() !== "y") {
      console.log("\n✅ Done!");
      rl.close();
      break;
    }
  }
}

main();
