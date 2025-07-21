// packages/slyke-compiler/src/index.js

console.log("[Slyke-Compiler] Modul wird geladen...");

const rules = require("./rules");

function log(...args) {
  console.log("[Slyke-Compiler]", ...args);
}

function getPreactHeader() {
  return `import { h, render } from 'preact';
import { signal } from '@preact/signals';

let appRootElement = null;
function getAppRoot() {
  if (!appRootElement) {
    appRootElement = document.getElementById('app');
    if (!appRootElement) {
      console.error("❌ Kein #app-Element im HTML gefunden.");
      return null;
    }
  }
  return appRootElement;
}

const compiledElements = [];
const slykeVariables = {};
`;
}

function buildPreactAppBody() {
  return `
const SlykeApp = () => h('div', null, compiledElements);

const rootElement = getAppRoot();
if (rootElement) {
  render(h(SlykeApp, null), rootElement);
}

console.log("✅ Slyke-Komponenten erfolgreich gerendert.");
`;
}

module.exports = {
  compile: function (slykeCode) {
    log(
      "Empfangener Slyke-Code zur Kompilierung:\n---START---\n" +
        slykeCode +
        "\n---ENDE---"
    );

    let generatedJs = getPreactHeader();

    for (const { name, regex, handler } of rules) {
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(slykeCode)) !== null) {
        log(`🔎 Gefunden (${name}):`, match.slice(1).join(", "));
        generatedJs += handler(match);
      }
    }

    // Beispiel für alte MyButton-Komponente
    if (slykeCode.includes("component MyButton:")) {
      log("🧩 MyButton-Komponente erkannt.");
      generatedJs += `
function MyButtonOldComponent() {
  return h('button', {
    onClick: () => { alert("Button Clicked!"); },
    className: 'slyke-button-old'
  }, "Click Me (old component)");
}
compiledElements.push(h(MyButtonOldComponent));
`;
    }

    generatedJs += buildPreactAppBody();
    return generatedJs;
  },
};
