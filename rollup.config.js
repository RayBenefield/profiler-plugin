import sass from 'rollup-plugin-sass';

export default {
    input: 'index.js',
    output: {
        file: 'build/index.js',
        name: 'ProfilerPlugin',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        sass({
            insert: true
        })
    ]
}