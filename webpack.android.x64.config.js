import * as path from 'path';

let config = {
    entry: './dist/index.android.x64.js',
    // devtool: 'inline-source-map',
    target: 'node',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dxc-agent.android.x64.min.js',
        library: {
            //name: 'Interruptor',
            type: 'commonjs'
        }
    },
};
export default config;