// packages/slyke-compiler/src/index.js

module.exports = {
  compile: function (slykeCode) {
    let generatedJs = `
      import { h, render } from 'preact';

      let appRootElement = null;
      function getAppRoot() {
        if (!appRootElement) {
          appRootElement = document.getElementById('app');
          if (!appRootElement) {
            console.error("Element with ID 'app' not found. Ensure <div id='app'> is in your HTML.");
            return null;
          }
        }
        return appRootElement;
      }

      const compiledElements = [];
    `;

    let match;

    // --- Kompilierung des <echo> Tags ---
    const echoRegex = /<echo\s+message="([^"]*)"\s*\/>/g;
    while ((match = echoRegex.exec(slykeCode)) !== null) {
      const message = match[1];
      generatedJs += `
        compiledElements.push(
          h('div', {
            // style: { ... }, <--- DIESES STYLE-OBJEKT ENTFERNEN
            className: 'slyke-echo' // <--- NEU: CSS-Klasse zuweisen
          }, ${JSON.stringify(message)})
        );
      `;
    }

    // --- Kompilierung des <button> Tags ---
    const buttonRegex =
      /<button\s+text="([^"]*)"(?:\s+onClick="([^"]*)")?\s*\/>/g;
    while ((match = buttonRegex.exec(slykeCode)) !== null) {
      const buttonText = match[1];
      const onClickAction = match[2] || "";

      generatedJs += `
        compiledElements.push(
          h('button', {
            onClick: () => { ${onClickAction} },
            // style: { ... }, <--- DIESES STYLE-OBJEKT ENTFERNEN
            className: 'slyke-button' // <--- NEU: CSS-Klasse zuweisen
          }, ${JSON.stringify(buttonText)})
        );
      `;
    }

    // --- Kompilierung des 'message' Statements ---
    const messageStatementRegex = /message\s+"([^"]*)"/g;
    while ((match = messageStatementRegex.exec(slykeCode)) !== null) {
      const msg = match[1];
      generatedJs += `
        compiledElements.push(
          h('p', {
            // style: { ... }, <--- DIESES STYLE-OBJEKT ENTFERNEN
            className: 'slyke-message' // <--- NEU: CSS-Klasse zuweisen
          }, ${JSON.stringify(msg)})
        );
      `;
    }

    // --- Kompilierung des 'component MyButton' ---
    if (slykeCode.includes("component MyButton:")) {
      generatedJs += `
            function MyButtonOldComponent() {
                return h('button', {
                    onClick: () => { alert("Button Clicked!"); },
                    // style: { ... }, <--- DIESES STYLE-OBJEKT ENTFERNEN
                    className: 'slyke-button-old' // <--- NEU: Eigene Klasse für den alten Button
                }, "Click Me (old component)");
            }
            compiledElements.push(h(MyButtonOldComponent));
        `;
    }

    // --- Abschließendes Rendering der gesamten App mit Preact ---
    generatedJs += `
      const SlykeApp = () => {
        return h('div', null, compiledElements);
      };

      const rootElement = getAppRoot();
      if (rootElement) {
        render(h(SlykeApp, null), rootElement);
      }

      console.log("Slyke compilation successful and rendered with Preact!");
    `;

    return generatedJs;
  },
};
