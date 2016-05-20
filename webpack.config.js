/**
 * config
 * 适用单页面
 *不一定非要全写成json，这个config就是一个node.js module，可以写任何JavaScript
 */ 

var path=require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
//抛出一个配置对象，供webpack使用
module.exports={
    //项目入口js
    entry:{
            index: "./dev/src/js/entry.js",
            index1: "./dev/src/js/entry1.js"
        },
    //编译目录
    output:{
        //文件编译的目标文件夹
        path: path.join(__dirname,'build/static'),
        //服务器的相对路径
        publicPath: "static/",
        filename: "js/[name].js",
        //ensure延迟加载的模块编译目录、名字
        chunkFilename: "js/[id].chunk.js",
        sourceMapFilename: "sourcemap/[file].map"
    },
    //对普通模块处理，就是我们自己写的那些模块
    module: {
        loaders: [    //加载器
            //babel编译jsx或者es6
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {test: /\.html$/, loader: "html" },
            //对css单独load，目的是可以编译到css目录下，否则会编译到js中当成模块，这样会白屏
            {test: /\.css$/, loader:ExtractTextPlugin.extract("style", "css") },
            //小于4k变成base64
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'}
        ]
    },
    plugins:[
        new webpack.ProvidePlugin({    //加载jq
                $: path.resolve(__dirname,'dev/src/js/lib/jquery'),
                jQuery: path.resolve(__dirname,'dev/src/js/lib/jquery')
                // 或者直接用npm的jquery模块
                // $: 'jquery'
            }),
        new ExtractTextPlugin("css/[name].css"),    //单独使用style标签加载css并设置其路径
        new HtmlWebpackPlugin({                        //根据模板插入css/js等标签生成最终HTML
            // favicon:'./src/img/favicon.ico', //favicon路径
            filename:'../index.html',    //生成的html存放路径，相对于 output.path
            template:'./dev/index.html',    //html模板路径
            inject:true,    //允许插件修改哪些内容，包括head与body
            hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({name:'common',minChunks: 2})
    ],
    resolve: {
        //配置查找模块的路径和扩展名和别名（方便书写）
        // root: 'E:/github/flux-example/src', //绝对路径

        //这样就可以写 require('file') 代替 require('file.js')
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            jquery: path.resolve(__dirname,'dev/src/js/lib/jquery')
        }
    },
    cache: true,
    devtool:'source-map'
};



