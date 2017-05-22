const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/app.js',
    },
    resolve: {
        modules: [path.resolve(__dirname, './src'), 'node_modules']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, './assets'),
    },
    module: {
        rules: [
            {
                test:    /\.elm$/,
                exclude: [/elm-stuff/, /node_modules/],
                loader: "elm-hot-loader!elm-webpack-loader"
            },
            {
                test: /\.md$/,
                include: [/src/],
                loader: 'raw-loader'
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!postcss-loader!sass-loader"
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loader: 'url-loader'
            },
            {
               test: /\.yaml$/,
               loader: 'yml-loader'
           },
           {
             loader: 'babel-loader',
             include: [
               path.resolve(__dirname, "src"),
             ],
             test: /\.(js|es6)$/,
             exclude: /(node_modules|bower_components)/,
             query: {
               plugins: ['transform-runtime'],
               presets: ['es2015', 'stage-0'],
             }
           }
        ]
    },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      favicon: 'src/images/favicon.ico',
      title: 'NZH Insights'
    }),
    new CopyWebpackPlugin([
      { from: 'assets/data', to: 'data' },
      { from: 'assets/images', to: 'images' }
    ]),
     new webpack.optimize.CommonsChunkPlugin({
       name: 'vendor',
       minChunks: function (module) {
          // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
          }
     })
  ]
};


