一、前言：
在我准备下班的实话，突然需求方的一个电话制止了我电脑的关机。原来是需求方发现bug，就是点击签名按钮不起作用。后经查询问题发现，之前这个签字板的功能是一个原生app提供的能力，现在要将H5嵌入其他app中，其他app没有通过签字板的能力，导致按钮作用。故解决问题的策略是制作一个H5的签字板。
二、签字板的板式：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/006f7b6415a86618ca2cbe2fee3b602c.gif)

三、解决步骤：
1、使用`react-signature-canvas`插件
下载命令：`npm i react-signature-canvas -S`  或者 `yarn add react-signature-canvas`
2、获取设备的宽度和高度，再设置底层 `canvas` 的宽度和高度
3、利用 css 的 `transform:rotate(90deg)`  和 `transform-origin: 301px 301px;`  将`canvas`  旋转90度，并定位好位置

四、主要代码（本次将 `SignatureProps `制作成一个组件）
1、Signature.tsx 代码：
```typescript
import React, { FC, useState, useEffect, useRef } from 'react';
import { history } from 'alita';
import SignatureCanvas from 'react-signature-canvas';
import styles from './index.less';

interface SignatureProps {
  getSigin: (imgStr: string) => any;
  getCanvasRef?: (ref: React.MutableRefObject<null>) => void;
  back: () => void;
}
const Signature: FC<SignatureProps> = (props) => {
  const { getSigin, getCanvasRef, back } = props;
  const signCanvas = useRef(null);
  useEffect(() => {
    // 竖屏模式下横过来，横屏状态下不变
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    if (width < height) {
      detectOrient();
    }
  }, []);
  const confirmSign = () => {
    const sign = signCanvas!.current.toDataURL('image/png');
    getSigin(sign);
  };

  const detectOrient = function (id = 'content') {
    //先将整个h5页面翻转
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight,
      $wrapper = document.getElementById(id),
      style = '',
      canvasStyle = '';
    style += 'width:' + height + 'px;';
    style += 'height:' + width + 'px;';
    style += '-webkit-transform: rotate(90deg); transform: rotate(90deg);';
    style += '-webkit-transform-origin: ' + width / 2 + 'px ' + width / 2 + 'px;';
    style += 'transform-origin: ' + width / 2 + 'px ' + width / 2 + 'px;';
    $wrapper!.style.cssText = style;
    //将签名还原翻转，就可以保证在横屏情况下保证画笔的方向跟手势一致，然后再进行高度和宽度的调整。
    let parentElement = document.getElementById('signContent');
    let pw = parentElement!.clientWidth;
    let ph = parentElement!.clientHeight - 10;
    parentElement!.style.cssText = 'height: ' + ph * 2 + 'px;padding: 0 20px;';

    let canvasElement = signCanvas?.current.getCanvas();
    canvasElement.height = pw - 40;
    canvasElement.width = ph * 2;
    canvasStyle += 'transform-origin: ' + ph + 'px ' + ph + 'px;transform: rotate(-90deg);';
    canvasStyle += 'background: #f2f2f2;' + `height:${pw - 40};width:${ph * 2}`;
    canvasElement.style.cssText = canvasStyle;
  };

  return (
    <div className={styles.sign} id="content">
      <div className={styles.signContainer}>
        <div className={styles.salarySignContainer}>
          <div className={styles.salarySignTitle}>
            <div
              className={styles.goBack}
              onClick={() => {
                back();
              }}
            >
              返回
            </div>
            请签名确认
          </div>
          {/* 画布 */}
          <div id="signContent" className={styles.salarySignContent}>
            <SignatureCanvas
              ref={signCanvas}
              penColor="#000"
              backgroundColor="#f2f2f2"
              canvasProps={{ className: styles.sigCanvas }}
            />
          </div>
          {/* 按钮 */}
          <div className={styles.salarySignBar}>
            <div
              className={styles.salarySignBtn}
              onClick={() => {
                confirmSign();
              }}
            >
              确认
            </div>
            <div
              className={styles.salarySignBtn}
              onClick={() => {
                // history.goBack();
                signCanvas.current?.clear();
              }}
            >
              清除
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signature;

```

2、less 文件代码：
```less
.sign{
  .signContainer{
    .salarySignContainer{
      width: 100%;
      height: 100%;
      .salarySignTitle{
        position: relative;
        padding: 10px;
        color: #fff;
        text-align: center;
        background-color:  #0080CB;
        z-index: 9999;
        .goBack{
          position: absolute;
          padding-left: 20px;
        }
      }
    }
  }
  .salarySignBar{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    justify-content: space-between;
    padding:10px; 
    z-index: 9999;
    .salarySignBtn{
      padding:10px; 
      color: #fff;
      text-align: center;
      background-color: #FAA71D;
      border-radius: 10px;
    }
  }
}
}
```

