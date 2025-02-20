# 性能优化
## 首屏性能指标
- FP First Paint/首次绘制
- FCP First Contentful Paint/首内容绘制
- FMP First Meaningful Paint/首次有效绘制
- LCP Largest Contentful Paint/最大内容绘制
<font bgcolor="#81BBF8">其中FP、FCP都可以用Performance工具检测。FMP我们可以自己使用MutationObserver来实现</font>

除了这些，还有我们平常不怎么关注的：
- First Contentful Paint(FCP) 从网页开始加载到网页任何部分的内容呈现在屏幕上所用的时间
- Largest Contentful Paint(LCP)从网页开始加载到屏幕上呈现最大的文本块或图片元素所用的时间
- Interaction to Next Paint(INP)与网页进行的每次点按、点击或键盘互动的延迟时间。根据互动次数，此指标选择网页的最差（或接近最差）互动延迟时间作为单个代表性值，以描述网页的整体响应能力
- Total Blocking Time(TBT)从FCP到可交互时间(TTI)之间的总时长，其中主线程处于阻塞状态的时间足够长，足以
阻止输入响应能力
- Cumulative Layout Shift(CLS)从页面开始加载到其生命周期状态更改为隐藏期间发生的所有意外布局偏移的累计得
分
首字节时间(TTFB)网络使用资源的第一个字节响应用户请求所需的时间
## 减少首屏加载文件资源体积
1. 优化图片：使用合适的图片格式（如WebP),并对图片进行压缩。确保图片尺寸适合其显示区域，不要使用过大的图片。
2. 延迟加载：使用懒加载(lazyloading)技术，只有在用户滚动到特定区域时才加载相关资源
3. 精简CSS和JavaScript:
代码压缩：移除代码中的空格、注释和多余字符，减少文件大小。
合并文件：将多个CSS和JavaScript文件合并为一个文件，减少HTTP请求次数。
树摇(TreeShaking):移除未使用的代码，减少打包文件的体积。
4. 使用CDN:将静态资源托管在内容分发网络(CDN)上，缩短资源加载的时间。
5. 减少第三方库：评估和移除不必要的第三方库，使用更轻量级的替代方案。
6. 启用浏览器缓存：设置适当的缓存策略，使浏览器能够缓存常用的文件，减少重复加载。
7. 压缩文本资源：启用Gzip或Brotli压缩，减少HTML、CSS和JavaScript文件的体积。
8. 服务端渲染(SSR)和静态生成：使用服务端渲染或静态生成技术，减少客户端渲染的压力。

## 预加载内容
1.使用<link rel="preload">标签：
预加载关键资源如字体、图片、CSS和JavaScript文件。
```javascript
<link rel="preload" href="styles/main.css" as="style">
<link rel="preload" href="scripts/main.js" as="script">
<link rel="preload" href="fonts/myfont.woff2" as="font" type="font/woff2" crossorigin="anonymous">
```

2.优先加载关键CSS:
将关键CSS直接嵌入到HTML文件的头部，减少首次渲染的阻塞。
```css
<sytle>
/* Critical CSS */
  body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
</style>
```

3.异步加载和延迟加载JavaScript:
使用async或defer属性来加载非关键的JavaScript文件，避免阻塞HTML解析。
```Html
<script src="scripts/main.js" defer></script>
```

4.预加载字体：
通过预加载字体资源，避免首次渲染时的字体闪烁(FOIT)。
Nginx
```Nginx
<link rel="preload" href="fonts/myfont.woff2" as="font" type="font/woff2" crossorigin="anonymous">
```

5.预加载关键图片：
对于首屏关键图片，可以使用预加载标签提前加载，确保它们尽快显示。
```Html
<link rel="preload" href="images/1.png" as="image">
```

6.置HTTP/2 Server Push:
如果服务器支持HTTP/2,可以配置服务器在客户端请求HTML时推送关键资源。
```Nginx
location / {
  http2_push /styles/main.css;
  http2_push /scripts/main.js;
}
```

7.优先加载核心框架：
对于使用JavaScript框架（如React、Vue)的应用，可以优先加载框架核心代码，确保应用尽快可交互。

## 预渲染实现
https://github.com/Tofandel/prerenderer#readme
正确使用@prerenderer/webpack-plugin和@prerenderer/renderer-puppeteer进行预渲染。以下是一个详细的配置示例：


表格开发，可能是大家平常开发过程中最常见的场景，表格的优化我们可以给出以下历程：
 
1.用库
2.初级：tabledom
3.中级：虚拟表格
4.高级：canvas table
```tsx

import React, { useRef, useEffect } from "react";

const CanvasTable = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rowHeigth = 20;
    const columnWidths = [50, 150, 50];
    canvas.height = data.lenght * rowHeigth;
    canvas.width = columnWidths.reduce((a, b) => a + b);
    data.forEach((row, rowIndex) => {
      const y = rowHeigth * rowIndex;
      ctx.fillText(row.id, 0, y + rowHeigth / 2);
      ctx.fillText(row.name, 0, columnWidths[0], y + rowHeigth / 2);
      ctx.fillText(
        row.age,
        0,
        columnWidths[0] + columnWidths[1],
        y + rowHeigth / 2,
      );
      ctx.strokeReact(0, y, canvas.width, rowHeigth);
    });
  }, [data]);
  return <canvas ref={canvasRef} />;
};

const data = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Name ${i}`,
  age: i * 2,
}));

export default function App() {
  return <CanvasTable data={data} />;
}
```

5.专家：canvas+tile技术
6.高级专家：skia+Webassembly