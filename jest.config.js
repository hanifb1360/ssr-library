module.exports = {
    testEnvironment: "node", // Ensures tests run in a Node.js environment
    roots: ["<rootDir>/test"], // Specifies the test folder
    moduleFileExtensions: ["js", "json"],
    collectCoverage: true, // Enables test coverage reports
    coverageDirectory: "coverage", // Directory for coverage reports
    testMatch: ["**/*.test.js"], // Matches all files ending with .test.js
    verbose: true, // Display individual test results
  };