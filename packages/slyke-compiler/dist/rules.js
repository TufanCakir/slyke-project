// packages/slyke-compiler/src/rules.js

module.exports = [{
  name: "<echo>",
  regex: /<echo\s+message="([^"]*)"\s*\/>/g,
  handler: match => `
          compiledElements.push(
            h('div', { className: 'slyke-echo' }, ${JSON.stringify(match[1])})
          );
        `
}, {
  name: "<button>",
  regex: /<button\s+text="([^"]*)"(?:\s+onClick="([^"]*)")?\s*\/>/g,
  handler: match => `
          compiledElements.push(
            h('button', {
              onClick: () => { ${match[2] || ""} },
              className: 'slyke-button'
            }, ${JSON.stringify(match[1])})
          );
        `
}, {
  name: `message "..."`,
  regex: /message\s+"([^"]*)"/g,
  handler: match => `
          compiledElements.push(
            h('p', { className: 'slyke-message' }, ${JSON.stringify(match[1])})
          );
        `
}, {
  name: `popUp "..."`,
  regex: /popUp\s+"([^"]*)"/g,
  handler: match => `
          compiledElements.push(
            h('div', { className: 'slyke-popUp-statement' }, ${JSON.stringify(match[1])})
          );
        `
}, {
  name: "<Variable>",
  regex: /<Variable\s+name="([^"]*)"\s+value="([^"]*)"\s*\/>/g,
  handler: match => {
    const varName = match[1];
    const varValue = match[2];
    // NEU: Variable wird als Signal definiert
    return `slykeVariables[${JSON.stringify(varName)}] = signal(${JSON.stringify(varValue)});`;
  }
}, {
  name: "<Display>",
  regex: /<Display\s+value="\{([^}]+)\}"\s*\/>/g,
  handler: match => {
    const varToDisplay = match[1];
    // NEU: Zugriff auf den Wert des Signals über .value
    return `
            compiledElements.push(
              h('span', { className: 'slyke-display' }, slykeVariables[${JSON.stringify(varToDisplay)}].value)
            );
          `;
  }
}, {
  name: "<Box>",
  regex: /<Box\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-box' })
          );
        `
}, {
  name: "<ReactiveState>",
  regex: /<ReactiveState\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-reactiveState' })
          );
        `
}, {
  name: "<Else>",
  regex: /<Else\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-else' })
          );
        `
}, {
  name: "<Component>",
  regex: /<Component\s*\/>/g,
  handler: () => `
    function MyCustomComponent() {
      const count = signal(0);
      return h('div', { className: 'slyke-component' },
        h('p', null, "Ich bin eine Komponente."),
        h('button', { onClick: () => count.value++ }, "Zähle: ", count)
      );
    }
    compiledElements.push(h(MyCustomComponent));
  `
}, {
  name: "<Effect>",
  regex: /<Effect\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-effect' })
          );
        `
}, {
  name: "<Bind>",
  regex: /<Bind\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-bind' })
          );
        `
}, {
  name: "<Route>",
  regex: /<Route\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-route' })
          );
        `
}, {
  name: "<Router>",
  regex: /<Router\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-router' })
          );
        `
}, {
  name: "<List>",
  regex: /<List\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-list' })
          );
        `
}, {
  name: "<Item>",
  regex: /<Item\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-item' })
          );
        `
}, {
  name: "<EventSource>",
  regex: /<EventSource\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-eventSource' })
          );
        `
}, {
  name: "<Dialog>",
  regex: /<Dialog\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-dialog' })
          );
        `
}, {
  name: "<Modal>",
  regex: /<Modal\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-modal' })
          );
        `
}, {
  name: "<Storefront>",
  regex: /<Storefront\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-storefront' })
          );
        `
}, {
  name: "<ProductCard>",
  regex: /<ProductCard\s*\/>/g,
  handler: () => `
          compiledElements.push(
            h('div', { className: 'slyke-productCard' })
          );
        `
}];