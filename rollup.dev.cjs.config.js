const { importAssertions } = require('acorn-import-assertions');
const { importAssertionPlugin } = require('./dist/import-assert.cjs');

module.exports = {
    input: 'public/index.js',
    output: {
        format: 'esm',
        dir: 'lib'
    },
    acornInjectPlugins: [importAssertions],
    plugins: [
        importAssertionPlugin()
    ]
}
