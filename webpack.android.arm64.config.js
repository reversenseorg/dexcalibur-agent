const path = require('path');

module.exports = {
    entry: './dist/index.android.arm64.js',
    // devtool: 'inline-source-map',
    target: 'node',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dxc-agent.android.arm64.min.js',
        library: {
            //name: 'Interruptor',
            type: 'commonjs'
        }
    },
};