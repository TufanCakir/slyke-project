// packages/slyke-loader/slyke-loader.js
const path = require("path");

// Korrigierter Pfad zum Slyke Compiler
const slykeCompiler = require(
  path.resolve(
    __dirname,
    "../slyke-compiler/src/index.js" // <--- HIER MUSS DER PFAD KORRIGIERT WERDEN
  )
);

module.exports = function (source) {
  console.log("Compiling Slyke file:", this.resourcePath);

  try {
    const compiledJsCode = slykeCompiler.compile(source);
    return compiledJsCode;
  } catch (error) {
    console.error("Slyke Compilation Error:", error);
    this.emitError(
      new Error(
        `Error compiling Slyke file ${this.resourcePath}: ${error.message}`
      )
    );
    return `console.error("Slyke compilation failed for ${
      this.resourcePath
    }:", ${JSON.stringify(error.message)});`;
  }
};
