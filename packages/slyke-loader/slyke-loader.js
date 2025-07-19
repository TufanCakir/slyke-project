// loaders/slyke-loader.js
const path = require("path"); // Brauchen wir für path.resolve
const slykeCompiler = require(path.resolve(
  __dirname,
  "../compiler/compiler.js"
));
// Oder, wenn dein Compiler innerhalb des loaders-Ordners liegt (weniger üblich):
// const slykeCompiler = require('./your-compiler-file');

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
