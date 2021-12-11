import webpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import config from '../../webpack-client.config.dev';
import path from 'path';

const compiler = webpack(config);

const clientPort = process.env.CLIENT_PORT || 3000;

const server = new webpackDevServer(compiler, {
  compress: true,
  hot: true,
  contentBase: path.join(__dirname, '../client'),
  stats: 'errors-only',
  disableHostCheck: true,
});

server.listen(clientPort);
