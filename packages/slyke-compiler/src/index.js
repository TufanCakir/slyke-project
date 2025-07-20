// packages/slyke-compiler/src/index.js

console.log("[Slyke-Compiler] Modul wird geladen..."); // Geändert, da es das Compiler-Modul ist

function log(...args) {
  // Zentralisiertes Logging
  console.log("[Slyke-Compiler]", ...args);
}

// Hilfsfunktionen für Preact-Header und App-Body (bleiben hier)
function getPreactHeader() {
  return `import { h, render } from 'preact';
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
const slykeVariables = {}; // Variablen-Speicher hier
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

    // Definiere die Regeln hier im Compiler
    const rules = [
      {
        name: "<echo>",
        regex: /<echo\s+message="([^"]*)"\s*\/>/g,
        handler: (match) => `
          compiledElements.push(
            h('div', { className: 'slyke-echo' }, ${JSON.stringify(match[1])})
          );
        `,
      },
      // <template> wurde entfernt, falls du es nicht mehr willst
      {
        name: "<button>",
        regex: /<button\s+text="([^"]*)"(?:\s+onClick="([^"]*)")?\s*\/>/g,
        handler: (match) => `
          compiledElements.push(
            h('button', {
              onClick: () => { ${match[2] || ""} },
              className: 'slyke-button'
            }, ${JSON.stringify(match[1])})
          );
        `,
      },
      {
        name: `message "..."`,
        regex: /message\s+"([^"]*)"/g,
        handler: (match) => `
          compiledElements.push(
            h('p', { className: 'slyke-message' }, ${JSON.stringify(match[1])})
          );
        `,
      },

      // --- NEUE TAGS HIER BEGINNEN ---
      {
        name: "<Variable>",
        regex: /<Variable\s+name="([^"]*)"\s+value="([^"]*)"\s*\/>/g,
        handler: (match) => {
          const varName = match[1];
          const varValue = match[2];
          return `slykeVariables[${JSON.stringify(varName)}] = ${JSON.stringify(varValue)};\n`;
        },
      },
      {
        name: "<Display>",
        regex: /<Display\s+value="\{([^}]+)\}"\s*\/>/g,
        handler: (match) => {
          const varToDisplay = match[1];
          return `
            compiledElements.push(
              h('span', { className: 'slyke-display' }, slykeVariables[${JSON.stringify(varToDisplay)}])
            );
          `;
        },
      },
      {
        name: "<Box>",
        regex: /<Box\s*\/>/g,
        handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-box' })
          );
        `,
      },
      // --- NEUE TAGS HIER ENDEN ---
    ];

    for (const { name, regex, handler } of rules) {
      let match;
      regex.lastIndex = 0; // Wichtig: lastIndex zurücksetzen
      while ((match = regex.exec(slykeCode)) !== null) {
        log(`🔎 Gefunden (${name}):`, match.slice(1).join(", "));
        generatedJs += handler(match);
      }
    }

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
