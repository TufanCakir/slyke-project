# Slyke Compiler

Der Slyke Compiler ist das Herzstück der Slyke-Sprache. Er wandelt Slyke-Quellcode (`.sk`) in optimiertes JavaScript um, das die Preact Virtual DOM Bibliothek nutzt, um performante und reaktive Weboberflächen zu erzeugen.

## Slyke Sprachreferenz

### Einführung in die Syntax

Slyke ist eine deklarative Sprache, die es Ihnen ermöglicht, UI-Komponenten auf intuitive Weise zu beschreiben. Kommentare beginnen mit `#`.

---

### `<echo>` Tag

Der `<echo>`-Tag wird verwendet, um einfache Textnachrichten auf der Seite anzuzeigen. Er ist ideal für Debugging-Ausgaben oder schnelle Informationsanzeigen.

#### Syntax

```slyke
<echo message="Ihre Nachricht hier" />
```

Ja, das ist absolut entscheidend! Ohne eine gute Dokumentation in deinem README.md (oder idealerweise in einer dedizierten docs/-Sektion deines Projekts), werden andere Entwickler nicht verstehen, wie sie Slyke verwenden können.

Dein aktueller src/index.sk-Code ist ein hervorragender Ausgangspunkt, um die Nutzung deiner Sprache zu demonstrieren.

Wo solltest du das dokumentieren?
Haupt-README.md (im Root des Monorepos): Hier sollte eine High-Level-Übersicht über Slyke stehen, was es ist, warum man es nutzen sollte, wie man das Monorepo klont und die Beispiel-App startet.

packages/slyke-compiler/README.md: Hier sollte die detaillierte Syntax und Semantik der Slyke-Sprache dokumentiert werden – also genau das, was die einzelnen Tags und Statements bewirken. Dies ist der Ort für die Erklärungen der message-Anweisung, <echo>-Tags, <button>-Tags und zukünftiger Sprachelemente.

packages/slyke-loader/README.md: Hier beschreibst du, wie man den Webpack-Loader konfiguriert (dein webpack.config.js).

examples/basic-app/README.md: Eine kurze Beschreibung dieser speziellen Beispielanwendung.

Für die von dir gezeigten Slyke-Tags gehört die Dokumentation also primär in die packages/slyke-compiler/README.md.

Beispiel für die Dokumentation eines Slyke-Tags (<button>)
Hier ist ein Vorschlag, wie du die einzelnen Sprachelemente strukturieren könntest. Wiederhole dies für jeden deiner Tags/Statements.

packages/slyke-compiler/README.md

Markdown

# Slyke Compiler

Der Slyke Compiler ist das Herzstück der Slyke-Sprache. Er wandelt Slyke-Quellcode (`.sk`) in optimiertes JavaScript um, das die Preact Virtual DOM Bibliothek nutzt, um performante und reaktive Weboberflächen zu erzeugen.

## Slyke Sprachreferenz

### Einführung in die Syntax

Slyke ist eine deklarative Sprache, die es Ihnen ermöglicht, UI-Komponenten auf intuitive Weise zu beschreiben. Kommentare beginnen mit `#`.

---

### `<echo>` Tag

Der `<echo>`-Tag wird verwendet, um einfache Textnachrichten auf der Seite anzuzeigen. Er ist ideal für Debugging-Ausgaben oder schnelle Informationsanzeigen.

#### Syntax

```slyke
<echo message="Ihre Nachricht hier" />
Attribute
message (String, erforderlich): Der Text, der im <echo>-Element angezeigt werden soll.

Beispiel
Code-Snippet

# Eine einfache Echo-Nachricht
<echo message="Hallo Welt aus Slyke!" />

# Eine weitere Nachricht
<echo message="Der Compiler funktioniert!" />
Generierter Output (vereinfacht)

import { h } from 'preact';
// ...
h('div', { className: 'slyke-echo' }, "Ihre Nachricht hier");
// ...

/* Ihre custom.css */
.slyke-echo {
    background-color: lightblue;
    padding: 20px;
    font-weight: bold;
}

<button> Tag
Der <button>-Tag erzeugt einen interaktiven Button mit vordefinierten Styles und einem optionalen Klick-Handler.

Syntax
Code-Snippet

<button text="Text des Buttons" onClick="JavaScript-Code hier" />

text (String, erforderlich): Der Text, der auf dem Button angezeigt wird.

onClick (String, optional): Ein JavaScript-Ausdruck, der ausgeführt wird, wenn der Button geklickt wird. Beachten Sie: Dies wird direkt in den onclick-Handler des generierten JavaScripts eingefügt. Seien Sie vorsichtig mit der Eingabe von unsicherem Code.

Beispiel
Code-Snippet

# Ein Button, der eine Meldung anzeigt
<button text="Klick mich!" onClick="alert('Button geklickt!');" />

# Ein Button für die Konsole
<button text="Logge in Konsole" onClick="console.log('Button wurde geloggt');" />

Generierter Output (vereinfacht)
Wird zu einem button-Element mit dem angegebenen Text, dem onclick-Handler und der slyke-button CSS-Klasse:

JavaScript

import { h } from 'preact';
// ...
h('button', { className: 'slyke-button', onClick: () => { alert('Button geklickt!'); } }, "Klick mich!");
// ...

Styling
Der <button>-Tag erhält standardmäßig die CSS-Klasse slyke-button. Sie können diesen Button über CSS in Ihrer Anwendung anpassen:

CSS

/* Ihre custom.css */
.slyke-button {
    background-color: purple;
    color: yellow;
    border-radius: 10px;
}
.slyke-button:hover {
    opacity: 0.8;
}

message Statement
Das message-Statement wird verwendet, um einfache Textabsätze zu erzeugen, typischerweise für Überschriften oder Einleitungen.

Syntax
Code-Snippet

message "Ihre Nachricht hier"
Beispiel
Code-Snippet

message "Willkommen in Ihrer Slyke-Anwendung!"

Generierter Output (vereinfacht)
Wird zu einem p-Element mit dem angegebenen Text und der slyke-message CSS-Klasse:

JavaScript

import { h } from 'preact';
// ...
h('p', { className: 'slyke-message' }, "Ihre Nachricht hier");
// ...

Styling
Das message-Statement erhält standardmäßig die CSS-Klasse slyke-message. Sie können diesen Text über CSS in Ihrer Anwendung anpassen:

CSS

/* Ihre custom.css */
.slyke-message {
    color: navy;
    font-size: 1.5em;
    font-family: 'Georgia', serif;
}
```
