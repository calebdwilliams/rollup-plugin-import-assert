import path from 'path';
import { Plugin } from 'rollup';

type Assertion = { type: 'css'|'json' };
const assertionMap = new Map<string, Assertion>();

export default function importAssertionPlugin(): Plugin {
  return {
    name: 'import-assertion-plugin',
    transform(data: string, id: string) {
      if (/\.(js|ts|jsx|tsx)$/.exec(id)) {
        const ast = this.parse(data);

        // @ts-ignore
        ast.body
          .filter(node => node.type === 'ImportDeclaration')
          .forEach(node => {
            const [ assertion ] = node.assertions as any;
            if (assertion) {
              const assert = {
                type: assertion.value.value
              };
              const importPath = path.resolve(path.dirname(id), node.source.value);
              assertionMap.set(importPath, assert);
            }
          });
        return;
      }

      const assertion = assertionMap.get(id);

      if (assertion) {
        const { type } = assertion;
        let code = data;
        if (type === 'css') {
          code = `const sheet = new CSSStyleSheet();sheet.replaceSync(\`${data}\`);export default sheet;`;
        } else if (type === 'json') {
          code = `export default JSON.parse(${data})`;
        }
        return { code, mappings: id };
      }
      return data;
    },
  };
}
