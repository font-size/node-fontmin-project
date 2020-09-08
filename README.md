# node-fontmin-project

## 简介

通过一个接口请求，返回只包含页面中的字体的font文件，解决了中文字体库过大的问题，特别是移动端的页面，速度提升很大

  * 整套方案由纯js实现，轻量级应用
  * 字体文件变成按需加载，量级从MB变成KB，切割后的大小不如一张普通的图
  * 对现有项目的页面改动小，对各种类型的项目兼容性好
  * 可以批量实现

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
## 本地使用和运行

在文件目录下运行

```
$ node express.js
```
  * 下载nginx，在nginx/html下新建fontmin文件夹，把本项目所有文件拷贝到fontmin目录下，

  * 配置nginx，conf/nginx.conf

```
    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;
        client_max_body_size 500M;
        #access_log  logs/host.access.log  main;

        location /getfontmin {
            proxy_pass http://127.0.0.1:3000/getfontmin;
        }

        location /fontmin/ {
            root html; 
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;

        location = /50x.html {
            root   html;
        }
    }
```

  * 运行nginx
  * 用浏览器打开index.html

### 资源

<a href="http://ecomfe.github.io/blog/fontmin-getting-started/" target="_blank">Fontmin</a><br>
<a href="https://nodejs.org/en/" target="_blank">nodejs</a><br>
<a href="http://expressjs.com/" target="_blank">http://expressjs.com/</a><br>

## License

<a href="https://opensource.org/licenses/MIT" target="_blank">MIT</a>
