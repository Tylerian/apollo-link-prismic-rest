import manifest from "./package.json";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import resolver from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";

export default {
    input: "src/index.ts",
    output: [
        { file: manifest.main, format: "cjs" },
        { file: manifest.module, format: "es" }
    ],
    plugins: [
        /* tells rollup howto find in node_modules */
        resolver(),
        /* converts commonjs modules to es modules */
        commonjs({
            include: "node_modules/**",
            namedExports: {
            }
        }),
        /* transpiles ts files to plain javascript */
        typescript(),
        /* replace strings before bundling */
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
}