// compiler/compiler.js

// WICHTIG: Die Preact-Funktionen müssen importiert werden, da der generierte Code sie nutzen wird.
// Wir fügen dies am Anfang des generierten JavaScripts hinzu.

module.exports = {
  compile: function (slykeCode) {
    let generatedJs = `
      // Importiere Preact-Funktionen, die im generierten Code verwendet werden
      import { h, render } from 'preact';

      // --- Hilfsfunktion zum Anhängen an den App-Root ---
      // Da wir jetzt mit Preact's VDOM arbeiten, rendern wir am Ende einmal
      // einen Baum, statt einzelne Elemente anzuhängen.
      // Diese Funktion wird nicht direkt von den einzelnen Kompilierungsblöcken
      // verwendet, sondern ist ein Konzept, wie man eine 'root'-Komponente erstellt.
      let appRootElement = null; // Wird später initialisiert
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

      // Ein Array, um alle kompilierten VDOM-Elemente zu sammeln,
      // die am Ende gerendert werden sollen.
      const compiledElements = [];
    `;

    let match;

    // --- Kompilierung des <echo> Tags ---
    const echoRegex = /<echo\s+message="([^"]*)"\s*\/>/g;
    while ((match = echoRegex.exec(slykeCode)) !== null) {
      const message = match[1];
      generatedJs += `
        // Erzeuge ein virtuelles Element mit Preact's h()
        compiledElements.push(
          h('div', {
            style: {
              padding: '10px',
              margin: '5px',
              backgroundColor: '#00e1ffff',
              borderRadius: '5px',
              border: '1px solid #b2ebf2',
              fontFamily: 'Inter, sans-serif',
              color: '#000000ff',
              textAlign: 'center'
            }
          }, ${JSON.stringify(message)}) // Textinhalt
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
            onClick: () => { ${onClickAction} }, // onclick-Handler
            style: { // Vordefinierte Stile als JavaScript-Objekt
              padding: '10px 20px',
              margin: '10px auto',
              fontSize: '1em',
              cursor: 'pointer',
              backgroundColor: '#000000ff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'background-color 0.3s ease, transform 0.1s ease',
              display: 'block'
            },
            // Preact erlaubt auch Event-Handler direkt als Funktionen,
            // aber für Hover-Effekte müsste man Klassen toggeln oder CSS verwenden.
            // Für dieses Beispiel lassen wir die komplexen JS onmouseover/out weg
            // und verlassen uns auf statische Stile oder später CSS-Klassen.
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
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.2em',
              fontWeight: 'bold',
              color: 'green',
              textAlign: 'center',
              marginTop: '20px'
            }
          }, ${JSON.stringify(msg)})
        );
      `;
    }

    // --- Kompilierung des 'component MyButton' (wenn du es noch nutzen willst) ---
    // Dies erzeugt jetzt auch ein Preact VDOM-Element
    if (slykeCode.includes("component MyButton:")) {
      generatedJs += `
            // Definition der MyButton Komponente als Preact-Komponente
            function MyButtonOldComponent() {
                return h('button', {
                    onClick: () => { alert("Button Clicked!"); },
                    style: {
                        padding: '10px 20px',
                        margin: '10px',
                        fontSize: '1em',
                        cursor: 'pointer',
                        backgroundColor: '#000000ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        // Transition und Hover-Effekte können hier auch als JS-Objekt rein
                    }
                }, "Click Me (old component)");
            }
            compiledElements.push(h(MyButtonOldComponent)); // Preact-Komponente hinzufügen
        `;
    }

    // --- Abschließendes Rendering der gesamten App mit Preact ---
    generatedJs += `
      // Die Haupt-App-Komponente, die alle kompilierten Elemente enthält
      const SlykeApp = () => {
        return h('div', null, compiledElements); // Sammle alle VDOM-Elemente in einem Container
      };

      // Rendere die gesamte App in das DOM-Element mit der ID 'app'
      const rootElement = getAppRoot();
      if (rootElement) {
        render(h(SlykeApp, null), rootElement);
      }

      console.log("Slyke compilation successful and rendered with Preact!");
    `;

    return generatedJs;
  },
};
