// packages/slyke-loader/src/index.js

const path = require("path");
// Importiere den Slyke-Compiler aus dem lokalen Workspace
const slykeCompiler = require("slyke-compiler"); // Dies funktioniert, wenn pnpm install korrekt ausgeführt wurde

module.exports = function (source) {
  // `this` ist der Loader Context von Webpack
  // `source` enthält den Inhalt der .sk-Datei, die kompiliert wird.

  console.log("🛠️ Slyke-Loader wird ausgeführt für:", this.resourcePath);
  console.log("📄 Eingehender Slyke-Code:\n" + source); // Hier 'source' direkt loggen

  try {
    // Rufe die Kompilierungsfunktion deines Slyke-Compilers auf
    const compiledJsCode = slykeCompiler.compile(source);

    // Gebe den generierten JavaScript-Code zurück, den Webpack weiterverarbeiten soll.
    return compiledJsCode;
  } catch (error) {
    // Fehlerbehandlung
    console.error("❌ Slyke Kompilierungsfehler:", error);
    // Webpack's Methode, um einen Fehler auszugeben
    this.emitError(new Error(`Error compiling Slyke file ${this.resourcePath}: ${error.message}`));
    // Gib fehlerhaften Code zurück, der im Browser einen Fehler loggt
    return `console.error("❌ Slyke Kompilierung fehlgeschlagen für ${this.resourcePath}:", ${JSON.stringify(error.message)});`;
  }
};