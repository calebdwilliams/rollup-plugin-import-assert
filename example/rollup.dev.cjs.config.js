const { importAssertions } = require('acorn-import-assertions');
const { importAssertionsPlugin } = require('../dist/import-assert.cjs');

module.exports = {
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
