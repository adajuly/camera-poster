# camera-poster

一个应用与 h5 活动页的拍照合成海报 Vue 组件, 使用简单、操作方便、兼容性好。

![Watch the demo](https://github.com/adajuly/adajuly.github.io/blob/main/assets/demo.gif?raw=true)

[homepage](https://adajuly.github.io/camera-poster/)

## 特点

- 支持相机拍照, 兼容性好无图片旋转 bug.
- 支持配置并, 增加删除装饰 icon.
- 支持缩放、旋转、移动等手势操作图片.
- 支持配置前景图、背景图.
- 支持配置切换前景图, 适应于换皮肤等场景.

## 安装

```shell
npm install camera-poster
```

## 使用

```javascript
import { CameraInput, CameraPoster } from "camera-poster";
...

  components: {
    CameraInput,
    CameraPoster
  },
```

```html
<!-- 插入相机 -->
<CameraPoster
  class="poster"
  ref="cameraposter"
  :styleObject="styleObject"
  :frontImg="front1"
  :backImg="back"
  frontImgPos="CB"
  background="transparent"
/>

<!-- 插入按钮 -->
<div class="button">
  <CameraInput />
  上 传
</div>
```

```javascript
const cameraposter = this.$refs.cameraposter

// 添加icon , 两种方式
/// 1. require
cameraposter.addIcon(require(`./assets/${id}.png`))
/// 2. import
import img from './assets/front2.png'
cameraposter.addIcon(require(img))

// 修改前景图
const img = this.index % 2 == 0 ? front1 : front2
cameraposter.changeFrontImg(img)

// 获取截图图片
const img = cameraposter.toImage(200)

// 获取截图dataurl
const dataUrl = cameraposter.toDataURL()
```

### 组件属性

- `styleObject` - 组件样式, 可以包含宽高
- `width` - 组件宽-同上宽, 非必填
- `height` - 组件高-同上高, 非必填
- `quality` - 保存图片品质, 非必填
- `photoWidth` - 图片宽度设置, 非必填
- `background` - 组件背景色, 透明为`transparent`, 非必填
- `frontImg` - 前景图片 url, 非必填
- `frontImgPos` - 前景图片位置, 默认为`CC`, 其他可填`LT`、`RT`、`LB`、`RB`
- `backImg` - 背景图片 url, 非必填
- `backImgPos` - 背景图片位置, 默认为`CC`, 其他可填`LT`、`RT`、`LB`、`RB`
- `backImgSize` - 背景图片尺寸, 默认为`cover`
- `ratio` - 显示比率, 默认为 2

## License

[https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)
