import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import overwriteConfig from './webpack/overwrite-config';

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/client/index.html',
  filename: './index.html',
});

const clientPort = process.env.CLIENT_PORT || 3000;
const tenant = process.env.REACT_APP_TENANT;

const entries = {
  'swag-bundle': [
    `webpack-dev-server/client?http://localhost:${clientPort}/`,
    'webpack/hot/dev-server',
    './src/client/scripts/customer/entry',
  ],
};

const requestEntries = (process.env.SWAG_ENTRIES || 'swag-bundle').split(',');

const devtool = process.env.DEVTOOL_OPTION || 'source-map';

if (!requestEntries.every((entry) => entry in entries)) {
  throw new Error('Wrong entries passed');
}

const config = {
  mode: 'development',
  devtool,
  stats: 'errors-only',
  watch: true,
  watchOptions: {
    poll: true,
  },
  entry: requestEntries.reduce((acc, entry) => ({ ...acc, [entry]: entries[entry] }), {}),

  output: {
    publicPath: '/',
    path: path.join(__dirname, './build/client'),
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules', 'src'],
    alias: {},
  },
  plugins: [
    htmlWebpackPlugin,
    tenant &&
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(__dirname, './src/client/tsconfig.json'),
        },
      }),
  ].filter(Boolean),
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              sourceMaps: true,
              presets: [
                '@babel/preset-react',
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['chrome >= 72'],
                    },
                  },
                ],
              ],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
              ],
            },
          },
        ],
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test')],
      },
      {
        test: /\.(scss|css)$/,
        exclude: [path.resolve(__dirname, 'node_modules/')],
        use: [
          'style-loader',
          {
            loader: '@teamsupercell/typings-for-css-modules-loader',
            options: {
              formatter: 'prettier',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCase',
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};

export default overwriteConfig(tenant, config);
