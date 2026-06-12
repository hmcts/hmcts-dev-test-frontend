const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootExport = require.resolve('govuk-frontend');
const root = path.resolve(rootExport, '..');
const sass = path.resolve(root, 'index.scss');
const javascript = path.resolve(root, 'all.bundle.js');
const components = path.resolve(root, 'components');
const assets = path.resolve(root, 'assets');
const images = path.resolve(assets, 'images');
const fonts = path.resolve(assets, 'fonts');
const manifest = path.resolve(assets, 'manifest.json');

const copyGovukTemplateAssets = new CopyWebpackPlugin({
  patterns: [
    { from: images, to: 'assets/images' },
    { from: fonts, to: 'assets/fonts' },
    { from: manifest, to: 'assets' },
    { from: `${root}/template.njk`, to: '../views/govuk' },
    { from: `${root}/components`, to: '../views/govuk/components' },
    { from: `${root}/macros`, to: '../views/govuk/macros' },
  ],
});

module.exports = {
  paths: { template: root, components, sass, javascript, assets },
  plugins: [copyGovukTemplateAssets],
};
