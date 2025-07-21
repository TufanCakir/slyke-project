import rules from "./rules";
import { h } from "preact";
import { signal, effect } from "@preact/signals";

export const compiledElements = [];
export const slykeVariables = {};

export function compile(slykeCode) {
  for (const rule of rules) {
    const { regex, handler } = rule;
    if (!regex || typeof regex.exec !== "function") continue;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(slykeCode)) !== null) {
      try {
        const result = handler(match);
        eval(`(function() { ${result} })()`); // nutzt compiledElements + slykeVariables
      } catch (e) {
        console.error("❌ Kompilierfehler:", e);
      }
    }
  }
  return compiledElements;
}
