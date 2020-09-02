// const fs = require('fs');
const fontmin = require('./fontmin')
const express = require('express');
const bodyParser = require('body-parser');

// 设置可用字体
const fonts = [
    {font: 'SourceHanSerifCN-Medium', name: '思源宋体'},
    {font: 'PangMenZhengDao', name: '庞门正道粗书体'},
    {font: 'RuiziGongfangMeiheiGBK', name: '锐字工房云字库美黑GBK'},
    {font: 'RuiziZhenyanti', name: '锐字真言体'},
    {font: 'YousheBiaotihei', name: '优设标题黑'},
    {font: 'Zihun116', name: '字魂116号-凤鸣手书'}
]

// express 实例
const app = express();

// 转化参数设置
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended:true
}));

// post 接口
app.post('/getfontmin', function(request, response){
    const params = request.body
    const font = params.font
    const text = params.text
    // 如果传递的font字体在后台没有就返回400
    const item = fonts.find(e => e.font === font)
    if(item) {
        fontmin(font, text, function(e) {
            if(e === 'done') {
               console.log('done')
               // 拼接参数 返回请求
               let back = {
                   url: '/fontmin/font/' + font + '.ttf',
                   font: font
               }
               response.send(back);
            } 
        });
    } else {
        response.status(400);
        response.send('没有请求的字体文件');
    }
});

app.listen(3000);