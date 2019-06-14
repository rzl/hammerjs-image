# 一个使用hammerjs进行图片缩放，旋转，拖放的工具
------
因为图片处理经常需要缩放旋转进行裁剪，所以做了这个东西，方便自己以后使用
简单来说，通过指定的div，通过宽度，高度计算出相对于图片原图的canvas大小然后图片处理返回canvas

### [在线演示demo](https://rzl.github.io/hammerjs-image/demo/index.html)


> * 0.webpack打包
> * 1.通用简单
> * 2.原图处理
> * 3.支持缩放，旋转，拖放，双击等常规操作
> * 4.返回canvas方便二次处理

### 调试测试
1.cnpm install
2.cnpm run dev

### 编译
1.cnpm run build

### 其他项目引用
1.cnpm install hammerjs-image -S
### [点击跳转参考示例](https://github.com/rzl/hammerjs-image-test)

```js
import HammerjsImage  from 'hammerjs-image'

var hi = new HammerjsImage({
    id: '#photo_area',
    img: '12.jpg',
    maxScale: 2,
    minScale: 0.5
})
```

### 使用方法，初始化
```js
    <script type="text/javascript" src="hammer.min.js"></script>
    <script type="text/javascript" src="dist/hammerjs-image.js"></script>
    <div id="photo_area" style="width: 260px; height: 360px; background-color: black; overflow: hidden;">
    </div>
    
    var hi = new HammerjsImage({
        id: '#photo_area', //进行缩放的元素id,或使用el直接传入div元素，id权重较高
        //  el: document.getElementById('#photo_area'),
        img: '12.jpg', //需要进行缩放的图片,图片路径或Base64串
        maxScale: 2, //设置最大的缩放比例,默认2
        minScale: 0.5 //设定最小的缩放比例,默认0.5
    })
    
```

### 主动设置参数，如果不设置，将使用最后一次的值,设置后会影响对象的值
```js
  hi.setTranslate3dInfo({
    rotation: rotation,
    scale: scale,
    offset_x: offset_x,
    offset_y: offset_y
  }).preview()
    
```

### 生成旋转，缩放，拖放后的canvas对象
```js
  hi.translate3d()
```

### 生成旋转，缩放，拖放后的base64
```js
  hi.translate3d().toDataURL()
```
