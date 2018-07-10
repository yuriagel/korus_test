var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
require("babel-polyfill");
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('bundle.css');

const _baseURL = 'http://api.openweathermap.org/data/2.5/';
const _APIKEY = 'b714ec74bbab5650795063cb0fdf5fbe';
const googleApi = 'AIzaSyDlCiXQv3BJVhJs52or6bprQwBkmX4MY-0';
const googleURL='https://maps.googleapis.com/maps/api/place/autocomplete/json';
const NODE_ENV = process.env.NODE_ENV || 'production';


const IS_OFFLINE = false; //Отвечает за работу без инета. в этом случае на любой запрос отправляется позитивный ответ с одним городом.


const pathWeb = NODE_ENV === 'production' ? '/target/classes/static': '/build';

const defPlagin = new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) },
    'process.env.NODE_ENV':JSON.stringify(NODE_ENV),
    'NODE_ENV': JSON.stringify(NODE_ENV),
    _API_CONFIG_:JSON.stringify( NODE_ENV === 'production' ? ".":"."),
    IS_OFFLINE: JSON.stringify(IS_OFFLINE),
    _baseURL: JSON.stringify( NODE_ENV === 'production'? 'weather/': _baseURL),
    _APIKEY: JSON.stringify( NODE_ENV === 'production'? '11': _APIKEY),
    GOOGLE_URL:JSON.stringify(  googleURL+"?key=" + googleApi)
});
var plugins = [extractCSS, defPlagin,
    new HtmlWebpackPlugin({
        template: 'app/index.html'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin()
];

plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/));


if (NODE_ENV === 'production'  )
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true,  compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true
        }, output: {
            comments: false
        }}));

console.log('NODE_ENV=' + NODE_ENV);
module.exports = {
    entry: {
        app: ['babel-polyfill',
            path.resolve(__dirname, "./app/index.js")
        ]
         },
    output: {
        path: __dirname + pathWeb,
        filename: "[name].js",
        publicPath: ''
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /(\.js|\.jsx)$/,
                loader: "babel-loader",

                include: /app/,
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                },
                enforce: 'pre'
            },


            {test: /\.(scss|css)(\?.+)?$/,   include: /(app|src|lib)/, loader:  extractCSS.extract(['css-loader','less-loader']) },
            {test: /\.svg(\?.+)?$/, include: /(app|src|lib)/ ,loader: 'file-loader?name=images/[hash].[ext]&limit=10000&mimetype=image/svg+xml'},

        ]
    },
    resolve: {
        extensions: [".js", '.jsx']
    },
};

