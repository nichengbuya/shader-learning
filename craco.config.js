module.exports = {
    rules: [
        {
            test: /\.glsl$/,
            exclude: [/node_modules/],
            use: ['@doublewin/glsl-stringify-loader'],
        },
    ],
    // plugins: [
    //     {
    //         plugin: require("webpack-glsl-loader")
    //     },
    //     {
    //         plugin: require("craco-scoped-less")
    //     },
    //     {
    //         plugin: MonacoWebpackPlugin,
    //         options: {
    //             languages: ["python"]
    //         }
    //     }
    // ],
    // webpack: {
    //     configure: (webpackConfig, { env, paths, ...context }) => {
    //         // if (process.env.build_adhoc_component) {
    //         //   paths.appBuild = webpackConfig.output.path = path.resolve(
    //         //     "build_adhoc",
    //         //     process.env.build_adhoc_component
    //         //   );
    //         //   paths.appPublic = path.resolve(
    //         //     "public_adhoc",
    //         //     process.env.build_adhoc_component
    //         //   );
    //         //   webpackConfig.plugins[0].options.template = path.resolve(
    //         //     "public_adhoc",
    //         //     process.env.build_adhoc_component,
    //         //     "index.html"
    //         //   );
    //         // }

    //         if (process.env.enablePWA !== "true")
    //             for (let i = 0; i < webpackConfig.plugins.length; i++) {
    //                 let plugin = webpackConfig.plugins[i];
    //                 if (plugin.constructor.name === "InjectManifest") {
    //                     webpackConfig.plugins.splice(i, 1);
    //                     break;
    //                 }
    //             }
    //         else if (env !== "production" && process.env.enablePWADebug === "true") {
    //             webpackConfig.plugins.push(
    //                 new InjectManifest({
    //                     swSrc: "./src/service-worker.ts",
    //                     swDest: "service-worker.js"
    //                 })
    //             );
    //         }

    //         const PACKAGE_VERSION = process.env.PACKAGE_VERSION || PACKAGE.version;

    //         webpackConfig.plugins.push(
    //             // 加载web worker plugin
    //             new WorkerPlugin(),
    //             new DefinePlugin({
    //                 "process.env.enablePWA": JSON.stringify(process.env.enablePWA),
    //                 "process.env.enablePWADebug": JSON.stringify(
    //                     process.env.enablePWADebug
    //                 ),
    //                 "process.env.VERSION_CODE": JSON.stringify(
    //                     PACKAGE_VERSION !== "null" ?
    //                     `${process.env.PACKAGE_VERSIONPREFIX ||
    //               PACKAGE.versionPrefix} v${process.env.PACKAGE_VERSION ||
    //               PACKAGE.version} build: ${PACKAGE.build}` :
    //                     ""
    //                 ),
    //                 "process.env.build_adhoc_component": JSON.stringify(
    //                     process.env.build_adhoc_component
    //                 ),
    //                 "process.env.REACT_APP_PIN": JSON.stringify(process.env.REACT_APP_PIN),
    //                 "process.env.REACT_APP_Devkit": JSON.stringify(process.env.REACT_APP_Devkit),
    //                 "process.env.ISBAODING": JSON.stringify(process.env.ISBAODING),
    //                 "process.env.REACT_APP_V3D_URL": JSON.stringify(process.env.REACT_APP_V3D_URL),
    //                 "process.env.SPIDR_BASE_URL": JSON.stringify(process.env.SPIDR_BASE_URL),
    //                 "process.env.SOP_EDITOR_URL": JSON.stringify(process.env.SOP_EDITOR_URL),
    //                 "process.env.REACT_APP_CONTROL_PANEL_URL": JSON.stringify(process.env.REACT_APP_CONTROL_PANEL_URL),
    //                 "process.env.REACT_APP_LOG_MANAGER_URL": JSON.stringify(process.env.REACT_APP_LOG_MANAGER_URL),
    //                 "process.env.ENABLE_AZURE_AD": JSON.stringify(process.env.ENABLE_AZURE_AD),
    //                 "process.env.AZURE_AD_URL": JSON.stringify(process.env.AZURE_AD_URL),
                    
    //             }),
    //             new FeatureFlagsPlugin(flagsConfig),
    //             new CleanWebpackPlugin({
    //                 cleanOnceBeforeBuildPatterns: [],
    //                 cleanAfterEveryBuildPatterns: [
    //                     "adhoc/**/*",
    //                     ...(files.Include || []).map(e => "!adhoc/" + e)
    //                 ]
    //             }),
    //             new CopyWebpackPlugin({
    //                 patterns: [{
    //                     from: path.resolve(__dirname, "../../node_modules/monaco-editor/min"),
    //                     to: "monaco-editor/min"
    //                 }]
    //             })
    //         );
    //         return webpackConfig;
    //     }
    // },
    // jest: {
    //     configure: (jestConfig, { env, paths, resolve, rootDir }) => {
    //         const testMatch = jestConfig.testMatch;
    //         if (process.env.test_server_only === "true")
    //             jestConfig.testMatch = [
    //                 "<rootDir>/src/server/**/?(*.)+(spec|test).[jt]s?(x)"
    //             ];
    //         else if (process.env.test_react_only === "true")
    //             testMatch.push("!**/src/server/**/*");
    //         return jestConfig;
    //     }
    // },
    // devServer: {
    //     proxy: {
    //         "/api": "http://127.0.0.1:3001/",
    //         "/uploads": "http://127.0.0.1:3001/",
    //         "/icons": "http://127.0.0.1:3001/",
    //         "/gallery-items": "http://127.0.0.1:3001/",
    //         "/built-in-widgets": "http://127.0.0.1:3001/",
    //         "/api/realtime": {
    //             target: "ws://127.0.0.1:3001",
    //             ws: true
    //         }
    //     }
    // }
};