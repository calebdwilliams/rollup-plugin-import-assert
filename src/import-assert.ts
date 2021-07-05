import path from 'path';
import { Plugin } from 'rollup';
import convert from 'string-to-template-literal';

type Assertion = { type: 'css'|'json' };
const assertionMap = new Map<string, Assertion>();
const filePattern = /\.(js|ts|jsx|tsx)$/;

export default function importAssertionPlugin(): Plugin {
  return {
    name: 'rollup-plugin-import-assert',
    transform(data: string, id: string) {
      /** If the file is a JS-like file, continue */
      if (filePattern.exec(id)) {
        /** Get the AST data, must be using acorn-import-assertions for this to work */
        const ast = this.parse(data);

        // @ts-ignore because acorn-import-assertions
        ast.body
          /** We only care about ImportDeclarations */
          .filter(node => node.type === 'ImportDeclaration')
          /** Gather information about the import assertion and save for future reference */
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

      /** If an import assertion exists for the file, parse it differently */
      if (assertion) {
        const { type } = assertion;
        let code = data;

        if (type === 'css') {
          /** Parse files asserted as CSS to use constructible stylesheets */
          code = `const sheet = new CSSStyleSheet();sheet.replaceSync(${convert(data)});export default sheet;`;
        } else if (type === 'json') {
          /** Parse files asserted as JSON as a JS object */
          code = `export default JSON.parse(${data})`;
        }

        /** Return the new data and map it back to the original source file */
        return { code, mappings: id };
      }

      /** If none of the above exists, just continue as normal */
      return data;
    },
  };
}
