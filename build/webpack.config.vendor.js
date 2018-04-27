const webpack = require('webpack');
const path = require('path');
const pkg = require('../package.json');
var pkgD = Object.keys(pkg.dependencies)
pkgD.splice(pkgD.indexOf('epic-spinners'),1)
pkgD.splice(pkgD.indexOf('font-awesome'),1)

module.exports = {
  entry: {
    vendor: pkgD,
  },
  output: {
    path: path.join(__dirname, 'dist-[hash]'),
    filename: '[name].js',
    library: '[name]',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
      filename: '[name].js',
      name: '[name]',
    }),
  ]
};
