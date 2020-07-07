// import babel from 'rollup-plugin-babel' 
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import svgr from '@svgr/rollup'
import image from '@rollup/plugin-image';
// import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;
export default {
    input: 'src/index.js',
    output: [
        {
            dir: "dist/cjs",
            format: 'cjs',
            sourcemap: false,
            // sourcemap: !production,
            exports: "named",
        },
        {
            dir: "dist/es",
            format: 'es',
            sourcemap: false,
            // sourcemap: !production,
            exports: "named",
        }
    ],
    external: [
        "antd",
        "antd-mobile",
        "react",
        "prop-types",
        "react-dom",
        "react-router-dom",
        "jquery",
        "qnn-form",
        "qnn-table",
        "pull-person",
        "pull-person-mobile",
        "qnn-tree",
        "moment",
        "immutable",
        "react-date-range",
        "ifanrx-react-ueditor"
        // "@ant-design"
    ],
    moduleContext: (id) => {
        return "window"
    },
    plugins: [
        resolve(),
        external(),
        image(),
        url(),
        svgr(),
        postcss({
            modules: true,
            plugins: [
                require("postcss-preset-env")({
                    autoprefixer: {
                        flexbox: "no-2009"
                    },
                    browsers: [
                        ">0.15%",
                        "last 4 versions",
                        "Firefox ESR",
                        "not ie < 9", // React doesn't support IE8 anyway
                        "last 3 iOS versions",
                        "iOS 7",
                        "iOS >= 7"
                    ],
                    stage: 3
                })
            ]
        }),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            // babelHelpers:production ? "bundled" :"runtime",
            babelHelpers:"bundled",
            presets: [
                [
                    "@babel/preset-env",
                    {
                        modules: false,
                        corejs: 3,
                        useBuiltIns: 'usage',
                        targets: {
                            browsers: [
                                "last 2 versions",
                                "iOS >= 7",
                                "Android >= 5"
                            ]
                        }
                    }
                ],
                "@babel/preset-react"
            ],
            plugins: [
                // require.resolve("@babel/plugin-external-helpers"),
                // require.resolve("@babel/plugin-syntax-import-meta"),

                [
                    "babel-plugin-named-asset-import",
                    {
                        loaderMap: {
                            svg: {
                                ReactComponent:
                                    "@svgr/webpack?-svgo![path]"
                            }
                        }
                    }
                ],
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-syntax-dynamic-import",
                [
                    "@babel/plugin-proposal-class-properties",
                    {
                        "loose": true
                    }
                ],
                "react-loadable/babel",
                "babel-plugin-transform-object-assign",
                [
                    "@babel/plugin-proposal-decorators",
                    { legacy: true }
                ],
                "@babel/plugin-proposal-optional-chaining",
                [
                    "import",
                    {
                        libraryName: "antd",
                        libraryDirectory: "es",
                        style: "css"
                    },
                    "ant"
                ],
                [
                    "import",
                    {
                        libraryName: "antd-mobile",
                        libraryDirectory: "es",
                        style: "css"
                    },
                    "antd-mobile"
                ]
            ]
        }),
        commonjs(),
        //加上后报错 需要排查
        // terser()
        // production && terser() // minify, but only in production 
    ]
}
