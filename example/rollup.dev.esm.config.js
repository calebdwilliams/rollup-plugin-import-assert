import { importAssertions } from 'acorn-import-assertions';
import { importAssertionsPlugin } from '../dist/import-assert.js';

export default {
    input: 'example/src/index.js',
    output: {
        format: 'esm',
        dir: 'example/out'
    },
    acornInjectPlugins: [importAssertions],
    plugins: [
        importAssertionsPlugin()
    ]
}
