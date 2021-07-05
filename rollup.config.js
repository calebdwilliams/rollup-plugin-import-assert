import { importAssertions } from 'acorn-import-assertions';
import plugin from './plugins/plugin';

export default {
    input: 'src/index.js',
    output: {
        format: 'esm',
        file: 'lib/index.js'
    },
    acornInjectPlugins: [importAssertions],
    plugins: [
        plugin()
    ]
}