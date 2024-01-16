module.exports = {
    webpack: {
      alias: {},
      plugins: [],
      mode: 'extends',
      configure: {
        module: {
          rules: [
            {
              /* based on https://webpack.js.org/guides/asset-modules/#source-assets */
              test: /\.glsl$/,
              type: 'asset/source',
            },
          ],
        },
      },
    },
  };