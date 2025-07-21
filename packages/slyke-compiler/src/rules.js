// packages/slyke-compiler/src/rules.js

module.exports = [
  // <echo message="..."/>
  {
    name: "<echo>",
    regex: /<echo\s+message="([^"]*)"\s*\/>/g,
    handler: (match) => {
      const rawMessage = match[1];

      // Ersetze {variable} durch ${slykeVariables["variable"].value}
      const processed = rawMessage.replace(
        /\{([^}]+)\}/g,
        (_, varName) => `\${slykeVariables["${varName}"].value}`
      );

      return `
      compiledElements.push(() =>
        h('div', { className: 'slyke-echo' }, \`${processed}\`)
      );
    `;
    },
  },

  // <button text="..." onClick="..."/>
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

  // message "..."
  {
    name: `message "..."`,
    regex: /message\s+"([^"]*)"/g,
    handler: (match) => {
      const rawMessage = match[1];
      const processed = rawMessage.replace(
        /\{([^}]+)\}/g,
        (_, v) => `\${slykeVariables["${v}"].value}`
      );

      return `
      compiledElements.push(() =>
        h('p', { className: 'slyke-message' }, \`${processed}\`)
      );
    `;
    },
  },

  // input
  {
    name: "<input>",
    regex: /<input\s+name="([^"]+)"\s*\/>/g,
    handler: (match) => {
      const varName = match[1];
      return `
      compiledElements.push(() =>
        h('input', {
          className: 'slyke-input',
          value: slykeVariables[${JSON.stringify(varName)}].value,
          onInput: e => slykeVariables[${JSON.stringify(varName)}].value = e.target.value
        })
      );
    `;
    },
  },

  // popUp "..."
  {
    name: `<popUp> "..."`,
    regex: /popUp\s+"([^"]*)"(?:\s+when="([^"]+)")?/g,
    handler: (match) => {
      const rawMessage = match[1];
      const condition = match[2];

      // Ersetze {var} → ${slykeVariables["var"].value}
      const messageWithSignals = rawMessage.replace(
        /\{([^}]+)\}/g,
        (_, v) => `\${slykeVariables["${v}"].value}`
      );

      if (condition) {
        return `
        compiledElements.push(() =>
          slykeVariables[${JSON.stringify(condition)}].value
            ? h('div', { className: 'slyke-popUp-statement' }, \`${messageWithSignals}\`)
            : null
        );
      `;
      } else {
        return `
        compiledElements.push(() =>
          h('div', { className: 'slyke-popUp-statement' }, \`${messageWithSignals}\`)
        );
      `;
      }
    },
  },

  // <Variable name="..." value="..."/>
  {
    name: "<Variable>",
    regex: /<Variable\s+name="([^"]*)"\s+value="([^"]*)"\s*\/>/g,
    handler: (match) => {
      const varName = match[1];
      const varValue = match[2];
      return `slykeVariables[${JSON.stringify(varName)}] = signal(${JSON.stringify(varValue)});`;
    },
  },

  // <Display value="{...}"/>
  {
    name: "<Display>",
    regex: /<Display\s+value="\{([^}]+)\}"\s*\/>/g,
    handler: (match) => {
      const varToDisplay = match[1];
      return `
      compiledElements.push(() =>
        h('span', { className: 'slyke-display' }, slykeVariables[${JSON.stringify(varToDisplay)}])
      );
    `;
    },
  },
  {
    name: "<Show>",
    regex: /<Show\s+when="([^"]+)"\s*\/>/g,
    handler: (match) => {
      const condition = match[1];
      return `
      compiledElements.push(() =>
        slykeVariables[${JSON.stringify(condition)}].value
          ? h('div', { className: 'slyke-show' }, "✔ Sichtbar: " + ${JSON.stringify(condition)})
          : null
      );
    `;
    },
  },
  // <Box/>
  {
    name: "<Box>",
    regex: /<Box\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-box' })
      );
    `,
  },

  // <ReactiveState/>
  {
    name: "<ReactiveState>",
    regex: /<ReactiveState\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-reactiveState' })
      );
    `,
  },

  // <Else/>
  {
    name: "<Else>",
    regex: /<Else\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-else' })
      );
    `,
  },

  // <Component/>
  {
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
    `,
  },

  // <Effect/>
  {
    name: "<Effect>",
    regex: /<Effect\s+watch="([^"]+)"\s+do="([^"]+)"\s*\/>/g,
    handler: (match) => {
      const watchedVar = match[1];
      const effectBody = match[2];
      return `
      effect(() => {
        const _ = slykeVariables[${JSON.stringify(watchedVar)}].value;
        ${effectBody}
      });
    `;
    },
  },

  // <Bind/>
  {
    name: "<Bind>",
    regex: /<Bind\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-bind' })
      );
    `,
  },

  // <Route/>
  {
    name: "<Route>",
    regex: /<Route\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-route' })
      );
    `,
  },

  // <Router/>
  {
    name: "<Router>",
    regex: /<Router\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-router' })
      );
    `,
  },

  // <List/>
  {
    name: "<List>",
    regex: /<List\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-list' })
      );
    `,
  },

  // <Item/>
  {
    name: "<Item>",
    regex: /<Item\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-item' })
      );
    `,
  },

  // <EventSource/>
  {
    name: "<EventSource>",
    regex: /<EventSource\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-eventSource' })
      );
    `,
  },

  // <Dialog/>
  {
    name: "<Dialog>",
    regex: /<Dialog\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-dialog' })
      );
    `,
  },

  // <Modal/>
  {
    name: "<Modal>",
    regex: /<Modal\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-modal' })
      );
    `,
  },

  // <Storefront/>
  {
    name: "<Storefront>",
    regex: /<Storefront\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-storefront' })
      );
    `,
  },

  // <ProductCard/>
  {
    name: "<ProductCard>",
    regex: /<ProductCard\s*\/>/g,
    handler: () => `
      compiledElements.push(
        h('div', { className: 'slyke-productCard' })
      );
    `,
  },
];
