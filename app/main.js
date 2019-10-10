var Hammer = require('hammerjs')
if (!Hammer) { Hammer = window.Hammer }
window.HammerjsImage = function HammerjsImage(opt) {
    var that = this
    //处理的图片元素
    var img
    //返回的canvas元素
    var c
    var offset_x = 0
    var offset_y = 0
    var scale = 1
    var rotation = 0
    var last_offset_x = 0
    var last_offset_y = 0
    var last_scale = 1
    var last_rotation = 0
    var start_otation = 0
    var canvas_info = {
        width: 580,
        height: 870
    }
    this.zoom = 1
    this.maxScale = isNaN(opt.maxScale) ? 3 : opt.maxScale
    this.minScale = isNaN(opt.minScale) ? 0.5 : opt.minScale
    if (!(opt.id || opt.el)) {
        return console.error('没有需要旋转的元素')
    }
    var square = opt.id ? document.querySelector(opt.id) : opt.el;
    square.style.overflow = 'hidden'
    if (square.style.backgroundColor === '') {
        square.style.backgroundColor = '#FFFFFF'
    }
    square.onmousewheel = function(e) {
        if (e.wheelDelta > 0) {
            scale = scale < that.maxScale ? scale + 0.1 : that.maxScale
        } else {
            scale = scale > that.minScale ? scale - 0.1 : that.minScale
        }
        that.preview()
    }
    /**
     * [changeImg 加载图片预处理居中显示]
     * @param  {[type]} src [description]
     * @return {[type]}     [description]
     */
    this.changeImg = function(src) {
        if (img) { img.remove() }
        img = document.createElement('img')
        img.style.maxHeight = '100%'
        img.style.maxWidth = '100%'
        img.align = 'left'
        img.ondragstart = function() {
            return false;
        }

        img.onload = function() {
            that.zoom = this.naturalWidth / this.width
            canvas_info.width = that.zoom * square.offsetWidth
            canvas_info.height = that.zoom * square.offsetHeight

            var ox = (square.offsetWidth / 2) - (this.width / 2)
            var oy = (square.offsetHeight / 2) - (this.height / 2)

            that.setTranslate3dInfo({
                offset_x: ox,
                offset_y: oy,
                scale: 1,
                rotation: 0
            }).preview()
        }
        img.src = src
        square.appendChild(img)
    }
    /**
     * [getTranslate3dInfo 获取当前旋转缩放移动参数]
     * @return {[type]} [description]
     */
    this.getTranslate3dInfo = function() {
        return {
            offset_x,
            offset_y,
            scale,
            rotation
        }
    }
    /**
     * [setTranslate3dInfo 手动设置旋转缩放移动，该设置不会影响预览，需要调用perview进行预览]
     * @param {[type]} opt [description]
     */
    this.setTranslate3dInfo = function(opt) {
        if (opt.offset_x !== undefined) {
            offset_x = opt.offset_x
            last_offset_x = opt.offset_x
        }
        if (opt.offset_y !== undefined) {
            offset_y = opt.offset_y
            last_offset_y = opt.offset_y
        }
        if (opt.scale !== undefined) {
            scale = opt.scale
            last_scale = opt.scale
        }
        if (opt.rotation !== undefined) {
            rotation = opt.rotation
            last_rotation = opt.rotation
        }
        return that
    }
    /**
     * [getBase64 返回图片旋转缩放移动后的base64数据]
     * @return {[type]} [description]
     */
    this.getBase64 = function() {
        return that.translate3d().toDataURL()
    }

    /**
     * [preview 预览选择缩放移动后的图片，不进行canvas生成]
     * @return {[type]} [description]
     */
    this.preview = function() {
        if (scale > that.maxScale) {
            scale = that.maxScale
        } else if (scale < that.minScale) {
            scale = that.minScale
        }
        var transform = "translate3d(" + offset_x + "px," + offset_y + "px,0)" + "scale3d(" + scale + "," + scale + ",1)" + "rotate(" + rotation + "deg)";
        img.style.webkitTransform = transform;
        that.onPreviewChange(that, {
            offset_x,
            offset_y,
            scale,
            rotation
        })
    }

    this.onPreviewChange = function() {

    }
    /**
     * 获取图片旋转缩放移动后的canvas
     * @return {[type]} [description]
     */
    this.translate3d = function() {
        if (c) { c.remove() }
        c = document.createElement('canvas')
        c.height = canvas_info.height;
        c.width = canvas_info.width;
        var ctx = c.getContext("2d");
        ctx.translate(img.naturalWidth * (1 - scale) / 2, img.naturalHeight * (1 - scale) / 2)
        ctx.translate(offset_x * that.zoom, offset_y * that.zoom)
        var x = (img.naturalHeight * Math.sin(rotation * Math.PI / 180) - (img.naturalHeight * Math.sin(rotation * Math.PI / 180) + img.naturalWidth * Math.cos(rotation * Math.PI / 180) - img.naturalWidth) / 2) * scale
        var y = -(img.naturalWidth * Math.sin(rotation * Math.PI / 180) + img.naturalHeight * Math.cos(rotation * Math.PI / 180) - img.naturalHeight) / 2 * scale
        ctx.translate(x, y)
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(scale, scale)
        ctx.drawImage(img, 0, 0)
        return c
    }
    /**
     * 初始化加载图片
     */
    this.changeImg(opt.img)

    /**
     * 初始化hammer绑定hammer,操作区域，图片之间的关系
     */
    var hammertime = new Hammer.Manager(square)
    var Pan = new Hammer.Pan();
    var Rotate = new Hammer.Rotate();
    var Pinch = new Hammer.Pinch();
    var DoubleTap = new Hammer.Tap({
        event: 'doubletap',
        taps: 2
    });
    Rotate.recognizeWith([Pan]);
    Pinch.recognizeWith([Rotate, Pan]);
    hammertime.add([Pan, Pinch, Rotate, DoubleTap]);
    hammertime.on('mousewheel panmove panend pinchmove pinchend rotatestart rotatemove rotateend doubletap', function(e) {
        switch (e.type) {
            case 'doubletap':
                if (rotation % 360 < 90) {
                    rotation = 90
                } else if (rotation % 360 < 180) {
                    rotation = 180
                } else if (rotation % 360 < 270) {
                    rotation = 270
                } else if (rotation % 360 < 360) {
                    rotation = 360
                }
                break;
            case 'panmove':
                offset_x = last_offset_x + e.deltaX;
                offset_y = last_offset_y + e.deltaY;
                break;
            case 'panend':
                last_offset_x = last_offset_x + e.deltaX;
                last_offset_y = last_offset_y + e.deltaY;
                break;
            case 'pinchmove':
                scale = e.scale * last_scale
                break;
            case 'pinchend':
                scale = e.scale * last_scale;
                last_scale = scale;
                break;
            case 'rotatemove':
                var diff = start_otation - e.rotation;
                rotation = last_rotation - diff;
                break;
            case 'rotatestart':
                last_rotation = rotation;
                start_otation = e.rotation;
                break;
            case 'rotateend':
                last_rotation = rotation;
                break;
        }
        that.preview()
    })
}

module.exports = HammerjsImage
