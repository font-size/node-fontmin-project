module.exports = function (font, text, callback) {
    const Fontmin = require('fontmin')
    var srcPath = `./fonts/${font}.ttf`; // 字体源文件
    var destPath = './font';    // 输出路径
    var text = text || '';
    
    // 初始化
    var fontmin = new Fontmin()
        .src(srcPath)               // 输入配置
        .use(Fontmin.glyph({        // 字型提取插件
            text: text              // 所需文字
        }))
        .use(Fontmin.ttf2eot())     // eot 转换插件
        .use(Fontmin.ttf2woff())    // woff 转换插件     
        .use(Fontmin.ttf2svg())     // svg 转换插件
        .use(Fontmin.css())         // css 生成插件
        .dest(destPath);            // 输出配置
    
    // 执行
    
    fontmin.run(function (err, files, stream) {
        if (err) {                  // 异常捕捉
            console.error(err);
        }
        // console.log('done');        // 成功
        return callback('done')
    });
}

