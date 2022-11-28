import * as path from 'path';

module.exports = {
    entry: './dist/index.android.js',
    // devtool: 'inline-source-map',
    target: 'node',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dxc-agent.android.min.js',
        library: {
            //name: 'Interruptor',
            type: 'commonjs'
        }
    },
};