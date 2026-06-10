

function pyramidPattern(n) {
  console.log("\n📐 Pyramid Pattern:");
  for (let i = 1; i <= n; i++) {
    let spaces = " ".repeat(n - i);
    let nums = "";
    for (let j = 1; j <= i; j++) nums += j + " ";
    console.log(spaces + nums);
  }
}

function invertedPyramid(n) {
  console.log("\n🔻 Inverted Pyramid Pattern:");
  for (let i = n; i >= 1; i--) {
    let spaces = " ".repeat(n - i);
    let nums = "";
    for (let j = 1; j <= i; j++) nums += j + " ";
    console.log(spaces + nums);
  }
}

function diamondPattern(n) {
  console.log("\n💎 Diamond Pattern:");
  for (let i = 1; i <= n; i++) {
    let spaces = " ".repeat(n - i);
    let stars = "* ".repeat(i);
    console.log(spaces + stars);
  }
  for (let i = n - 1; i >= 1; i--) {
    let spaces = " ".repeat(n - i);
    let stars = "* ".repeat(i);
    console.log(spaces + stars);
  }
}

function pascalTriangle(n) {
  console.log("\n🔺 Pascal's Triangle:");
  let row = [1];
  for (let i = 0; i < n; i++) {
    let spaces = " ".repeat(n - i);
    console.log(spaces + row.join("  "));
    let nextRow = [1];
    for (let j = 0; j < row.length - 1; j++) {
      nextRow.push(row[j] + row[j + 1]);
    }
    nextRow.push(1);
    row = nextRow;
  }
}


const SIZE = 5;
console.log("====================================");
console.log("   NUMBER PATTERN GENERATOR - JS    ");
console.log("====================================");

pyramidPattern(SIZE);
invertedPyramid(SIZE);
diamondPattern(SIZE);
pascalTriangle(SIZE);

console.log("\n✅ All patterns generated successfully!");
