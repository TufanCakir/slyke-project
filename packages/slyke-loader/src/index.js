// packages/slyke-loader/src/index.js

// Importiere den Slyke-Compiler aus dem lokalen Workspace
const path = require("path");
const slykeCompiler = require("slyke-compiler"); // <--- HIER IST DIE ÄNDERUNG!
// Angepasster Pfad

module.exports = function (source) {
  // `this` ist der Loader Context von Webpack
  // `source` enthält den Inhalt der .sk-Datei, die kompiliert wird.

  console.log("Compiling Slyke file:", this.resourcePath);

  try {
    // Rufe die Kompilierungsfunktion deines Slyke-Compilers auf
    const compiledJsCode = slykeCompiler.compile(source);

    // Gebe den generierten JavaScript-Code zurück, den Webpack weiterverarbeiten soll.
    return compiledJsCode;
  } catch (error) {
    // Fehlerbehandlung
    console.error("Slyke Compilation Error:", error);
    // Webpack's Methode, um einen Fehler auszugeben
    this.emitError(
      new Error(
        `Error compiling Slyke file ${this.resourcePath}: ${error.message}`
      )
    );
    // Gib fehlerhaften Code zurück, der im Browser einen Fehler loggt
    return `console.error("Slyke compilation failed for ${this.resourcePath}:", ${JSON.stringify(error.message)});`;
  }
};
