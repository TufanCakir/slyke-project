// packages/slyke-compiler/src/index.js

console.log("[Slyke-Compiler] Modul wird geladen...");

const rules = require("./rules");

/** 📦 Utility: Logging */
function log(...args) {
  console.log("[Slyke-Compiler]", ...args);
}

/** 📦 Liefert die Preact-Header-Definitionen + Signale */
function getPreactHeader() {
  return `import { h, render } from 'preact';
import { signal, effect } from '@preact/signals';

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

// 📦 compile global verfügbar machen
function compile(code) {
  const localElements = [];
  const rules = window.__slykeRules || [];
  for (const { regex, handler } of rules) {
    if (!regex || typeof regex.exec !== "function") continue;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(code)) !== null) {
      try {
        const result = handler(match);
        eval(\`(function(){\${result}})()\`);
      } catch (e) {
        console.error("⚠️ Fehler beim dynamischen Kompilieren:", e);
      }
    }
  }
  return localElements;
}

window.compile = compile;
`;
}

/** 📦 Fügt den App-Wrapper hinzu */
function buildPreactAppBody() {
  return `
const SlykeApp = () =>
  h('div', null, compiledElements.map(el => (typeof el === 'function' ? el() : el)));

const rootElement = getAppRoot();
if (rootElement) {
  render(h(SlykeApp, null), rootElement);
}

console.log("✅ Slyke-Komponenten erfolgreich gerendert.");
`;
}

/** 🔧 Hauptkompilierungsfunktion */
module.exports = {
  compile(slykeCode) {
    log(
      "Empfangener Slyke-Code zur Kompilierung:\n---START---\n" +
        slykeCode +
        "\n---ENDE---"
    );

    let generatedJs = getPreactHeader();

    for (const rule of rules) {
      const { name, regex, handler } = rule;

      if (!regex || typeof regex.exec !== "function") {
        log(`⚠️ Regel "${name}" hat keine gültige Regex. Übersprungen.`);
        continue;
      }

      regex.lastIndex = 0;
      let match;

      while ((match = regex.exec(slykeCode)) !== null) {
        log(`🔎 Regel angewendet (${name}):`, match.slice(1).join(", "));
        try {
          generatedJs += handler(match);
        } catch (err) {
          console.error(`❌ Fehler im Handler für <${name}>:`, err);
        }
      }
    }

    // 📎 Beispiel für experimentelle Komponenten (optional)
    if (slykeCode.includes("component MyButton:")) {
      log("🧩 MyButton-Komponente erkannt.");
      generatedJs += `
function MyButtonOldComponent() {
  return h('button', {
    onClick: () => alert("Button Clicked!"),
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
