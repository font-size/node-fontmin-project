# node-fontmin-project

## 简介
```
1：一个简易的nodejs字体切割程序
2：移动端页面中加载中文字体太大的前后端整套解决方案
3：通过字体切割，一个页面中原本需要加载10MB的字体文件可以被压缩在几百KB甚至几十KB之内
4：纯js代码

Fontmin出自百度前端团队junmer。
基本使用请点击 资源 中的fontmin链接。
```
<a href="http://www.lichengblog.com/fontmin/index.html" target="_blank">在线示例</a>

## 方案原理

字体切割程序
```
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
```
定义一个nodejs接口，监听3000端口的post请求，返回一个包含url和font的对象
```
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
```
前端页面里的js，请求post接口，通过返回的数据给页面设置font-face等样式
```
function fontmin(selectDom, fontDom) {
  // 获取文字
  const text = document.querySelector(selectDom).innerText
  // 字体
  const font = fontDom
  // 设置post type
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  // 接口地址
  axios.post('/getfontmin', {
    text: text,
    font: font
  })
  .then(function (response) {
    // 当接口成功返回时，动态给head设置css
    // 这里demo展示了字体切换功能
    // 一般不会在页面上把字体切换来切换去
    let styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    const cssText = `
    @font-face {
      font-family: "${response.data.font}";
      src: url("${response.data.url}") format("truetype");
    }
    p, h1 {
      font-family: "${response.data.font}";
    }
    `
    styleDom.appendChild(document.createTextNode(cssText));
    document.getElementsByTagName('head')[0].appendChild(styleDom)
    // alert("设置成功")
  })
  .catch(function (error) {
    console.log(error);
    alert("设置失败")
  });
} 
```

### 资源

<a href="http://ecomfe.github.io/blog/fontmin-getting-started/" target="_blank">Fontmin</a><br>
<a href="https://nodejs.org/en/" target="_blank">nodejs</a><br>
<a href="http://expressjs.com/" target="_blank">http://expressjs.com/</a><br>

## License

<a href="https://opensource.org/licenses/MIT" target="_blank">MIT</a>
