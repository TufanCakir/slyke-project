const { compile } = require("./packages/slyke-compiler/src/index");

const tests = [
  {
    name: "Einfaches Echo",
    code: `<echo message="Hallo Welt!" />`,
    expectIncludes: `compiledElements.push(h('div', { className: 'slyke-echo' }, "Hallo Welt!"));`,
  },
  {
    name: "Variable & Display",
    code: `
      <Variable name="user" value="Tufan" />
      <Display value="{user}" />
    `,
    expectIncludes: [
      `slykeVariables["user"] = signal("Tufan");`,
      `compiledElements.push(h('span', { className: 'slyke-display' }, slykeVariables["user"].value));`,
    ],
  },
  {
    name: "Box mit Kind",
    code: `<Box><echo message="Im Container!" /></Box>`,
    expectIncludes: `compiledElements.push(h('div', { className: 'slyke-box' }, compiledElements.push(h('div', { className: 'slyke-echo' }, "Im Container!")));`,
  },
  {
    name: "Message Statement",
    code: `message "Willkommen bei Slyke!"`,
    expectIncludes: `compiledElements.push(h('p', { className: 'slyke-message' }, "Willkommen bei Slyke!"));`,
  },
  {
    name: "popUp Statement",
    code: `popUp "Dies ist ein PopUp!"`,
    expectIncludes: `compiledElements.push(h('div', { className: 'slyke-popUp-statement' }, "Dies ist ein PopUp!"));`,
  },
  {
    name: "ListDisplay mit Items",
    code: `<Variable name="items" value="[1, 2, 3]" />
           <ListDisplay items="items" />`,
    expectIncludes: `slykeVariables["items"] = signal([1, 2, 3]);`,
  },
];

let passed = 0;
let failed = 0;

tests.forEach(({ name, code, expectIncludes }) => {
  try {
    const output = compile(code);
    const checks = Array.isArray(expectIncludes)
      ? expectIncludes
      : [expectIncludes];

    const allMatched = checks.every((str) => output.includes(str));

    if (allMatched) {
      console.log(`✅ Test bestanden: ${name}`);
      passed++;
    } else {
      console.log(`❌ Test fehlgeschlagen: ${name}`);
      checks.forEach((str) => {
        if (!output.includes(str)) {
          console.log(`   Erwartet, aber nicht gefunden: ${str}`);
        }
      });
      failed++;
    }
  } catch (e) {
    console.log(`❌ Testfehler bei "${name}":`, e.message);
    failed++;
  }
});

console.log(`\n🔍 ${passed} Tests bestanden, ${failed} fehlgeschlagen.`);
if (failed === 0) console.log("🎉 Alle Tests erfolgreich!");
