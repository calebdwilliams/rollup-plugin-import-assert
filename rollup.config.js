import { importAssertions } from 'acorn-import-assertions';
import plugin from './dist/import-assert';

export default {
    input: 'public/index.js',
    output: {
        format: 'esm',
        file: 'lib/index.js'
    },
    acornInjectPlugins: [importAssertions],
    plugins: [
        plugin()
    ]
}
