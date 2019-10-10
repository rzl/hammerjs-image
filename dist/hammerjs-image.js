!function(g,I){"object"==typeof exports&&"object"==typeof module?module.exports=I(require("hammerjs")):"function"==typeof define&&define.amd?define(["hammerjs"],I):"object"==typeof exports?exports["hammerjs-image"]=I(require("hammerjs")):g.hammerjsImage=I(g.Hammer)}(window,function(__WEBPACK_EXTERNAL_MODULE__1__){return function(g){var I={};function C(t){if(I[t])return I[t].exports;var A=I[t]={i:t,l:!1,exports:{}};return g[t].call(A.exports,A,A.exports,C),A.l=!0,A.exports}return C.m=g,C.c=I,C.d=function(g,I,t){C.o(g,I)||Object.defineProperty(g,I,{enumerable:!0,get:t})},C.r=function(g){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(g,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(g,"__esModule",{value:!0})},C.t=function(g,I){if(1&I&&(g=C(g)),8&I)return g;if(4&I&&"object"==typeof g&&g&&g.__esModule)return g;var t=Object.create(null);if(C.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:g}),2&I&&"string"!=typeof g)for(var A in g)C.d(t,A,function(I){return g[I]}.bind(null,A));return t},C.n=function(g){var I=g&&g.__esModule?function(){return g.default}:function(){return g};return C.d(I,"a",I),I},C.o=function(g,I){return Object.prototype.hasOwnProperty.call(g,I)},C.p="",C(C.s=0)}([function(module,exports,__webpack_require__){eval("var Hammer = __webpack_require__(1)\r\nif (!Hammer) { Hammer = window.Hammer }\r\nwindow.HammerjsImage = function HammerjsImage(opt) {\r\n    var that = this\r\n    //处理的图片元素\r\n    var img\r\n    //返回的canvas元素\r\n    var c\r\n    var offset_x = 0\r\n    var offset_y = 0\r\n    var scale = 1\r\n    var rotation = 0\r\n    var last_offset_x = 0\r\n    var last_offset_y = 0\r\n    var last_scale = 1\r\n    var last_rotation = 0\r\n    var start_otation = 0\r\n    var canvas_info = {\r\n        width: 580,\r\n        height: 870\r\n    }\r\n    this.zoom = 1\r\n    this.maxScale = isNaN(opt.maxScale) ? 3 : opt.maxScale\r\n    this.minScale = isNaN(opt.minScale) ? 0.5 : opt.minScale\r\n    if (!(opt.id || opt.el)) {\r\n        return console.error('没有需要旋转的元素')\r\n    }\r\n    var square = opt.id ? document.querySelector(opt.id) : opt.el;\r\n    square.style.overflow = 'hidden'\r\n    if (square.style.backgroundColor === '') {\r\n        square.style.backgroundColor = '#FFFFFF'\r\n    }\r\n    square.onmousewheel = function(e) {\r\n        if (e.wheelDelta > 0) {\r\n            scale = scale < that.maxScale ? scale + 0.1 : that.maxScale\r\n        } else {\r\n            scale = scale > that.minScale ? scale - 0.1 : that.minScale\r\n        }\r\n        that.preview()\r\n    }\r\n    /**\r\n     * [changeImg 加载图片预处理居中显示]\r\n     * @param  {[type]} src [description]\r\n     * @return {[type]}     [description]\r\n     */\r\n    this.changeImg = function(src) {\r\n        if (img) { img.remove() }\r\n        img = document.createElement('img')\r\n        img.style.maxHeight = '100%'\r\n        img.style.maxWidth = '100%'\r\n        img.align = 'left'\r\n        img.ondragstart = function() {\r\n            return false;\r\n        }\r\n\r\n        img.onload = function() {\r\n            that.zoom = this.naturalWidth / this.width\r\n            canvas_info.width = that.zoom * square.offsetWidth\r\n            canvas_info.height = that.zoom * square.offsetHeight\r\n\r\n            var ox = (square.offsetWidth / 2) - (this.width / 2)\r\n            var oy = (square.offsetHeight / 2) - (this.height / 2)\r\n\r\n            that.setTranslate3dInfo({\r\n                offset_x: ox,\r\n                offset_y: oy,\r\n                scale: 1,\r\n                rotation: 0\r\n            }).preview()\r\n        }\r\n        img.src = src\r\n        square.appendChild(img)\r\n    }\r\n    /**\r\n     * [getTranslate3dInfo 获取当前旋转缩放移动参数]\r\n     * @return {[type]} [description]\r\n     */\r\n    this.getTranslate3dInfo = function() {\r\n        return {\r\n            offset_x,\r\n            offset_y,\r\n            scale,\r\n            rotation\r\n        }\r\n    }\r\n    /**\r\n     * [setTranslate3dInfo 手动设置旋转缩放移动，该设置不会影响预览，需要调用perview进行预览]\r\n     * @param {[type]} opt [description]\r\n     */\r\n    this.setTranslate3dInfo = function(opt) {\r\n        if (opt.offset_x !== undefined) {\r\n            offset_x = opt.offset_x\r\n            last_offset_x = opt.offset_x\r\n        }\r\n        if (opt.offset_y !== undefined) {\r\n            offset_y = opt.offset_y\r\n            last_offset_y = opt.offset_y\r\n        }\r\n        if (opt.scale !== undefined) {\r\n            scale = opt.scale\r\n            last_scale = opt.scale\r\n        }\r\n        if (opt.rotation !== undefined) {\r\n            rotation = opt.rotation\r\n            last_rotation = opt.rotation\r\n        }\r\n        return that\r\n    }\r\n    /**\r\n     * [getBase64 返回图片旋转缩放移动后的base64数据]\r\n     * @return {[type]} [description]\r\n     */\r\n    this.getBase64 = function() {\r\n        return that.translate3d().toDataURL()\r\n    }\r\n\r\n    /**\r\n     * [preview 预览选择缩放移动后的图片，不进行canvas生成]\r\n     * @return {[type]} [description]\r\n     */\r\n    this.preview = function() {\r\n        if (scale > that.maxScale) {\r\n            scale = that.maxScale\r\n        } else if (scale < that.minScale) {\r\n            scale = that.minScale\r\n        }\r\n        var transform = \"translate3d(\" + offset_x + \"px,\" + offset_y + \"px,0)\" + \"scale3d(\" + scale + \",\" + scale + \",1)\" + \"rotate(\" + rotation + \"deg)\";\r\n        img.style.webkitTransform = transform;\r\n        that.onPreviewChange(that, {\r\n            offset_x,\r\n            offset_y,\r\n            scale,\r\n            rotation\r\n        })\r\n    }\r\n\r\n    this.onPreviewChange = function() {\r\n\r\n    }\r\n    /**\r\n     * 获取图片旋转缩放移动后的canvas\r\n     * @return {[type]} [description]\r\n     */\r\n    this.translate3d = function() {\r\n        if (c) { c.remove() }\r\n        c = document.createElement('canvas')\r\n        c.height = canvas_info.height;\r\n        c.width = canvas_info.width;\r\n        var ctx = c.getContext(\"2d\");\r\n        ctx.translate(img.naturalWidth * (1 - scale) / 2, img.naturalHeight * (1 - scale) / 2)\r\n        ctx.translate(offset_x * that.zoom, offset_y * that.zoom)\r\n        var x = (img.naturalHeight * Math.sin(rotation * Math.PI / 180) - (img.naturalHeight * Math.sin(rotation * Math.PI / 180) + img.naturalWidth * Math.cos(rotation * Math.PI / 180) - img.naturalWidth) / 2) * scale\r\n        var y = -(img.naturalWidth * Math.sin(rotation * Math.PI / 180) + img.naturalHeight * Math.cos(rotation * Math.PI / 180) - img.naturalHeight) / 2 * scale\r\n        ctx.translate(x, y)\r\n        ctx.rotate(rotation * Math.PI / 180);\r\n        ctx.scale(scale, scale)\r\n        ctx.drawImage(img, 0, 0)\r\n        return c\r\n    }\r\n    /**\r\n     * 初始化加载图片\r\n     */\r\n    this.changeImg(opt.img)\r\n\r\n    /**\r\n     * 初始化hammer绑定hammer,操作区域，图片之间的关系\r\n     */\r\n    var hammertime = new Hammer.Manager(square)\r\n    var Pan = new Hammer.Pan();\r\n    var Rotate = new Hammer.Rotate();\r\n    var Pinch = new Hammer.Pinch();\r\n    var DoubleTap = new Hammer.Tap({\r\n        event: 'doubletap',\r\n        taps: 2\r\n    });\r\n    Rotate.recognizeWith([Pan]);\r\n    Pinch.recognizeWith([Rotate, Pan]);\r\n    hammertime.add([Pan, Pinch, Rotate, DoubleTap]);\r\n    hammertime.on('mousewheel panmove panend pinchmove pinchend rotatestart rotatemove rotateend doubletap', function(e) {\r\n        switch (e.type) {\r\n            case 'doubletap':\r\n                if (rotation % 360 < 90) {\r\n                    rotation = 90\r\n                } else if (rotation % 360 < 180) {\r\n                    rotation = 180\r\n                } else if (rotation % 360 < 270) {\r\n                    rotation = 270\r\n                } else if (rotation % 360 < 360) {\r\n                    rotation = 360\r\n                }\r\n                break;\r\n            case 'panmove':\r\n                offset_x = last_offset_x + e.deltaX;\r\n                offset_y = last_offset_y + e.deltaY;\r\n                break;\r\n            case 'panend':\r\n                last_offset_x = last_offset_x + e.deltaX;\r\n                last_offset_y = last_offset_y + e.deltaY;\r\n                break;\r\n            case 'pinchmove':\r\n                scale = e.scale * last_scale\r\n                break;\r\n            case 'pinchend':\r\n                scale = e.scale * last_scale;\r\n                last_scale = scale;\r\n                break;\r\n            case 'rotatemove':\r\n                var diff = start_otation - e.rotation;\r\n                rotation = last_rotation - diff;\r\n                break;\r\n            case 'rotatestart':\r\n                last_rotation = rotation;\r\n                start_otation = e.rotation;\r\n                break;\r\n            case 'rotateend':\r\n                last_rotation = rotation;\r\n                break;\r\n        }\r\n        that.preview()\r\n    })\r\n}\r\n\r\nmodule.exports = HammerjsImage\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYW1tZXJqc0ltYWdlLy4vYXBwL21haW4uanM/ZjE2MSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhLG1CQUFPLENBQUMsQ0FBVTtBQUMvQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBIYW1tZXIgPSByZXF1aXJlKCdoYW1tZXJqcycpXHJcbmlmICghSGFtbWVyKSB7IEhhbW1lciA9IHdpbmRvdy5IYW1tZXIgfVxyXG53aW5kb3cuSGFtbWVyanNJbWFnZSA9IGZ1bmN0aW9uIEhhbW1lcmpzSW1hZ2Uob3B0KSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXNcclxuICAgIC8v5aSE55CG55qE5Zu+54mH5YWD57SgXHJcbiAgICB2YXIgaW1nXHJcbiAgICAvL+i/lOWbnueahGNhbnZhc+WFg+e0oFxyXG4gICAgdmFyIGNcclxuICAgIHZhciBvZmZzZXRfeCA9IDBcclxuICAgIHZhciBvZmZzZXRfeSA9IDBcclxuICAgIHZhciBzY2FsZSA9IDFcclxuICAgIHZhciByb3RhdGlvbiA9IDBcclxuICAgIHZhciBsYXN0X29mZnNldF94ID0gMFxyXG4gICAgdmFyIGxhc3Rfb2Zmc2V0X3kgPSAwXHJcbiAgICB2YXIgbGFzdF9zY2FsZSA9IDFcclxuICAgIHZhciBsYXN0X3JvdGF0aW9uID0gMFxyXG4gICAgdmFyIHN0YXJ0X290YXRpb24gPSAwXHJcbiAgICB2YXIgY2FudmFzX2luZm8gPSB7XHJcbiAgICAgICAgd2lkdGg6IDU4MCxcclxuICAgICAgICBoZWlnaHQ6IDg3MFxyXG4gICAgfVxyXG4gICAgdGhpcy56b29tID0gMVxyXG4gICAgdGhpcy5tYXhTY2FsZSA9IGlzTmFOKG9wdC5tYXhTY2FsZSkgPyAzIDogb3B0Lm1heFNjYWxlXHJcbiAgICB0aGlzLm1pblNjYWxlID0gaXNOYU4ob3B0Lm1pblNjYWxlKSA/IDAuNSA6IG9wdC5taW5TY2FsZVxyXG4gICAgaWYgKCEob3B0LmlkIHx8IG9wdC5lbCkpIHtcclxuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcign5rKh5pyJ6ZyA6KaB5peL6L2s55qE5YWD57SgJylcclxuICAgIH1cclxuICAgIHZhciBzcXVhcmUgPSBvcHQuaWQgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdC5pZCkgOiBvcHQuZWw7XHJcbiAgICBzcXVhcmUuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gICAgaWYgKHNxdWFyZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPT09ICcnKSB7XHJcbiAgICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjRkZGRkZGJ1xyXG4gICAgfVxyXG4gICAgc3F1YXJlLm9ubW91c2V3aGVlbCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZS53aGVlbERlbHRhID4gMCkge1xyXG4gICAgICAgICAgICBzY2FsZSA9IHNjYWxlIDwgdGhhdC5tYXhTY2FsZSA/IHNjYWxlICsgMC4xIDogdGhhdC5tYXhTY2FsZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNjYWxlID0gc2NhbGUgPiB0aGF0Lm1pblNjYWxlID8gc2NhbGUgLSAwLjEgOiB0aGF0Lm1pblNjYWxlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoYXQucHJldmlldygpXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFtjaGFuZ2VJbWcg5Yqg6L295Zu+54mH6aKE5aSE55CG5bGF5Lit5pi+56S6XVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBzcmMgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aGlzLmNoYW5nZUltZyA9IGZ1bmN0aW9uKHNyYykge1xyXG4gICAgICAgIGlmIChpbWcpIHsgaW1nLnJlbW92ZSgpIH1cclxuICAgICAgICBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgIGltZy5zdHlsZS5tYXhIZWlnaHQgPSAnMTAwJSdcclxuICAgICAgICBpbWcuc3R5bGUubWF4V2lkdGggPSAnMTAwJSdcclxuICAgICAgICBpbWcuYWxpZ24gPSAnbGVmdCdcclxuICAgICAgICBpbWcub25kcmFnc3RhcnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGF0Lnpvb20gPSB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMud2lkdGhcclxuICAgICAgICAgICAgY2FudmFzX2luZm8ud2lkdGggPSB0aGF0Lnpvb20gKiBzcXVhcmUub2Zmc2V0V2lkdGhcclxuICAgICAgICAgICAgY2FudmFzX2luZm8uaGVpZ2h0ID0gdGhhdC56b29tICogc3F1YXJlLm9mZnNldEhlaWdodFxyXG5cclxuICAgICAgICAgICAgdmFyIG94ID0gKHNxdWFyZS5vZmZzZXRXaWR0aCAvIDIpIC0gKHRoaXMud2lkdGggLyAyKVxyXG4gICAgICAgICAgICB2YXIgb3kgPSAoc3F1YXJlLm9mZnNldEhlaWdodCAvIDIpIC0gKHRoaXMuaGVpZ2h0IC8gMilcclxuXHJcbiAgICAgICAgICAgIHRoYXQuc2V0VHJhbnNsYXRlM2RJbmZvKHtcclxuICAgICAgICAgICAgICAgIG9mZnNldF94OiBveCxcclxuICAgICAgICAgICAgICAgIG9mZnNldF95OiBveSxcclxuICAgICAgICAgICAgICAgIHNjYWxlOiAxLFxyXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDBcclxuICAgICAgICAgICAgfSkucHJldmlldygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGltZy5zcmMgPSBzcmNcclxuICAgICAgICBzcXVhcmUuYXBwZW5kQ2hpbGQoaW1nKVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBbZ2V0VHJhbnNsYXRlM2RJbmZvIOiOt+WPluW9k+WJjeaXi+i9rOe8qeaUvuenu+WKqOWPguaVsF1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldFRyYW5zbGF0ZTNkSW5mbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG9mZnNldF94LFxyXG4gICAgICAgICAgICBvZmZzZXRfeSxcclxuICAgICAgICAgICAgc2NhbGUsXHJcbiAgICAgICAgICAgIHJvdGF0aW9uXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBbc2V0VHJhbnNsYXRlM2RJbmZvIOaJi+WKqOiuvue9ruaXi+i9rOe8qeaUvuenu+WKqO+8jOivpeiuvue9ruS4jeS8muW9seWTjemihOiniO+8jOmcgOimgeiwg+eUqHBlcnZpZXfov5vooYzpooTop4hdXHJcbiAgICAgKiBAcGFyYW0ge1t0eXBlXX0gb3B0IFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgdGhpcy5zZXRUcmFuc2xhdGUzZEluZm8gPSBmdW5jdGlvbihvcHQpIHtcclxuICAgICAgICBpZiAob3B0Lm9mZnNldF94ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2Zmc2V0X3ggPSBvcHQub2Zmc2V0X3hcclxuICAgICAgICAgICAgbGFzdF9vZmZzZXRfeCA9IG9wdC5vZmZzZXRfeFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0Lm9mZnNldF95ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2Zmc2V0X3kgPSBvcHQub2Zmc2V0X3lcclxuICAgICAgICAgICAgbGFzdF9vZmZzZXRfeSA9IG9wdC5vZmZzZXRfeVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0LnNjYWxlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc2NhbGUgPSBvcHQuc2NhbGVcclxuICAgICAgICAgICAgbGFzdF9zY2FsZSA9IG9wdC5zY2FsZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0LnJvdGF0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcm90YXRpb24gPSBvcHQucm90YXRpb25cclxuICAgICAgICAgICAgbGFzdF9yb3RhdGlvbiA9IG9wdC5yb3RhdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhhdFxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBbZ2V0QmFzZTY0IOi/lOWbnuWbvueJh+aXi+i9rOe8qeaUvuenu+WKqOWQjueahGJhc2U2NOaVsOaNrl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldEJhc2U2NCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGF0LnRyYW5zbGF0ZTNkKCkudG9EYXRhVVJMKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFtwcmV2aWV3IOmihOiniOmAieaLqee8qeaUvuenu+WKqOWQjueahOWbvueJh++8jOS4jei/m+ihjGNhbnZhc+eUn+aIkF1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aGlzLnByZXZpZXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoc2NhbGUgPiB0aGF0Lm1heFNjYWxlKSB7XHJcbiAgICAgICAgICAgIHNjYWxlID0gdGhhdC5tYXhTY2FsZVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc2NhbGUgPCB0aGF0Lm1pblNjYWxlKSB7XHJcbiAgICAgICAgICAgIHNjYWxlID0gdGhhdC5taW5TY2FsZVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIG9mZnNldF94ICsgXCJweCxcIiArIG9mZnNldF95ICsgXCJweCwwKVwiICsgXCJzY2FsZTNkKFwiICsgc2NhbGUgKyBcIixcIiArIHNjYWxlICsgXCIsMSlcIiArIFwicm90YXRlKFwiICsgcm90YXRpb24gKyBcImRlZylcIjtcclxuICAgICAgICBpbWcuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG4gICAgICAgIHRoYXQub25QcmV2aWV3Q2hhbmdlKHRoYXQsIHtcclxuICAgICAgICAgICAgb2Zmc2V0X3gsXHJcbiAgICAgICAgICAgIG9mZnNldF95LFxyXG4gICAgICAgICAgICBzY2FsZSxcclxuICAgICAgICAgICAgcm90YXRpb25cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25QcmV2aWV3Q2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5blm77niYfml4vovaznvKnmlL7np7vliqjlkI7nmoRjYW52YXNcclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aGlzLnRyYW5zbGF0ZTNkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGMpIHsgYy5yZW1vdmUoKSB9XHJcbiAgICAgICAgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXHJcbiAgICAgICAgYy5oZWlnaHQgPSBjYW52YXNfaW5mby5oZWlnaHQ7XHJcbiAgICAgICAgYy53aWR0aCA9IGNhbnZhc19pbmZvLndpZHRoO1xyXG4gICAgICAgIHZhciBjdHggPSBjLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKGltZy5uYXR1cmFsV2lkdGggKiAoMSAtIHNjYWxlKSAvIDIsIGltZy5uYXR1cmFsSGVpZ2h0ICogKDEgLSBzY2FsZSkgLyAyKVxyXG4gICAgICAgIGN0eC50cmFuc2xhdGUob2Zmc2V0X3ggKiB0aGF0Lnpvb20sIG9mZnNldF95ICogdGhhdC56b29tKVxyXG4gICAgICAgIHZhciB4ID0gKGltZy5uYXR1cmFsSGVpZ2h0ICogTWF0aC5zaW4ocm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKSAtIChpbWcubmF0dXJhbEhlaWdodCAqIE1hdGguc2luKHJvdGF0aW9uICogTWF0aC5QSSAvIDE4MCkgKyBpbWcubmF0dXJhbFdpZHRoICogTWF0aC5jb3Mocm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKSAtIGltZy5uYXR1cmFsV2lkdGgpIC8gMikgKiBzY2FsZVxyXG4gICAgICAgIHZhciB5ID0gLShpbWcubmF0dXJhbFdpZHRoICogTWF0aC5zaW4ocm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKSArIGltZy5uYXR1cmFsSGVpZ2h0ICogTWF0aC5jb3Mocm90YXRpb24gKiBNYXRoLlBJIC8gMTgwKSAtIGltZy5uYXR1cmFsSGVpZ2h0KSAvIDIgKiBzY2FsZVxyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoeCwgeSlcclxuICAgICAgICBjdHgucm90YXRlKHJvdGF0aW9uICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgY3R4LnNjYWxlKHNjYWxlLCBzY2FsZSlcclxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMClcclxuICAgICAgICByZXR1cm4gY1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbliqDovb3lm77niYdcclxuICAgICAqL1xyXG4gICAgdGhpcy5jaGFuZ2VJbWcob3B0LmltZylcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMlmhhbW1lcue7keWummhhbW1lcizmk43kvZzljLrln5/vvIzlm77niYfkuYvpl7TnmoTlhbPns7tcclxuICAgICAqL1xyXG4gICAgdmFyIGhhbW1lcnRpbWUgPSBuZXcgSGFtbWVyLk1hbmFnZXIoc3F1YXJlKVxyXG4gICAgdmFyIFBhbiA9IG5ldyBIYW1tZXIuUGFuKCk7XHJcbiAgICB2YXIgUm90YXRlID0gbmV3IEhhbW1lci5Sb3RhdGUoKTtcclxuICAgIHZhciBQaW5jaCA9IG5ldyBIYW1tZXIuUGluY2goKTtcclxuICAgIHZhciBEb3VibGVUYXAgPSBuZXcgSGFtbWVyLlRhcCh7XHJcbiAgICAgICAgZXZlbnQ6ICdkb3VibGV0YXAnLFxyXG4gICAgICAgIHRhcHM6IDJcclxuICAgIH0pO1xyXG4gICAgUm90YXRlLnJlY29nbml6ZVdpdGgoW1Bhbl0pO1xyXG4gICAgUGluY2gucmVjb2duaXplV2l0aChbUm90YXRlLCBQYW5dKTtcclxuICAgIGhhbW1lcnRpbWUuYWRkKFtQYW4sIFBpbmNoLCBSb3RhdGUsIERvdWJsZVRhcF0pO1xyXG4gICAgaGFtbWVydGltZS5vbignbW91c2V3aGVlbCBwYW5tb3ZlIHBhbmVuZCBwaW5jaG1vdmUgcGluY2hlbmQgcm90YXRlc3RhcnQgcm90YXRlbW92ZSByb3RhdGVlbmQgZG91YmxldGFwJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHN3aXRjaCAoZS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2RvdWJsZXRhcCc6XHJcbiAgICAgICAgICAgICAgICBpZiAocm90YXRpb24gJSAzNjAgPCA5MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uID0gOTBcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm90YXRpb24gJSAzNjAgPCAxODApIHtcclxuICAgICAgICAgICAgICAgICAgICByb3RhdGlvbiA9IDE4MFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3RhdGlvbiAlIDM2MCA8IDI3MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uID0gMjcwXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvdGF0aW9uICUgMzYwIDwgMzYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm90YXRpb24gPSAzNjBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdwYW5tb3ZlJzpcclxuICAgICAgICAgICAgICAgIG9mZnNldF94ID0gbGFzdF9vZmZzZXRfeCArIGUuZGVsdGFYO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0X3kgPSBsYXN0X29mZnNldF95ICsgZS5kZWx0YVk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncGFuZW5kJzpcclxuICAgICAgICAgICAgICAgIGxhc3Rfb2Zmc2V0X3ggPSBsYXN0X29mZnNldF94ICsgZS5kZWx0YVg7XHJcbiAgICAgICAgICAgICAgICBsYXN0X29mZnNldF95ID0gbGFzdF9vZmZzZXRfeSArIGUuZGVsdGFZO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3BpbmNobW92ZSc6XHJcbiAgICAgICAgICAgICAgICBzY2FsZSA9IGUuc2NhbGUgKiBsYXN0X3NjYWxlXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncGluY2hlbmQnOlxyXG4gICAgICAgICAgICAgICAgc2NhbGUgPSBlLnNjYWxlICogbGFzdF9zY2FsZTtcclxuICAgICAgICAgICAgICAgIGxhc3Rfc2NhbGUgPSBzY2FsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdyb3RhdGVtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHZhciBkaWZmID0gc3RhcnRfb3RhdGlvbiAtIGUucm90YXRpb247XHJcbiAgICAgICAgICAgICAgICByb3RhdGlvbiA9IGxhc3Rfcm90YXRpb24gLSBkaWZmO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZXN0YXJ0JzpcclxuICAgICAgICAgICAgICAgIGxhc3Rfcm90YXRpb24gPSByb3RhdGlvbjtcclxuICAgICAgICAgICAgICAgIHN0YXJ0X290YXRpb24gPSBlLnJvdGF0aW9uO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JvdGF0ZWVuZCc6XHJcbiAgICAgICAgICAgICAgICBsYXN0X3JvdGF0aW9uID0gcm90YXRpb247XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhhdC5wcmV2aWV3KClcclxuICAgIH0pXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFtbWVyanNJbWFnZVxyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n")},function(module,exports){eval("module.exports = __WEBPACK_EXTERNAL_MODULE__1__;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYW1tZXJqc0ltYWdlL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJoYW1tZXJqc1wiLFwiY29tbW9uanMyXCI6XCJoYW1tZXJqc1wiLFwiYW1kXCI6XCJoYW1tZXJqc1wiLFwicm9vdFwiOlwiSGFtbWVyXCJ9PzAwNzUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fMV9fOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1\n")}])});