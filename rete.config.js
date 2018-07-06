import sass from 'rollup-plugin-sass';

export default {
    input: 'src/index.js',
    name: 'ProfilerPlugin',
    plugins: [
        sass({
            insert: true
        })
    ]
}