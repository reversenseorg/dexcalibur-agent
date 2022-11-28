import * as path from 'path';
import * as url from "url";

let config = {
    entry: './dist/index.android.arm64.js',
    // devtool: 'inline-source-map',
    target: 'node',
    mode: 'production',
    output: {
        path: path.resolve(url.fileURLToPath(new URL('.', import.meta.url)), 'dist'),
        filename: 'dxc-agent.android.arm64.min.js',
        library: {
            //name: 'Interruptor',
            type: 'commonjs'
        }
    },
};

export default config;