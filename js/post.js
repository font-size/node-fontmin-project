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