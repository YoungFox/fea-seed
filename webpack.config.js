/**
 * config0
 * 适用单页面|多页面
 * 编译的目录结构与燕尾服相同
 * 不一定非要全写成json，这个config就是一个node.js module，可以写任何JavaScript
 */

const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const feaEntry = require('fea-entry');
let entry = feaEntry('./dev/src/js/', ['lib', 'components', 'conf']);


//抛出一个配置对象，供webpack使用
let config = {
    //项目入口js
    entry: entry,
    //编译目录
    output: {
        //文件编译的目标文件夹
        path: path.join(__dirname, 'build/static'),
        //服务器的相对路径
        publicPath: "/static/",
        filename: "js/[name].js",
        //ensure延迟加载的模块编译目录、名字
        chunkFilename: "js/[id].chunk.js",
        sourceMapFilename: "sourcemap/[file].map"
    },
    //对普通模块处理，就是我们自己写的那些模块
    module: {
        loaders: [ //加载器
            //babel编译jsx或者es6
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            }, {
                test: /\.html$/,
                loader: "html"
            },
            //对css单独load，目的是可以编译到css目录下，否则会编译到js中当成模块，这样会白屏
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style", "css")
            },
            //小于4k变成base64
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ //加载jq
            $: path.resolve(__dirname, 'dev/src/js/lib/jquery'),
            jQuery: path.resolve(__dirname, 'dev/src/js/lib/jquery')
                // 或者直接用npm的jquery模块
                // $: 'jquery'
        }),
        new ExtractTextPlugin("css/[name].css"), //单独使用style标签加载css并设置其路径

        // new HtmlWebpackPlugin({                        //根据模板插入css/js等标签生成最终HTML
        //     // favicon:'./src/img/favicon.ico', //favicon路径
        //     filename:'../index.html',    //生成的html存放路径，相对于 output.path
        //     template:'./dev/index.html',    //html模板路径
        //     inject:true,    //允许插件修改哪些内容，包括head与body
        //     hash:true,    //为静态资源生成hash值
        //     chunks: ['common','index'],
        //     minify:{    //压缩HTML文件
        //         removeComments:true,    //移除HTML中的注释
        //         collapseWhitespace:false    //删除空白符与换行符
        //     }
        // }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        })
        // new webpack.optimize.CommonsChunkPlugin({name:'doT',minChunks: Infinity}),
        // new webpack.optimize.CommonsChunkPlugin({name:'index'})

    ],
    resolve: {
        //配置查找模块的路径和扩展名和别名（方便书写）
        // root: 'E:/github/flux-example/src', //绝对路径

        //这样就可以写 require('file') 代替 require('file.js')
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            jquery: path.resolve(__dirname, 'dev/src/js/lib/jquery')
        }
    },
    cache: true,
    devtool: 'source-map'
};


//获取指定类型所有views文件
let getEntry = (globPath = './dev/views/') => {
    let files = glob.sync(globPath + '**/*.html');
    let pages = {},
        page, dirname, entryName, basename, pathname, extname;

    for (let i = 0; i < files.length; i++) {
        page = files[i];
        dirname = path.dirname(page);
        extname = path.extname(page);
        basename = path.basename(page, extname);
        entryName = path.join(dirname.replace(globPath, ''), basename);

        pages[entryName] = [path.join('./', page)];
    }
    return pages;
}

let pages = Object.keys(getEntry());
// console.log(getEntry('dev/views/'));
pages.forEach((entryName) => {
    // console.log(path.resolve('dev/views/',entryName+'.html'));
    let conf = {
        filename: path.join('../views/', entryName + '.html'), //生成的html存放路径，相对于path
        template: path.resolve('dev/views/', entryName + '.html'), //html模板路径
        inject: true, //js插入的位置，true/'head'/'body'/false
        chunks: ['common'], //默认引用模块
        hash: true
            /*
             * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
             * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
             * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
             * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
             */
            // minify: { //压缩HTML文件
            //     removeComments: true, //移除HTML中的注释
            //     collapseWhitespace: false //删除空白符与换行符
            // }
    };
    if (entryName in config.entry) {
        // conf.favicon = 'src/imgs/favicon.ico';
        conf.chunks = ['common', entryName];
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;
