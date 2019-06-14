var Hammer = require('hammerjs')
if (!Hammer) { Hammer = window.Hammer }
window.HammerjsImage = function HammerjsImage(opt) {
    var that = this
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
    this.maxScale = isNaN(opt.maxScale) ? 2 : opt.maxScale
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

    var hammertime = new Hammer.Manager(square)

    var img = document.createElement('img')
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
    }

    img.src = opt.img
    square.appendChild(img)

    this.getTranslate3dInfo = function() {
        return {
            offset_x,
            offset_y,
            scale,
            rotation
        }
    }

    this.setTranslate3dInfo = function(opt) {
        if (opt.offset_x !== undefined) {
            offset_x = opt.offset_x
        }
        if (opt.offset_y !== undefined) {
            offset_y = opt.offset_y
        }
        if (opt.scale !== undefined) {
            scale = opt.scale
        }
        if (opt.rotation !== undefined) {
            rotation = opt.rotation
        }
        return that
    }

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

    this.translate3d = function() {
        var c = document.createElement('canvas')
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
