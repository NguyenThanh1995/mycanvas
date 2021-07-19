const requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
        return setTimeout(callback, 100 / 6);
    };
const cancelAnimationFrame = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    function (timeoutId) {
        clearTimeout(timeoutId);
    };
const isTouch = "ontouchstart" in window || "onmsgesturechange" in window;
let supportPassive = false;
function noop() { }
try {
    let opts = Object.defineProperty({}, "passive", {
        get() {
            supportPassive = true;
            return false;
        },
    });
    window.addEventListener("testPassive", noop, opts);
    window.removeEventListener("testPassive", noop, opts);
}
catch {
    supportPassive = false;
}
const passive = supportPassive;
const windowSize = {
    windowWidth: {
        get: () => window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth,
    },
    windowHeight: {
        get: () => window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight,
    },
};
function trim(string) {
    if (string == null) {
        return "null";
    }
    else {
        return string.replace(/^\s+|\s+$/g, "");
    }
}
function fontToArray(font) {
    const _font = font.split(" ");
    if (_font.length === 2) {
        return {
            size: parseFloat(_font[0]),
            family: trim(_font[1]),
            weight: "normal",
        };
    }
    return {
        size: parseFloat(_font[1]),
        family: trim(_font[2]),
        weight: trim(_font[0]),
    };
}
function AutoToPx(string, fi, fontSize) {
    if (typeof string === "string") {
        string = trim(string);
        const number = parseFloat(string);
        const dp = string.match(/[a-z%]+$/i)?.[1] || "px";
        switch (dp) {
            case "px":
                return number;
            case "em":
                return (fontSize || 0) * number;
            case "rem":
                return (fontSize || 0) * 16;
            case "vw":
                return (windowSize.windowWidth.get() * number) / 100;
            case "vh":
                return (windowSize.windowHeight.get() * number) / 100;
            case "vmin":
                return ((Math.min(windowSize.windowWidth.get(), windowSize.windowHeight.get()) *
                    number) /
                    100);
            case "vmax":
                return ((Math.max(windowSize.windowWidth.get(), windowSize.windowHeight.get()) *
                    number) /
                    100);
            case "%":
                return (fi / 100) * number;
            default:
                return number;
        }
    }
    else {
        return string;
    }
}
function getTouchInfo(element, touches) {
    const rect = element.getBoundingClientRect();
    const sx = element.scrollWidth / element.width || 1;
    const sy = element.scrollHeight / element.height || 1;
    const _touches = [], length = touches.length;
    let i = 0, touch;
    while (i < length) {
        touch = touches[i++];
        _touches.push({
            x: (touch.clientX - rect.left) / sx,
            y: (touch.clientY - rect.top) / sy,
            winX: touch.clientX,
            winY: touch.clientY,
            id: touch.identifier,
        });
    }
    return _touches;
}
/**
 * @return {boolean}
 */
function isMobile() {
    const agent = typeof navigator === "undefined"
        ? ""
        : navigator.userAgent || navigator.vendor;
    /// code from https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(agent.substr(0, 4)));
}
function extractNumber(value) {
    if (typeof value === "number") {
        return value;
    }
    return parseFloat(`${value}`);
}
function bindEvent(name, callback, element) {
    element.addEventListener(name, callback);
    return () => {
        element.removeEventListener(name, callback);
    };
}

class MyElement {
    /**
     * @param {fCanvas} canvas?
     * @return {any}
     */
    constructor(canvas) {
        this._id = MyElement._count++;
        this._els = Object.create(null);
        this._idActiveNow = -1;
        this._queue = [];
        if (!(canvas instanceof fCanvas)) {
            canvas = noopFCanvas;
        }
        this.__addEl(canvas);
    }
    get type() {
        if ("x" in this && "y" in this) {
            if ("width" in this && "height" in this) {
                return "rect";
            }
            if ("radius" in this) {
                return "circle";
            }
            return "point";
        }
        return "unknown";
    }
    get id() {
        return this._id;
    }
    __addEl(canvas) {
        if (canvas.id in this._els === false) {
            this._els[canvas.id] = {
                canvas,
                setuped: false,
            };
        }
    }
    _run(canvas) {
        this.__addEl(canvas);
        this._idActiveNow = canvas.id;
        if (typeof this.setup === "function" &&
            this._els[this._idActiveNow].setuped === false) {
            const result = this.setup();
            if (result !== null && typeof result === "object") {
                for (const prop in result) {
                    this[prop] = result[prop];
                }
            }
            this._els[this._idActiveNow].setuped = true;
        }
        if (typeof this.update === "function") {
            if (typeof this.draw === "function") {
                this.draw();
            }
            this.update();
        }
        else if (typeof this.draw === "function") {
            this.draw();
        }
        if (this._queue.length > 0) {
            const { length } = this._queue;
            let index = 0;
            while (index < length) {
                this.run(this._queue[index]);
                index++;
            }
        }
        this._idActiveNow = -1;
    }
    /**
     * @param {MyElement} element
     * @return {void}
     */
    add(...elements) {
        this._queue.push(...elements);
    }
    /**
     * @param {MyElement} element
     * @return {void}
     */
    run(element) {
        this.$parent.run(element);
    }
    /**
     * @return {fCanvas}
     */
    get $parent() {
        const canvas = this._els[this._idActiveNow === -1 ? 0 : this._idActiveNow];
        if (canvas?.canvas instanceof fCanvas) {
            return canvas.canvas;
        }
        else {
            console.warn("fCanvas: The current referenced version of the fCanvas.run function is incorrect.");
            return this._els[0].canvas;
        }
    }
    /**
     * @return {CanvasRenderingContext2D}
     */
    get $context2d() {
        return this.$parent.$context2d;
    }
    /**
     * @param {number} angle
     * @return {number}
     */
    sin(angle) {
        return this.$parent.sin(angle);
    }
    /**
     * @param {number} sin
     * @return {number}
     */
    asin(sin) {
        return this.$parent.asin(sin);
    }
    /**
     * @param {number} angle
     * @return {number}
     */
    cos(angle) {
        return this.$parent.cos(angle);
    }
    /**
     * @param {number} cos
     * @return {number}
     */
    acos(cos) {
        return this.$parent.asin(cos);
    }
    /**
     * @param {number} angle
     * @return {number}
     */
    tan(angle) {
        return this.$parent.tan(angle);
    }
    /**
     * @param {number} tan
     * @return {number}
     */
    atan(tan) {
        return this.$parent.atan(tan);
    }
    /**
     * @param {number} y
     * @param {number} x
     * @return {number}
     */
    atan2(y, x) {
        return this.$parent.atan2(y, x);
    }
    /**
     * @return {number | null}
     */
    get mouseX() {
        return this.$parent.mouseX;
    }
    /**
     * @return {number | null}
     */
    get mouseY() {
        return this.$parent.mouseY;
    }
    /**
     * @return {numbe}
     */
    get movedX() {
        return this.$parent.movedX;
    }
    /**
     * @return {numbe}
     */
    get movedY() {
        return this.$parent.movedY;
    }
    /**
     * @return {numbe}
     */
    get pmouseX() {
        return this.$parent.pmouseX;
    }
    /**
     * @return {numbe}
     */
    get pmouseY() {
        return this.$parent.pmouseY;
    }
    /**
     * @return {boolean}
     */
    get mouseIsPressed() {
        return this.$parent.mouseIsPressed;
    }
    /**
     * @return {number}
     */
    get windowWidth() {
        return this.$parent.windowWidth;
    }
    /**
     * @return {number}
     */
    get windowHeight() {
        return this.$parent.windowHeight;
    }
    /**
     * @param  {number} red?
     * @param  {number} green?
     * @param  {number} blue?
     * @param  {number} alpha=1
     * @returns {this}
     */
    fill(...args) {
        this.$context2d.fillStyle = this.$parent._toRgb(args);
        this.$context2d.fill();
        return this;
    }
    /**
     * @param  {number} red?
     * @param  {number} green?
     * @param  {number} blue?
     * @param  {number} alpha=1
     * @returns {this}
     */
    stroke(...args) {
        this.$context2d.strokeStyle = this.$parent._toRgb(args);
        this.$context2d.stroke();
        return this;
    }
    /**
     * @return {this}
     */
    noFill() {
        return this.fill(0, 0, 0, 0);
    }
    /**
     * @param {number} value?
     * @return {number|this}
     */
    lineWidth(value) {
        if (value === undefined) {
            return this.$context2d.lineWidth;
        }
        this.$context2d.lineWidth = this.$parent._getPixel(value);
        return this;
    }
    /**
     * @param {number} value?
     * @return {number|this}
     */
    miterLimit(value) {
        if (value === undefined) {
            return this.$context2d.miterLimit;
        }
        this.lineJoin("miter");
        this.$context2d.miterLimit = value;
        return this;
    }
    /**
     * @param {number} x?
     * @param {number} y?
     * @return {this|Offset}
     */
    shadowOffset(x, y) {
        if (arguments.length === 0) {
            return {
                x: this.$context2d.shadowOffsetX,
                y: this.$context2d.shadowOffsetY,
            };
        }
        [this.$context2d.shadowOffsetX, this.$context2d.shadowOffsetY] = [
            this.$parent._getPixel(x || 0),
            this.$parent._getPixel(y || 0),
        ];
        return this;
    }
    /**
     * @param {string} text
     * @return {number}
     */
    measureText(text) {
        return this.$parent.measureText(text);
    }
    /**
     * @return {this}
     */
    begin() {
        this.$context2d.beginPath();
        return this;
    }
    /**
     * @return {this}
     */
    close() {
        this.$context2d.closePath();
        return this;
    }
    /**
     * @return {this}
     */
    save() {
        this.$parent.save();
        return this;
    }
    /**
     * @return {this}
     */
    restore() {
        this.$parent.restore();
        return this;
    }
    /**
     * @param {number} angle?
     * @return {number | this}
     */
    rotate(angle) {
        if (angle === undefined) {
            return this.$parent.rotate();
        }
        this.$parent.rotate(angle);
        return this;
    }
    /**
     * @param {number} x?
     * @param {number} y?
     * @return {offset|this}
     */
    translate(x, y) {
        if (arguments.length === 0) {
            return this.$parent.translate();
        }
        this.$parent.translate(x, y);
        return this;
    }
    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @param  {number} astart
     * @param  {number} astop
     * @param  {boolean} reverse?
     * @returns this
     */
    arc(x, y, radius, astart, astop, reverse) {
        this.begin();
        this.$context2d.arc(this.$parent._getPixel(x), this.$parent._getPixel(y), radius, this.$parent._toRadius(astart) - Math.PI / 2, this.$parent._toRadius(astop) - Math.PI / 2, reverse);
        this.close();
        return this;
    }
    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @param  {number} astart
     * @param  {number} astop
     * @param  {boolean} reverse?
     * @returns {this}
     */
    pie(x, y, radius, astart, astop, reverse) {
        return this.move(x, y).arc(x, y, radius, astart, astop, reverse).to(x, y);
    }
    /**
     * @param  {number} x1
     * @param  {number} y1
     * @param  {number} x2
     * @param  {number} y2
     * @returns {this}
     */
    line(x1, y1, x2, y2) {
        // this.begin();
        return this.move(x1, y1).to(x2, y2);
        // this.close();fix
    }
    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius1
     * @param  {number} radius2
     * @param  {number} astart
     * @param  {number} astop
     * @param  {number} reverse
     * @returns {this}
     */
    ellipse(x, y, radius1, radius2, astart, astop, reverse) {
        this.begin();
        this.$context2d.ellipse(this.$parent._getPixel(x), this.$parent._getPixel(y), radius1, radius2, this.$parent._toRadius(astart) - Math.PI / 2, this.$parent._toRadius(astop), reverse);
        this.close();
        return this;
    }
    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} radius
     * @returns {this}
     */
    circle(x, y, radius) {
        return this.arc(x, y, radius, 0, this.$parent.angleMode() === "degress" ? 360 : Math.PI * 2);
    }
    /**
     * @param  {number} x
     * @param  {number} y
     * @returns {this}
     */
    point(x, y) {
        return this.circle(x, y, 1);
    }
    /**
     * @param  {number} x1
     * @param  {number} y1
     * @param  {number} x2
     * @param  {number} y2
     * @param  {number} x3
     * @param  {number} y3
     * @returns {this}
     */
    triange(x1, y1, x2, y2, x3, y3) {
        return this.move(x1, y1).to(x2, y2).to(x3, y3);
    }
    /**
     * @param  {CanvasImageSource} image
     * @param  {number} sx?
     * @param  {number} sy?
     * @param  {number} swidth?
     * @param  {number} sheight?
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @returns {this}
     */
    drawImage(image, ...args) {
        // @ts-expect-error
        this.$context2d.drawImage(image, ...args);
        return this;
    }
    rRect(x, y, w, h, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft) {
        this.begin();
        [x, y, w, h] = this.$parent._argsRect(x, y, w, h);
        const fontSize = this.$parent.fontSize();
        const arc = [
            AutoToPx(radiusTopLeft || 0, w, fontSize),
            AutoToPx(radiusTopRight || 0, h, fontSize),
            AutoToPx(radiusBottomRight || 0, w, fontSize),
            AutoToPx(radiusBottomLeft || 0, h, fontSize),
        ];
        this.move(x, y)
            .arcTo(x + w, y, x + w, y + h - arc[1], arc[1])
            .arcTo(x + w, y + h, x + w - arc[2], y + h, arc[2])
            .arcTo(x, y + h, x, y + h - arc[3], arc[3])
            .arcTo(x, y, x + w - arc[0], y, arc[0]);
        this.close();
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @memberof MyElement
     * @returns {this}
     */
    rect(x, y, width, height) {
        this.begin();
        [x, y, width, height] = this.$parent._argsRect(x, y, width, height);
        this.$context2d.rect(this.$parent._getPixel(x), this.$parent._getPixel(y), width, height);
        this.close();
        return this;
    }
    /**
     * @param  {number} cpx
     * @param  {number} cpy
     * @param  {number} x
     * @param  {number} y
     * @return {this}
     */
    quadratic(cpx, cpy, x, y) {
        this.$context2d.quadraticCurveTo(cpx, cpy, x, y);
        return this;
    }
    /**
     * @param {number} cp1x
     * @param {number} cp1y
     * @param {number} cp2x
     * @param {number} cp2y
     * @param {number} x
     * @param {number} y
     * @return {this}
     */
    bezier(cp1x, cp1y, cp2x, cp2y, x, y) {
        this.$context2d.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @return {this}
     */
    move(x, y) {
        this.$context2d.moveTo(this.$parent._getPixel(x), this.$parent._getPixel(y));
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @return {this}
     */
    to(x, y) {
        this.$context2d.lineTo(this.$parent._getPixel(x), this.$parent._getPixel(y));
        return this;
    }
    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} maxWidth?
     * @return {this}
     */
    fillText(text, x, y, maxWidth) {
        this.$context2d.fillText(text, this.$parent._getPixel(x), this.$parent._getPixel(y), maxWidth);
        return this;
    }
    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} maxWidth?
     * @return {this}
     */
    strokeText(text, x, y, maxWidth) {
        this.$context2d.strokeText(text, this.$parent._getPixel(x), this.$parent._getPixel(y), maxWidth);
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {this}
     */
    fillRect(x, y, width, height) {
        this.$context2d.fillRect(this.$parent._getPixel(x), this.$parent._getPixel(y), width, height);
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {this}
     */
    strokeRect(x, y, width, height) {
        this.$context2d.strokeRect(this.$parent._getPixel(x), this.$parent._getPixel(y), width, height);
        return this;
    }
    /**
     * @param {number} value?
     * @return {this|number}
     */
    lineDashOffset(value) {
        if (value === undefined) {
            return this.$context2d.lineDashOffset;
        }
        this.$context2d.lineDashOffset = value;
        return this;
    }
    lineDash(...segments) {
        if (segments.length === 0) {
            return this.$context2d.getLineDash();
        }
        if (Array.isArray(segments[0])) {
            this.$context2d.setLineDash(segments[0]);
        }
        this.$context2d.setLineDash(segments);
        return this;
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} radius
     * @return {this}
     */
    arcTo(x1, y1, x2, y2, radius) {
        this.$context2d.arcTo(this.$parent._getPixel(x1), this.$parent._getPixel(y1), this.$parent._getPixel(x2), this.$parent._getPixel(y2), radius);
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPoint(x, y) {
        return this.$context2d.isPointInPath(x, y);
    }
    createImageData(width, height) {
        return height
            ? this.$parent.createImageData(width, height)
            : this.$parent.createImageData(width);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {ImageData}
     */
    getImageData(x, y, width, height) {
        return this.$parent.getImageData(x, y, width, height);
    }
    /**
     * @param {ImageData} imageData
     * @param {number} x
     * @param {number} y
     * @param {number} xs?
     * @param {number} ys?
     * @param {number} width?
     * @param {number} height?
     * @return {this}
     */
    putImageData(imageData, x, y, xs, ys, width, height) {
        if (arguments.length === 7) {
            this.$parent.putImageData(imageData, x, y, xs, ys, width, height);
        }
        else {
            this.$parent.putImageData(imageData, x, y);
        }
        return this;
    }
    /**
     * @param {CanvasImageSource} image
     * @param {"repeat"|"repeat-x"|"repeat-y"|"no-repeat"} direction
     * @return {CanvasPattern | null}
     */
    createPattern(image, direction) {
        return this.$parent.createPattern(image, direction);
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} r1
     * @param {number} x2
     * @param {number} y2
     * @param {number} r2
     * @return {CanvasGradient}
     */
    createRadialGradient(x1, y1, r1, x2, y2, r2) {
        return this.$parent.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {CanvasGradient}
     */
    createLinearGradient(x, y, width, height) {
        return this.$parent.createLinearGradient(x, y, width, height);
    }
    /**
     * @param {"bevel"|"round"|"miter"} type?
     * @return {LineJoin|this}
     */
    lineJoin(type) {
        if (type === undefined) {
            return this.$context2d.lineJoin;
        }
        this.$context2d.lineJoin = type;
        return this;
    }
    /**
     * @param {"butt"|"round"|"square"} value?
     * @return {LineCap|this}
     */
    lineCap(value) {
        if (value === undefined) {
            return this.$context2d.lineCap;
        }
        this.$context2d.lineCap = value;
        return this;
    }
    /**
     * @param {number} opacity?
     * @return {number|this}
     */
    shadowBlur(opacity) {
        if (opacity === undefined) {
            return this.$context2d.shadowBlur;
        }
        this.$context2d.shadowBlur = opacity;
        return this;
    }
    /**
     * @param {any[]} ...args
     * @return {this}
     */
    shadowColor(...args) {
        this.$context2d.shadowColor = this.$parent._toRgb(args);
        return this;
    }
    drawFocusIfNeeded(path, element) {
        if (element === undefined) {
            this.$context2d.drawFocusIfNeeded(path);
        }
        else {
            this.$context2d.drawFocusIfNeeded(path, element);
        }
        return this;
    }
    polyline(...points) {
        if (points.length > 0) {
            if (Array.isArray(points[0])) {
                this.move(points[0][0], points[0][1]);
                let index = 1;
                const { length } = points;
                while (index < length) {
                    this.to(points[index][0], points[index][1]);
                    index++;
                }
            }
            else {
                if (points.length > 1) {
                    this.move(points[0], points[1]);
                    let index = 2;
                    const { length } = points;
                    while (index < length - 1) {
                        this.to(points[index], points[index + 1]);
                        index += 2;
                    }
                }
            }
        }
        return this;
    }
    polygon(...points) {
        if (Array.isArray(points[0])) {
            this.polyline(...points, points[0]);
        }
        else {
            this.polyline(...points, points[0], points[1]);
        }
        return this;
    }
}
MyElement._count = 0;
class Point3D extends MyElement {
    /**
     * @param {number} x?
     * @param {number} y?
     * @param {number} z?
     * @return {any}
     */
    constructor(x, y, z) {
        super();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        [this.x, this.y, this.z] = [x || 0, y || 0, z || 0];
    }
    /**
     * @param {number} angle
     * @return {void}
     */
    rotateX(angle) {
        this.y =
            this.y * this.$parent.cos(angle) + this.z * this.$parent.sin(angle);
        this.z =
            -this.y * this.$parent.sin(angle) + this.z * this.$parent.cos(angle);
    }
    /**
     * @param {number} angle
     * @return {void}
     */
    rotateY(angle) {
        this.x =
            this.x * this.$parent.cos(angle) + this.z * this.$parent.sin(angle);
        this.z =
            -this.x * this.$parent.sin(angle) + this.z * this.$parent.cos(angle);
    }
    /**
     * @param {number} angle
     * @return {void}
     */
    rotateZ(angle) {
        this.x =
            this.x * this.$parent.cos(angle) - this.y * this.$parent.sin(angle);
        this.y =
            this.x * this.$parent.sin(angle) + this.y * this.$parent.cos(angle);
    }
}
class Point3DCenter extends MyElement {
    /**
     * @param {number} x?
     * @param {number} y?
     * @param {number} z?
     * @return {any}
     */
    constructor(x, y, z) {
        super();
        this.__z = 0;
        [this.__x, this.__y, this.__z] = [x, y, z || 0];
    }
    get scale() {
        return Point3DCenter.persistent / (Point3DCenter.persistent + this.__z);
    }
    get x() {
        return ((this.__x - this.$parent.width / 2) * this.scale + this.$parent.width / 2);
    }
    set x(value) {
        this.__x = value;
    }
    get y() {
        return ((this.__y - this.$parent.height / 2) * this.scale +
            this.$parent.height / 2);
    }
    set y(value) {
        this.__y = value;
    }
    get z() {
        return this.__z;
    }
    set z(value) {
        this.__z = value;
    }
    get(prop) {
        if (typeof prop === "number") {
            return this.scale * prop;
        }
        return this.scale * this[prop];
    }
}
Point3DCenter.persistent = 1000;
function createElement(callback) {
    return new (class extends MyElement {
        constructor() {
            super(...arguments);
            this.draw = () => {
                callback(this);
            };
        }
    })();
}

class Emitter {
    constructor() {
        this.__events = Object.create(null);
    }
    /**
     * @param {any} typeofcallback==="function"
     * @return {any}
     */
    on(name, callback) {
        if (typeof callback === "function") {
            if (name in this.__events) {
                this.__events[name].push(callback);
            }
            else {
                this.__events[name] = [callback];
            }
        }
        return () => {
            this.off(name, callback);
        };
    }
    /**
     * @param {string} name
     * @param {CallbackEvent} callback?
     * @return {void}
     */
    off(name, callback) {
        if (typeof callback === "function") {
            this.__events[name] = this.__events[name].filter((item) => item !== callback);
            if (this.__events[name].length === 0) {
                delete this.__events[name];
            }
        }
        else {
            delete this.__events[name];
        }
        /**
         * @param {string} name
         * @param {any[]} ...payload
         * @return {void}
         */
        /**
         * @param {string} name
         * @param {any[]} ...payload
         * @return {void}
         */
    }
    /**
     * @param {string} name
     * @param {any[]} ...payload
     * @return {void}
     */
    emit(name, ...payload) {
        if (name in this.__events) {
            for (let index = 0, length = this.__events[name].length; index < length; index++) {
                this.__events[name][index](...payload);
            }
        }
    }
    /**
     * @param {string} name
     * @param {CallbackEvent} callback
     * @return {void}
     */
    once(name, callback) {
        const handler = (...args) => {
            callback(...args);
            this.off(name, handler);
        };
        this.on(name, handler);
    }
}

function reactiveDefine(value, callback, parent = []) {
    if (value !== null && typeof value === "object") {
        /// reactive children
        if (Array.isArray(value)) {
            /// bind to propertyes
            /// reactive method array
            if (!value.__reactive) {
                ["push", "pop", "shift", "unshift", "splice"].forEach((name) => {
                    const proto = value[name];
                    Object.defineProperty(value, name, {
                        writable: false,
                        enumerable: false,
                        configurable: true,
                        value() {
                            const newValue = proto.apply(this, arguments);
                            callback([...parent], this, newValue);
                            return newValue;
                        },
                    });
                });
                Object.defineProperty(value, "__reactive", {
                    writable: false,
                    enumerable: false,
                    configurable: true,
                    value: true,
                });
            }
            ////
            value.forEach((item, index) => {
                if (item !== null && typeof item === "object") {
                    reactiveDefine(item, callback, [...parent, index + ""]);
                }
            });
        }
        else {
            //// if object ===> reactive attribute
            /// create __store if not exists
            /// reactive social
            if (!value.__reactive) {
                Object.defineProperty(value, "__store", {
                    writable: true,
                    enumerable: false,
                    configurable: true,
                    value: { ...value },
                });
                Object.defineProperty(value, "__reactive", {
                    writable: false,
                    enumerable: false,
                    configurable: true,
                    value: true,
                });
            }
            else {
                value.__store = { ...value };
            }
            for (const key in value) {
                Object.defineProperty(value, key, {
                    get() {
                        return value.__store?.[key];
                    },
                    enumerable: true,
                    set(newValue) {
                        const old = value.__store?.[key];
                        if (value.__store) {
                            value.__store[key] = newValue;
                        }
                        if (newValue !== old) {
                            reactiveDefine(newValue, callback, [...parent, key]);
                            callback([...parent, key], old, newValue);
                        }
                    },
                });
                reactiveDefine(value[key], callback, [...parent, key]);
            }
        }
    }
}
class Store {
    /**
     * @param {Object} store?
     * @return {any}
     */
    constructor(store) {
        this.__emitter = new Emitter();
        for (const key in store) {
            this[key] = store[key];
        }
        reactiveDefine(this, (paths, oldVal, newVal) => {
            this.__emitter.emit(paths.join("."), oldVal, newVal);
        });
    }
    /**
     * @param {Store|Object} object
     * @param {string} key
     * @param {any} value
     * @return {void}
     */
    $set(object, key, value) {
        if (!(key in object)) {
            //reactive
            object[key] = undefined;
            reactiveDefine(object, (paths, oldVal, newVal) => {
                this.__emitter.emit(paths.join("."), oldVal, newVal);
            });
        }
        object[key] = value;
    }
    /**
     * @param {string} key
     * @param {CallbackEvent} callback
     * @return {any}
     */
    $watch(key, callback) {
        return this.__emitter.on(key, callback);
    }
}

class Stament {
    constructor() {
        this.__store = new Store();
    }
    /**
     * @param {string} name
     * @param {CallbackEvent} callback
     * @return {void}
     */
    on(name, callback) {
        if (this.__store[name]) {
            callback();
        }
        else {
            const watcher = this.__store.$watch(name, () => {
                callback();
                watcher();
            });
        }
    }
    /**
     * @param {string} name
     * @return {void}
     */
    emit(name) {
        this.__store.$set(this.__store, name, true);
    }
}

let inited = false;
const emitter = new Emitter();
/**
 * @export
 * @param {({
 *   (): Promise<void> | void;
 * })} callback
 * @return {*}  {Promise<void>}
 */
async function setup(callback) {
    if (document.readyState === "complete") {
        //// readyState === "complete"
        await callback();
        inited = true;
        emitter.emit("load");
    }
    else {
        await new Promise((resolve) => {
            function load() {
                document.removeEventListener("DOMContentLoaded", load);
                window.removeEventListener("load", load);
                callback();
                resolve();
                inited = true;
                emitter.emit("load");
            }
            document.addEventListener("DOMContentLoaded", load);
            window.addEventListener("load", load);
        });
    }
}
function __draw(callback, canvas) {
    if (canvas?.allowClear === true) {
        canvas.clear();
    }
    callback();
    if (canvas ? canvas.allowLoop === true : false) {
        const id = requestAnimationFrame(() => {
            __draw(callback, canvas);
        });
        canvas?._setIdFrame(id);
    }
}
/**
 * @param {Function} callback
 * @param {fCanvas} canvas?
 * @return {void}
 */
function draw(callback, canvas) {
    if (inited) {
        void __draw(callback, canvas);
    }
    else {
        void emitter.once("load", () => {
            draw(callback, canvas);
        });
    }
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function keyPressed(callback, element = window) {
    return bindEvent("keydown", callback, element);
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function changeSize(callback, element = window) {
    return bindEvent("resize", callback, element);
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function mouseWheel(callback, element = window) {
    return bindEvent("wheel", callback, element);
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function mousePressed(callback, element = window) {
    return bindEvent("mousedown", callback, element);
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function mouseClicked(callback, element = window) {
    return bindEvent("click", callback, element);
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function mouseMoved(callback, element = window) {
    return bindEvent("mousemove", callback, element);
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function touchStart(callback, element = window) {
    return bindEvent("touchstart", callback, element);
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function touchMove(callback, element = window) {
    return bindEvent("touchmove", callback, element);
}
/**
 * @param {CallbackEvent} callback
 * @param {Window|HTMLElement=window} element
 * @return {noop}
 */
function touchEnd(callback, element = window) {
    return bindEvent("touchend", callback, element);
}

class fCanvas {
    /**
     * @return {any}
     */
    constructor(element, width, height) {
        this._id = fCanvas._count++;
        this._stamentReady = new Stament();
        this.__store = Object.create({
            _context2dCaching: null,
            __translate: Object.create({
                x: 0,
                y: 0,
                sumX: 0,
                sumY: 0,
            }),
            __scale: Object.create({
                x: 0,
                y: 0,
                sumX: 0,
                sumY: 0,
            }),
            __rotate: Object.create({
                now: 0,
                sum: 0,
            }),
            __attributeContext: Object.create({
                alpha: true,
                desynchronized: false,
            }),
            _clear: true,
            _loop: true,
            _preventTouch: false,
            _stopTouch: false,
            _idFrame: null,
            _existsPreload: false,
            _angleMode: "degress",
            _rectMode: "corner",
            _colorMode: "rgb",
            _useFloatPixel: true,
            _pmouseX: 0,
            _pmouseY: 0,
            _realMouseIsPressed: false,
        });
        this._handlerEvent = (event) => {
            try {
                this.__store._pmouseX = this.touches[0]?.x || 0;
                this.__store._pmouseY = this.touches[0]?.y || 0;
                this.touches =
                    event.type !== "mouseout"
                        ? getTouchInfo(this.$el, event.touches || [event])
                        : [];
                this.changedTouches = getTouchInfo(this.$el, event.changedTouches || [event]);
                if (this.__store._preventTouch) {
                    event.preventDefault();
                }
                if (this.__store._stopTouch) {
                    event.stopPropagation();
                }
            }
            catch { }
        };
        this._handlerEventMousePress = (event) => {
            if (event.type === "mousedown") {
                this.__store._realMouseIsPressed = true;
                return;
            }
            if (event.type === "mouseup") {
                this.__store._realMouseIsPressed = false;
                return;
            }
            this.__store._realMouseIsPressed = event?.touches.length > 0;
        };
        this.touches = [];
        this.changedTouches = [];
        /**
         * @param {noop} callback
         * @return {*}  {MyElement}
         */
        this.createElement = createElement;
        if (arguments.length === 1 || arguments.length === 3) {
            if (element instanceof HTMLCanvasElement) {
                this._el = element;
            }
            else {
                const el = document.querySelector(element);
                if (el instanceof HTMLCanvasElement) {
                    this._el = el;
                }
                else {
                    console.warn(`fCanvas: "${element}" is not instanceof HTMLCanvasElement.`);
                    this._el = document.createElement("canvas");
                }
            }
        }
        else {
            this._el = document.createElement("canvas");
        }
        switch (arguments.length) {
            case 2:
                this.size(element || 0, width || 0);
                break;
            case 3:
                this.size(width || 0, height || 0);
                break;
        }
        this._restartEvents(this._el);
    }
    /**
     * @return {HTMLCanvasElement}
     */
    get $el() {
        return this._el;
    }
    /**
     * @param {number} width
     * @param {number} height
     * @memberof fCanvas
     */
    size(width, height) {
        this.$el.width = width;
        this.$el.height = height;
    }
    _cancelEventsSystem(el) {
        [
            "touchstart",
            "mouseover",
            "touchmove",
            "mousemove",
            "touchend",
            "mouseout",
        ].forEach((event) => {
            el.removeEventListener(event, this._handlerEvent);
        });
        [
            // for mouseIsPressed
            "touchstart",
            "mousedown",
            "touchend",
            "mouseup",
        ].forEach((event) => {
            el.removeEventListener(event, this._handlerEventMousePress);
        });
    }
    _restartEvents(el) {
        this._cancelEventsSystem(el);
        el.addEventListener(isMobile() ? "touchstart" : "mouseover", this._handlerEvent, passive
            ? {
                passive: true,
            }
            : undefined);
        el.addEventListener(isMobile() ? "touchmove" : "mousemove", this._handlerEvent, passive
            ? {
                passive: true,
            }
            : undefined);
        el.addEventListener(isMobile() ? "touchend" : "mouseout", this._handlerEvent, passive
            ? {
                passive: true,
            }
            : undefined);
        el.addEventListener(isMobile() ? "touchstart" : "mousedown", this._handlerEventMousePress);
        el.addEventListener(isMobile() ? "touchend" : "mouseup", this._handlerEventMousePress);
    }
    /**
     * @return {*}  {boolean}
     */
    preventTouch() {
        this.__store._preventTouch = true;
    }
    /**
     * @return {*}  {boolean}
     */
    stopTouch() {
        this.__store._stopTouch = true;
    }
    /**
     * @return {number | null}
     */
    get mouseX() {
        return this.touches[0]?.x || null;
    }
    /**
     * @return {number | null}
     */
    get mouseY() {
        return this.touches[0]?.y || null;
    }
    /**
     * @return {numbe}
     */
    get movedX() {
        return this.touches[this.touches.length - 1]?.x || 0;
    }
    /**
     * @return {numbe}
     */
    get movedY() {
        return this.touches[this.touches.length - 1]?.y || 0;
    }
    /**
     * @return {numbe}
     */
    get pmouseX() {
        return this.__store._pmouseX;
    }
    /**
     * @return {numbe}
     */
    get pmouseY() {
        return this.__store._pmouseY;
    }
    /**
     * @return {boolean}
     */
    get mouseIsPressed() {
        return this.__store._realMouseIsPressed;
    }
    /**
     * @return {number}
     */
    get id() {
        return this._id;
    }
    _createNewContext2d() {
        this.__store._context2dCaching = this.$el.getContext("2d", this.__store.__attributeContext);
    }
    /**
     * @return {void}
     */
    blur() {
        this.__store.__attributeContext.alpha = true;
        this._createNewContext2d();
    }
    /**
     * @return {void}
     */
    noBlur() {
        this.__store.__attributeContext.alpha = false;
        this._createNewContext2d();
    }
    /**
     * @return {void}
     */
    desync() {
        this.__store.__attributeContext.desynchronized = true;
        this._createNewContext2d();
    }
    /**
     * @return {void}
     */
    noDesync() {
        this.__store.__attributeContext.desynchronized = false;
        this._createNewContext2d();
    }
    /**
     * @return {void}
     */
    useFloatPixel() {
        this.__store._useFloatPixel = true;
    }
    /**
     * @return {void}
     */
    noFloatPixel() {
        this.__store._useFloatPixel = false;
    }
    _getPixel(value) {
        return this.__store._useFloatPixel ? value : Math.round(value);
    }
    /**
     * @return {CanvasRenderingContext2D}
     */
    get $context2d() {
        if (this.__store._context2dCaching === null) {
            this._createNewContext2d();
        }
        return this.__store._context2dCaching;
    }
    /**
     * @param {HTMLElement=document.body} parent
     * @return {void}
     */
    append(parent = document.body) {
        if (parent.contains(this.$el) === false) {
            parent.appendChild(this.$el);
        }
    }
    /**
     * @param {(HTMLCanvasElement | string)} element
     */
    mount(element) {
        let el;
        if (typeof element === "string") {
            el =
                Array.from(document.querySelectorAll(element)).find((item) => item.tagName === "CANVAS") || this._el;
        }
        else {
            if (element.tagName !== "CANVAS") {
                console.error(`fCanvas<sys>: function .mount() not allow element "${element?.tagName.toLocaleLowerCase()}`);
                el = this._el;
            }
            else {
                el = element;
            }
        }
        if (this._el !== el) {
            this._cancelEventsSystem(this._el);
            this._el = el;
            this._restartEvents(el);
        }
    }
    /**
     * @return {void}
     */
    noClear() {
        this.__store._clear = false;
    }
    /**
     * @return {boolean}
     */
    get allowClear() {
        return this.__store._clear;
    }
    /**
     * @param {MyElement} element
     * @return {void}
     */
    run(...elements) {
        let index = 0;
        const { length } = elements;
        while (index < length) {
            elements[index++]._run(this);
        }
    }
    /**
     * @return {number}
     */
    get width() {
        return this.$el.width;
    }
    /**
     * @param {number} value
     * @return {any}
     */
    set width(value) {
        this.$el.width = value;
    }
    /**
     * @return {number}
     */
    get height() {
        return this.$el.height;
    }
    /**
     * @param {number} value
     * @return {any}
     */
    set height(value) {
        this.$el.height = value;
    }
    /**
     * @return {number}
     */
    get windowWidth() {
        return windowSize.windowWidth.get();
    }
    /**
     * @return {number}
     */
    get windowHeight() {
        return windowSize.windowHeight.get();
    }
    /**
     * @return {void}
     */
    save() {
        this.$context2d.save();
    }
    /**
     * @return {void}
     */
    restore() {
        this.$context2d.restore();
    }
    _toRadius(value) {
        return this.__store._angleMode === "degress"
            ? (value * Math.PI) / 180
            : value;
    }
    _toDegress(value) {
        return this.__store._angleMode === "degress"
            ? (value * 180) / Math.PI
            : value;
    }
    _toRgb([red = 0, green = red, blue = green, alpha = 1]) {
        if (Array.isArray(red)) {
            return this._toRgb(red);
        }
        else {
            if (typeof red === "object" && red !== null) {
                return red;
            }
            if (typeof red === "string") {
                return red;
            }
            else {
                const after = this.__store._colorMode.match(/hsl|hsb/i) ? "%" : "";
                return `${this.__store._colorMode}a(${[
                    red,
                    green + after,
                    blue + after,
                    alpha,
                ].join(",")})`;
            }
        }
    }
    _argsRect(x, y, width, height) {
        switch (this.__store._rectMode) {
            case "center":
                return [x - width / 2, y - height / 2, width, height];
            case "radius":
                return [x - width, y - height, width * 2, height * 2];
            case "corners":
                return [x - width, y - height, width, height];
            case "corner":
            default:
                return [x, y, width, height];
        }
    }
    /**
     * @param {AngleType} value?
     * @return {any}
     */
    angleMode(value) {
        if (value === undefined) {
            return this.__store._angleMode;
        }
        this.__store._angleMode = value;
    }
    /**
     * @param {ColorType} value?
     * @return {any}
     */
    colorMode(value) {
        if (value === undefined) {
            return this.__store._colorMode;
        }
        this.__store._colorMode = value;
    }
    rectMode(value) {
        if (value === undefined) {
            return this.__store._rectMode;
        }
        this.__store._rectMode = value;
    }
    /**
     * @param {number} value?
     * @return {any}
     */
    fontSize(value) {
        const { size, weight, family } = fontToArray(this.font());
        if (value === undefined) {
            return size;
        }
        else {
            value = AutoToPx(value, size, size) || 16;
            this.font([weight, `${value}px`, family].join(" "));
        }
    }
    /**
     * @param {string} value?
     * @return {any}
     */
    fontFamily(value) {
        const { size, weight, family } = fontToArray(this.font());
        if (value === undefined) {
            return family;
        }
        else {
            this.font([weight, `${size}px`, value].join(" "));
        }
    }
    /**
     * @param {string} value?
     * @return {any}
     */
    fontWeight(value) {
        const { size, weight, family } = fontToArray(this.font());
        if (value === undefined) {
            return weight;
        }
        else {
            this.font([value, `${size}px`, family].join(" "));
        }
    }
    /**
     * @param {number=0} x
     * @param {number=0} y
     * @param {number=this.width} w
     * @param {number=this.height} h
     * @return {void}
     */
    clear(x = 0, y = 0, w = this.width, h = this.height) {
        this.$context2d.clearRect(x, y, w, h);
    }
    /**
     * @param {ParamsToRgb} ...params
     * @return {void}
     */
    background(...params) {
        this.$context2d.fillStyle = this._toRgb(params);
        this.$context2d.fill();
        this.$context2d.fillRect(0, 0, this.width, this.height);
    }
    /**
     * @param {CanvasImageSource} image
     * @return {void}
     */
    backgroundImage(image) {
        this.$context2d.drawImage(image, 0, 0, this.width, this.height);
    }
    /**
     * @param {ImageData|number} width
     * @param {number} height?
     * @return {ImageData}
     */
    createImageData(width, height) {
        return height
            ? this.$context2d.createImageData(width, height)
            : this.$context2d.createImageData(width);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {ImageData}
     */
    getImageData(x, y, width, height) {
        return this.$context2d.getImageData(x, y, width, height);
    }
    /**
     * @param {ImageData} imageData
     * @param {number} x
     * @param {number} y
     * @param {number} xs?
     * @param {number} ys?
     * @param {number} width?
     * @param {number} height?
     * @return {void}
     */
    putImageData(imageData, x, y, xs, ys, width, height) {
        if (arguments.length === 7) {
            this.$context2d.putImageData(imageData, x, y, xs, ys, width, height);
        }
        else {
            this.$context2d.putImageData(imageData, x, y);
        }
    }
    /**
     * @param {CanvasImageSource} image
     * @param {"repeat"|"repeat-x"|"repeat-y"|"no-repeat"} direction
     * @return {CanvasPattern | null}
     */
    createPattern(image, direction) {
        return this.$context2d.createPattern(image, direction);
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} r1
     * @param {number} x2
     * @param {number} y2
     * @param {number} r2
     * @return {CanvasGradient}
     */
    createRadialGradient(x1, y1, r1, x2, y2, r2) {
        return this.$context2d.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {CanvasGradient}
     */
    createLinearGradient(x, y, width, height) {
        return this.$context2d.createLinearGradient(x, y, width, height);
    }
    /**
     * @param {any} type="image/png"
     * @param {number} scale?
     * @return {string}
     */
    toDataURL(type = "image/png", scale) {
        return this.$el.toDataURL(type, scale);
    }
    /**
     * @param {number} value?
     * @return {any}
     */
    rotate(value) {
        if (value === undefined) {
            return this.__store.__rotate.now;
        }
        else {
            this.$context2d.rotate((this.__store.__rotate.now = this._toRadius(value)));
            this.__store.__rotate.sum += this.__store.__rotate.now % 360;
        }
    }
    /**
     * @return {void}
     */
    resetRotate() {
        this.rotate(-this.__store.__rotate.sum);
    }
    /**
     * @return {void}
     */
    resetTransform() {
        this.setTransform(1, 0, 0, 1, 0, 0);
    }
    /**
     * @param {Function} callback
     * @return {Promise<void>}
     */
    async preload(callback) {
        this.__store._existsPreload = true;
        await callback();
        this._stamentReady.emit("preloaded");
    }
    /**
     * @param {Function} callback
     * @return {Promise<void>}
     */
    async setup(callback) {
        if (this.__store._existsPreload) {
            this._stamentReady.on("preloaded", async () => {
                await setup(callback);
                this._stamentReady.emit("setuped");
            });
        }
        else {
            await setup(callback);
            this._stamentReady.emit("setuped");
        }
    }
    /**
     * @param {Function} callback
     * @return {void}
     */
    draw(callback) {
        this._stamentReady.on("setuped", () => {
            draw(callback, this);
        });
    }
    /**
     * @param {string} value?
     * @return {any}
     */
    font(value) {
        if (value === undefined) {
            return this.$context2d.font;
        }
        this.$context2d.font = value;
    }
    /**
     * @param {TextAlignType} value?
     * @return {any}
     */
    textAlign(value) {
        if (value === undefined) {
            return this.$context2d.textAlign;
        }
        this.$context2d.textAlign = value;
    }
    /**
     * @param {TextBaselineType} value?
     * @return {any}
     */
    textBaseline(value) {
        if (value === undefined) {
            return this.$context2d.textBaseline;
        }
        this.$context2d.textBaseline = value;
    }
    /**
     * @param {GlobalCompositeOperationType} value?
     * @return {any}
     */
    operation(value) {
        if (value === undefined) {
            return this.$context2d
                .globalCompositeOperation;
        }
        this.$context2d.globalCompositeOperation = value;
    }
    /**
     * @param {number} alpha?
     * @return {number | void}
     */
    alpha(alpha) {
        if (alpha === undefined) {
            return this.$context2d.globalAlpha;
        }
        this.$context2d.globalAlpha = alpha;
    }
    resetAlpha() {
        this.alpha(1);
    }
    /**
     * @param {number} x?
     * @param {number} y?
     * @return {any}
     */
    translate(x, y) {
        if (arguments.length === 0) {
            return {
                x: this.__store.__translate.x,
                y: this.__store.__translate.y,
            };
        }
        x = this._getPixel(x || 0);
        y = this._getPixel(y || 0);
        this.$context2d.translate(x, y);
        this.__store.__translate.sumX += x;
        this.__store.__translate.sumY += y;
    }
    /**
     * @return {void}
     */
    resetTranslate() {
        this.$context2d.translate(-this.__store.__translate.sumX, -this.__store.__translate.sumY);
        this.__store.__translate.sumX = 0;
        this.__store.__translate.sumY = 0;
    }
    /**
     * @param {number} x?
     * @param {number} y?
     * @return {any}
     */
    scale(x, y) {
        if (arguments.length === 0) {
            return {
                x: this.__store.__scale.x,
                y: this.__store.__scale.y,
            };
        }
        this.$context2d.scale(x, y);
        this.__store.__scale.sumX += x || 0;
        this.__store.__scale.sumY += y || 0;
    }
    /**
     * @return {void}
     */
    resetScale() {
        this.$context2d.translate(-this.__store.__scale.sumX, -this.__store.__scale.sumY);
        this.__store.__translate.sumX = 0;
        this.__store.__translate.sumY = 0;
    }
    /**
     * @param {any} fillRule?
     * @param {any} path?
     * @return {void}
     */
    clip(fillRule, path) {
        if (path === undefined) {
            this.$context2d.clip(fillRule);
        }
        this.$context2d.clip(path, fillRule);
    }
    /**
     * @param {number|DOMMatrix} m11?
     * @param {number} m12?
     * @param {number} m21?
     * @param {number} m22?
     * @param {number} dx?
     * @param {number} dy?
     * @return {any}
     */
    transform(m11, m12, m21, m22, dx, dy) {
        if (arguments.length === 0) {
            return this.$context2d.getTransform();
        }
        if (m11 instanceof DOMMatrix) {
            const { a = 1, b = 0, c = 0, d = 1, e = 0, f = 0 } = m11;
            this.$context2d.transform(a, b, c, d, e, f);
        }
        else {
            this.$context2d.transform(m11, m12, m21, m22, dx, dy);
        }
    }
    /**
     * @param {number|DOMMatrix} m11
     * @param {number} m12?
     * @param {number} m21?
     * @param {number} m22?
     * @param {number} dx?
     * @param {number} dy?
     * @return {void}
     */
    setTransform(m11, m12, m21, m22, dx, dy) {
        if (m11 instanceof DOMMatrix) {
            const { a = 1, b = 0, c = 0, d = 1, e = 0, f = 0 } = m11;
            this.$context2d.setTransform(a, b, c, d, e, f);
        }
        else {
            this.$context2d.setTransform(m11, m12, m21, m22, dx, dy);
        }
    }
    /**
     * @param {string} text
     * @return {number}
     */
    measureText(text) {
        return this.$context2d.measureText(text).width;
    }
    /**
     * @param {number} angle
     * @return {number}
     */
    sin(angle) {
        return Math.sin(this._toRadius(angle));
    }
    /**
     * @param {number} sin
     * @return {number}
     */
    asin(sin) {
        return this._toDegress(Math.asin(sin));
    }
    /**
     * @param {number} angle
     * @return {number}
     */
    cos(angle) {
        return Math.cos(this._toRadius(angle));
    }
    /**
     * @param {number} cos
     * @return {number}
     */
    acos(cos) {
        return this._toDegress(Math.acos(cos));
    }
    /**
     * @param {number} angle
     * @return {number}
     */
    tan(angle) {
        return Math.tan(this._toRadius(angle));
    }
    /**
     * @param {number} tan
     * @return {number}
     */
    atan(tan) {
        return this._toDegress(Math.atan(tan));
    }
    /**
     * @param {number} y
     * @param {number} x
     * @return {number}
     */
    atan2(y, x) {
        return this._toDegress(Math.atan2(y, x));
    }
    /**
     * @return {void}
     */
    cursor() {
        this.$el.style.cursor = "auto";
    }
    /**
     * @return {void}
     */
    noCursor() {
        this.$el.style.cursor = "none";
    }
    // TODO: for system callback
    _setIdFrame(id) {
        this.__store._idFrame = id;
    }
    /**
     * @return {void}
     */
    loop() {
        this.__store._loop = true;
        this._stamentReady.emit("setuped");
    }
    /**
     * @return {void}
     */
    noLoop() {
        this.__store._loop = false;
        if (this.__store._idFrame) {
            cancelAnimationFrame(this.__store._idFrame);
        }
    }
    /**
     * @return {boolean}
     */
    get allowLoop() {
        return this.__store._loop;
    }
    on(name, callback) {
        return bindEvent(name, callback, this.$el);
    }
    off(name, callback) {
        if (typeof name === "function") {
            name();
        }
        else {
            this.$el.removeEventListener(name, callback);
        }
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    mouseIn(callback) {
        return this.on("mouseover", callback);
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    mouseOut(callback) {
        return this.on("mouseout", callback);
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    touchStart(callback) {
        return this.on("touchstart", callback);
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    touchMove(callback) {
        return this.on("touchmove", callback);
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    touchEnd(callback) {
        return this.on("touchend", callback);
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    mouseMove(callback) {
        return this.on("mousemove", callback);
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    mouseUp(callback) {
        return this.on("mouseup", callback);
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    mouseDown(callback) {
        return this.on("mousedown", callback);
    }
    /**
     * @param {CallbackEvent} callback
     * @return {noop}
     */
    mouseClicked(callback) {
        return this.on("click", callback);
    }
}
fCanvas.Element = MyElement;
fCanvas.Point3D = Point3D;
fCanvas.Point3DCenter = Point3DCenter;
fCanvas._count = 0;
const noopFCanvas = new fCanvas(0, 0);

function calculateRemainder2D(xComponent, yComponent, vector) {
    if (xComponent !== 0) {
        vector.x = vector.x % xComponent;
    }
    if (yComponent !== 0) {
        vector.y = vector.y % yComponent;
    }
    return vector;
}
function calculateRemainder3D(xComponent, yComponent, zComponent, vector) {
    if (xComponent !== 0) {
        vector.x = vector.x % xComponent;
    }
    if (yComponent !== 0) {
        vector.y = vector.y % yComponent;
    }
    if (zComponent !== 0) {
        vector.z = vector.z % zComponent;
    }
    return vector;
}
class Vector {
    /**
     * Creates an instance of Vector.
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [z=0]
     * @memberof Vector
     */
    constructor(x = 0, y = 0, z = 0) {
        [this.x, this.y, this.z] = [x, y, z];
    }
    /**
     * @param {(Vector | [number?, number?, number?] | number)} x
     * @param {number} [y]
     * @param {number} [z]
     * @return {*}  {this}
     * @memberof Vector
     */
    set(x, y, z) {
        if (x instanceof Vector) {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x = x[0] || 0;
            this.y = x[1] || 0;
            this.z = x[2] || 0;
            return this;
        }
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        return this;
    }
    /**
     * @return {*}  {Vector}
     * @memberof Vector
     */
    copy() {
        return new Vector(this.x, this.y, this.z);
    }
    /**
     * @param {(Vector | [number?, number?, number?] | number)} x
     * @param {number} [y]
     * @param {number} [z]
     * @return {*}  {this}
     * @memberof Vector
     */
    add(x, y, z) {
        if (x instanceof Vector) {
            this.x += x.x || 0;
            this.y += x.y || 0;
            this.z += x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x += x[0] || 0;
            this.y += x[1] || 0;
            this.z += x[2] || 0;
            return this;
        }
        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;
        return this;
    }
    /**
     * @param {(Vector | [number, number?, number?])} x
     * @memberof Vector
     */
    rem(x) {
        if (x instanceof Vector) {
            if (Number.isFinite(x.x) &&
                Number.isFinite(x.y) &&
                Number.isFinite(x.z)) {
                calculateRemainder3D(x.x, x.y, x.z, this);
            }
        }
        else if (x instanceof Array) {
            if (x.every(function (element) {
                return Number.isFinite(element);
            })) {
                if (x.length === 2) {
                    calculateRemainder2D(x[0], x[1], this);
                }
                if (x.length === 3) {
                    calculateRemainder3D(x[0], x[1], x[2], this);
                }
            }
        }
        else if (arguments.length === 1) {
            if (Number.isFinite(arguments[0]) && arguments[0] !== 0) {
                this.x = this.x % arguments[0];
                this.y = this.y % arguments[0];
                this.z = this.z % arguments[0];
            }
        }
        else if (arguments.length === 2) {
            const vectorComponents = [].slice.call(arguments);
            if (vectorComponents.every(function (element) {
                return Number.isFinite(element);
            })) {
                if (vectorComponents.length === 2) {
                    calculateRemainder2D(vectorComponents[0], vectorComponents[1], this);
                }
            }
        }
        else if (arguments.length === 3) {
            var _vectorComponents = [].slice.call(arguments);
            if (_vectorComponents.every(function (element) {
                return Number.isFinite(element);
            })) {
                if (_vectorComponents.length === 3) {
                    calculateRemainder3D(_vectorComponents[0], _vectorComponents[1], _vectorComponents[2], this);
                }
            }
        }
    }
    /**
     * @param {(Vector | [number?, number?, number?] | number)} x
     * @param {number} [y]
     * @param {number} [z]
     * @return {*}  {this}
     * @memberof Vector
     */
    sub(x, y, z) {
        if (x instanceof Vector) {
            this.x -= x.x || 0;
            this.y -= x.y || 0;
            this.z -= x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x -= x[0] || 0;
            this.y -= x[1] || 0;
            this.z -= x[2] || 0;
            return this;
        }
        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;
        return this;
    }
    /**
     * @param {number} n
     * @return {*}  {this}
     * @memberof Vector
     */
    mult(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }
    /**
     * @param {number} n
     * @return {*}  {this}
     * @memberof Vector
     */
    div(n) {
        if (n === 0) {
            console.warn("div:", "divide by 0");
            return this;
        }
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }
    /**
     * @return {*}  {number}
     * @memberof Vector
     */
    mag() {
        return Math.sqrt(this.magSq());
    }
    /**
     * @return {*}  {number}
     * @memberof Vector
     */
    magSq() {
        const { x, y, z } = this;
        return x * x + y * y + z * z;
    }
    /**
     * @param {(number | Vector)} [x]
     * @param {number} [y]
     * @param {number} [z]
     * @return {*}  {number}
     * @memberof Vector
     */
    dot(x, y, z) {
        if (x instanceof Vector) {
            return this.dot(x.x, x.y, x.z);
        }
        return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
    }
    /**
     * @param {Vector} v
     * @return {*}  {Vector}
     * @memberof Vector
     */
    cross(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    /**
     * @return {*}  {this}
     * @memberof Vector
     */
    normalize() {
        const len = this.mag();
        if (len !== 0) {
            this.mult(1 / len);
        }
        return this;
    }
    /**
     * @param {number} max
     * @return {*}  {this}
     * @memberof Vector
     */
    limit(max) {
        const mSq = this.magSq();
        if (mSq > max ** 2) {
            this.div(Math.sqrt(mSq)) //normalize it
                .mult(max);
        }
        return this;
    }
    /**
     * @param {number} n
     * @return {*}  {this}
     * @memberof Vector
     */
    setMag(n) {
        return this.normalize().mult(n);
    }
    /**
     * @return {*}  {number}
     * @memberof Vector
     */
    heading() {
        return Math.atan2(this.y, this.x);
    }
    /**
     * @param {number} angle
     * @return {*}  {this}
     * @memberof Vector
     */
    rotate(angle) {
        const newHeading = this.heading() + angle;
        const mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }
    /**
     * @param {Vector} vector
     * @return {*}  {number}
     * @memberof Vector
     */
    angleBetween(vector) {
        const dotmagmag = this.dot(vector) / (this.mag() * vector.mag());
        const angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag))) *
            Math.sign(this.cross(vector).z || 1);
        return angle;
    }
    /**
     * @param {(Vector | number)} [x=0]
     * @param {number} [y=0]
     * @param {number} [z=0]
     * @param {number} [amt=0]
     * @return {*}  {this}
     * @memberof Vector
     */
    lerp(x = 0, y = 0, z = 0, amt = 0) {
        if (x instanceof Vector) {
            return this.lerp(x.x, x.y, x.z, y);
        }
        this.x += (x - this.x) * amt || 0;
        this.y += (y - this.y) * amt || 0;
        this.z += (z - this.z) * amt || 0;
        return this;
    }
    /**
     * @param {Vector} surfaceNormal
     * @return {*}  {this}
     * @memberof Vector
     */
    reflect(surfaceNormal) {
        surfaceNormal.normalize();
        return this.sub(surfaceNormal.mult(2 * this.dot(surfaceNormal)));
    }
    /**
     * @return {*}  {[number, number, number]}
     * @memberof Vector
     */
    array() {
        return [this.x || 0, this.y || 0, this.z || 0];
    }
    /**
     * @param {(Vector | [number?, number?, number?] | number)} [x]
     * @param {number} [y]
     * @param {number} [z]
     * @return {*}  {boolean}
     * @memberof Vector
     */
    equals(x, y, z) {
        let a, b, c;
        if (x instanceof Vector) {
            a = x.x || 0;
            b = x.y || 0;
            c = x.z || 0;
        }
        else if (x instanceof Array) {
            a = x[0] || 0;
            b = x[1] || 0;
            c = x[2] || 0;
        }
        else {
            a = x || 0;
            b = y || 0;
            c = z || 0;
        }
        return this.x === a && this.y === b && this.z === c;
    }
    /**
     * @return {*}  {string}
     * @memberof Vector
     */
    toString() {
        return "Vector: [" + this.array().join(", ") + "]";
    }
}

function getAnimate(type, currentProgress, start, distance, steps, power) {
    switch (type) {
        case "ease":
            currentProgress /= steps / 2;
            if (currentProgress < 1) {
                return (distance / 2) * Math.pow(currentProgress, power) + start;
            }
            currentProgress -= 2;
            return (distance / 2) * (Math.pow(currentProgress, power) + 2) + start;
        case "quadratic":
            currentProgress /= steps / 2;
            if (currentProgress <= 1) {
                return (distance / 2) * currentProgress * currentProgress + start;
            }
            currentProgress--;
            return (-1 * (distance / 2) * (currentProgress * (currentProgress - 2) - 1) +
                start);
        case "sine-ease-in-out":
            return ((-distance / 2) * (Math.cos((Math.PI * currentProgress) / steps) - 1) +
                start);
        case "quintic-ease":
            currentProgress /= steps / 2;
            if (currentProgress < 1) {
                return (distance / 2) * Math.pow(currentProgress, 5) + start;
            }
            currentProgress -= 2;
            return (distance / 2) * (Math.pow(currentProgress, 5) + 2) + start;
        case "exp-ease-in-out":
            currentProgress /= steps / 2;
            if (currentProgress < 1)
                return (distance / 2) * Math.pow(2, 10 * (currentProgress - 1)) + start;
            currentProgress--;
            return (distance / 2) * (-Math.pow(2, -10 * currentProgress) + 2) + start;
        case "linear":
            return start + (distance / steps) * currentProgress;
    }
}
/**
 * @param {AnimateType} type
 * @param {number} start
 * @param {number} stop
 * @param {number} frame
 * @param {number} frames
 * @param {number=3} power
 * @return {number}
 */
function getValueInFrame(type, start, stop, frame, frames, power = 3) {
    const distance = stop - start;
    return getAnimate(type, frame, start, distance, frames, power);
}
function timeToFrames(time, fps = 1000 / 60) {
    return time / fps;
}
function toObject(obj) {
    if (Array.isArray(obj)) {
        let tmp = Object.create(null);
        obj.forEach((value, index) => {
            tmp[`${index}`] = value;
        });
        obj = tmp;
    }
    return obj;
}
function reactive(obj, $this) {
    delete obj.__observe;
    obj = toObject(obj);
    const store = {};
    for (const key in obj) {
        store[key] = [obj[key], obj[key]];
        Object.defineProperty(obj, key, {
            get() {
                return getValueInFrame($this.easing, store[key][0], store[key][1], $this.frame, $this.frames);
            },
            set(value) {
                store[key][1] = value;
            },
        });
    }
    Object.defineProperty(obj, "__observe", {
        writable: true,
        enumerable: false,
        configurable: true,
        value: store,
    });
    return obj;
}
function splitNumberString(params) {
    const indexString = params.findIndex((item) => typeof item === "string");
    if (indexString > -1) {
        return [params[indexString], +params[indexString === 0 ? 1 : 0]];
    }
    else {
        return [params[1], +params[0]];
    }
}
function converParams(...params) {
    let data, time, easing;
    if ("length" in params[0] ||
        (params[0] !== null && typeof params[0] === "object")) {
        /// install to params[0] | time = params[1] | easing = params[2]
        data = params[0];
        [easing, time] = splitNumberString(params.slice(1));
    }
    else {
        /// install to params | time  = 0 | easing = linear
        data = toObject(params);
    }
    return [data, time, easing];
}
class Animate {
    constructor(...params) {
        this.__data = {
            __observe: {},
        };
        this.__fps = 1000 / 60;
        this.__eventsStore = Object.create(null);
        this.__queue = [];
        this.time = 0;
        this.easing = "ease";
        this.__frame = 1;
        const [data, time, easing] = converParams(...params);
        this.data = data ?? this.data;
        this.time = Number.isNaN(time) ? this.time : time ?? this.time;
        this.easing = easing ?? this.easing;
    }
    // private get data(): StoreObserve {
    //   return this.__data;
    // }
    set data(data) {
        this.__data = reactive(data, this);
        for (const key in this.__data) {
            Object.defineProperty(this, key, {
                get() {
                    return this.__data[key];
                },
            });
        }
    }
    /**
     * @param {string} key
     * @return {*}  {(number | void)}
     * @memberof Animate
     */
    get(key) {
        return this.__data[key];
    }
    get frames() {
        return Math.max(timeToFrames(this.time, this.__fps), 1);
    }
    get frame() {
        return Math.min(this.__frame, this.frames);
    }
    set frame(value) {
        this.__frame = Math.min(value, this.frames);
        if (this.frame === this.frames) {
            this.emit("done");
            if (this.__queue.length > 0) {
                this._to(...this.__queue[0]);
                this.__queue.splice(0, 1);
            }
        }
    }
    on(name, callback) {
        if (name in this.__eventsStore) {
            this.__eventsStore[name].push(callback);
        }
        else {
            this.__eventsStore[name] = [callback];
        }
    }
    off(name, callback) {
        if (callback) {
            this.__eventsStore[name] = this.__eventsStore[name]?.filter((item) => item !== callback);
            if (this.__eventsStore[name]?.length === 0) {
                delete this.__eventsStore[name];
            }
        }
        else {
            delete this.__eventsStore[name];
        }
    }
    emit(name, ...params) {
        this.__eventsStore[name]?.forEach((callback) => {
            callback.call(this, ...params);
        });
    }
    once(name, callback) {
        const callbackVirual = (...params) => {
            callback.call(this, ...params);
            this.off(name, callbackVirual);
        };
        this.on(name, callbackVirual);
    }
    setFPS(value) {
        this.__fps = value;
    }
    action() {
        this.frame++;
    }
    cancel(key) {
        if (key) {
            if (key in this.__data && key in this.__data.__observe) {
                this.__data.__observe[key][0] = this.__data[key];
                this.emit("cancel", key);
            }
        }
        else {
            for (const key in this.__data) {
                this.cancel(key);
            }
        }
    }
    _to(...params) {
        const [data, time, easing] = converParams(...params);
        for (const key in data) {
            if (key in this.__data && key in this.__data.__observe) {
                this.cancel(key);
                this.__data.__observe[key][1] = +data[key];
                // this.__data.__observe[key][1] = +data[key] as number;
            }
            else {
                console.error(`fCanvas<animate.ts>: "${key}" is not signed.`);
            }
        }
        this.frame = 0;
        this.time = Number.isNaN(time) ? this.time : time ?? this.time;
        this.easing = easing ?? this.easing;
    }
    to(...params) {
        this._to(...params);
        this.__queue.splice(0);
    }
    get running() {
        return this.frame < this.frames;
    }
    add(...params) {
        this.__queue.push(converParams(...params));
    }
    set(...params) {
        this.data = converParams(...params)[0];
    }
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function constrain(value, min, max) {
    return Math.min(Math.max(min, value), max);
}
/**
 * @param {string} src
 * @return {Promise<HTMLImageElement>}
 */
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return new Promise((resolve, reject) => {
        function loaded() {
            resolve(img);
            img.removeEventListener("load", loaded);
        }
        function error(err) {
            reject(err);
            img.removeEventListener("error", error);
        }
        img.addEventListener("load", loaded);
        img.addEventListener("error", error);
    });
}
/**
 *
 * @param {string} src
 * @return {Promise<HTMLAudioElement>}
 */
function loadAudio(src) {
    const audio = document.createElement("audio");
    audio.src = src;
    return new Promise((resolve, reject) => {
        function loaded() {
            resolve(audio);
            audio.removeEventListener("load", loaded);
        }
        function error(err) {
            reject(err);
            audio.removeEventListener("error", error);
        }
        audio.addEventListener("load", loaded);
        audio.addEventListener("error", error);
    });
}
/**
 * @param {number} value
 * @param {number} start
 * @param {number} stop
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function map(value, start, stop, min, max) {
    return ((value - start) * (max - min)) / (stop - start) + min;
}
/**
 * @export
 * @param {number} ratio
 * @param {number} width
 * @param {number} height
 * @return {*}  {[number, number]}
 */
function aspectRatio(ratio, width, height) {
    /// ratio = width / height => height = width / ratio
    const nwidth = ratio * height;
    const nheight = width / ratio;
    if (width < nwidth) {
        return [width, nheight];
    }
    else {
        return [nwidth, height];
    }
}
/**
 * @param {any[]} ...args
 * @return {any}
 */
function random(...args) {
    if (args.length === 1) {
        if (args[0] !== null &&
            typeof args[0] === "object" &&
            "length" in args[0]) {
            return args[0][Math.floor(Math.random() * args[0].length)];
        }
        return Math.random() * args[0];
    }
    if (args.length === 2) {
        return args[0] + Math.random() * (args[1] - args[0]);
    }
}
/**
 * @param {number} start
 * @param {number} stop?
 * @return {number}
 */
function randomInt(start, stop) {
    if (stop === undefined) {
        return Math.round(random(start));
    }
    return Math.round(random(start, stop));
}
/**
 * @param {any} start
 * @param {any} stop
 * @param {number} step
 * @return {any}
 */
function range(start, stop, step) {
    step = step || 1;
    const arr = [];
    let isChar = false;
    if (stop === undefined)
        (stop = start), (start = 1);
    if (typeof start === "string") {
        start = start.charCodeAt(0);
        stop = stop.charCodeAt(0);
        isChar = true;
    }
    if (start !== stop && Math.abs(stop - start) < Math.abs(step))
        throw new Error("range(): step exceeds the specified range.");
    if (stop > start) {
        step < 0 && (step *= -1);
        while (start <= stop) {
            arr.push(isChar ? String.fromCharCode(start) : start);
            start += step;
        }
    }
    else {
        step > 0 && (step *= -1);
        while (start >= stop) {
            arr.push(isChar ? String.fromCharCode(start) : start);
            start += step;
        }
    }
    return arr;
}
/**
 * @param {number} start
 * @param {number} stop
 * @param {number} amt
 * @return {number}
 */
function lerp(start, stop, amt) {
    return amt * (stop - start) + start;
}
/**
 * @param {number[]} ...args
 * @return {number}
 */
const hypot = typeof Math.hypot === "function"
    ? Math.hypot
    : (...args) => {
        const len = args.length;
        let i = 0, result = 0;
        while (i < len)
            result += Math.pow(args[i++], 2);
        return Math.sqrt(result);
    };
/**
 * @param {number} value
 * @param {number} max
 * @param {number} prevent
 * @return {number}
 */
function odd(value, prevent, max) {
    if (value === max) {
        return prevent;
    }
    return value + 1;
}
/**
 * @param {number} value
 * @param {number} min
 * @param {number} prevent
 * @return {number}
 */
function even(value, min, prevent) {
    if (value === min) {
        return prevent;
    }
    return value - 1;
}
///// https://jsfiddle.net/casamia743/xqh48gno/
function calcProjectedRectSizeOfRotatedRect(width, height, rad) {
    const rectProjectedWidth = Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad));
    const rectProjectedHeight = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));
    return [rectProjectedWidth, rectProjectedHeight];
}
let virualContext;
function cutImage(image, x = 0, y = 0, width = extractNumber(`${image.width}`), height = extractNumber(`${image.height}`), rotate = 0) {
    if (virualContext === undefined) {
        virualContext = document
            .createElement("canvas")
            .getContext("2d"); /// never null
    }
    /// ------------------ draw image canvas -----------------
    const rad = (rotate * Math.PI) / 180;
    const [nwidth, nheight] = calcProjectedRectSizeOfRotatedRect(width, height, rad);
    virualContext.canvas.width = width;
    virualContext.canvas.height = height;
    virualContext.save();
    virualContext.translate(width / 2, height / 2);
    virualContext.rotate((rotate * Math.PI) / 180);
    virualContext.drawImage(image, x, y, nwidth, nheight, -nwidth / 2, -nheight / 2, nwidth, nheight);
    virualContext.restore();
    /// -----------------------------------------------------------
    const imageCuted = new Image();
    imageCuted.src = virualContext.canvas.toDataURL();
    virualContext.clearRect(0, 0, width, height);
    return imageCuted;
}
/**
 * @export
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {*}  {boolean}
 */
function unlimited(value, min, max) {
    return value < min || value > max;
}

class Cursor {
    constructor(camera, config) {
        this._camera = camera;
        this._config = config;
        const watch = (prop) => {
            this._camera.$watch(prop, (newValue, oldValue) => {
                const dist = newValue - oldValue;
                // min = this._config.x.min;
                if (this._config[prop].dynamic) {
                    if (dist < 0
                        ? this[prop] > this._config[prop].min
                        : this[prop] < this._config[prop].max) {
                        this[prop] += dist;
                        return false;
                    }
                }
                else {
                    if ((prop === "x"
                        ? this._camera.isLimitX()
                        : this._camera.isLimitY()) === (dist < 0 ? -1 : 1)) {
                        if (this[prop] > this._config[prop].min) {
                            this[prop] += dist;
                        }
                    }
                }
            });
        };
        watch("x");
        watch("y");
    }
    get x() {
        return this._config.x.current;
    }
    set x(value) { }
    get y() {
        return this._config.y.current;
    }
    set y(value) { }
}
class Camera {
    constructor(canvas, x, y, width, height) {
        this._offset = Object.create({
            x: 0,
            y: 0,
        });
        this._watchers = Object.create(null);
        this._canvas = canvas;
        this._viewport = {
            x,
            y,
            width,
            height,
        };
    }
    get x() {
        return this._offset.x;
    }
    set x(value) {
        const old = this._offset.x;
        let allowChange = true;
        this._watchers.x?.forEach((callback) => {
            if (callback(value, old) === false) {
                allowChange = false;
            }
        });
        if (allowChange) {
            this._offset.x = value;
        }
    }
    get y() {
        return this._offset.y;
    }
    set y(value) {
        const old = this._offset.y;
        let allowChange = true;
        this._watchers.y?.forEach((callback) => {
            if (callback(value, old) === false) {
                allowChange = false;
            }
        });
        if (allowChange) {
            this._offset.y = value;
        }
    }
    $watch(name, callback) {
        if (name in this._watchers === false) {
            this._watchers[name] = [];
        }
        this._watchers[name].push(callback);
        return () => {
            const index = this._watchers[name]?.findIndex((item) => item === callback);
            if (index && index !== -1) {
                this._watchers[name].splice(index, 1);
            }
        };
    }
    getXOffset(value, diffSpeed = 1) {
        return (value -
            constrain(this.x * diffSpeed, this._viewport.x, this._viewport.width - this._canvas.width));
    }
    getYOffset(value, diffSpeed = 1) {
        return (value -
            constrain(this.y * diffSpeed, this._viewport.y, this._viewport.height - this._canvas.height));
    }
    isLimitX() {
        if (this.x < this._viewport.x) {
            return -1;
        }
        if (this.x > this._viewport.width - this._canvas.width) {
            return 1;
        }
        return 0;
    }
    isLimitY() {
        if (this.y < this._viewport.y) {
            return -1;
        }
        if (this.y > this._viewport.height - this._canvas.height) {
            return 1;
        }
        return 0;
    }
    isXInViewBox(value, width = 0, diffSpeed = 1) {
        if (value instanceof MyElement) {
            width = value.width || 0;
            value = value.x || 0;
        }
        value = this.getXOffset(value, diffSpeed);
        return value + width > 0 || value < this._canvas.width;
    }
    isYInViewBox(value, height = 0, diffSpeed = 1) {
        if (value instanceof MyElement) {
            height = value.height || 0;
            value = value.y || 0;
        }
        value = this.getYOffset(value, diffSpeed);
        return value + height > 0 || value < this._canvas.height;
    }
    isInViewBox(x, y, width = 0, height = 0, diffSpeedX = 1, diffSpeedY = 1) {
        if (x instanceof MyElement) {
            return (this.isXInViewBox(x, diffSpeedX) && this.isYInViewBox(x, diffSpeedY));
        }
        return (this.isXInViewBox(x, width, diffSpeedX) &&
            this.isYInViewBox(y, height, diffSpeedY));
    }
}
Camera.Cursor = Cursor;

function convertValueXMLToArray(str) {
    if (/^{[^]*}$/.test(trim(str))) {
        str = decodeURIComponent(encodeURIComponent(str).replace(/%7b/gi, "[").replace(/%7d/gi, "]"));
        return new Function(`return ${str}`)();
    }
    throw new Error(`fCanvas<Resource>: "${str}" a malformed field`);
}
function convertFieldToJson(keyItem) {
    const key = keyItem.textContent;
    const value = keyItem.nextElementSibling;
    if (value == null) {
        throw new Error("fCanvas<loadResourceImage>: Error because syntax error in file plist.");
    }
    if (value.tagName === "dict") {
        let result = {};
        Array.from(value.childNodes)
            .filter((item) => item.tagName === "key")
            .forEach((keyItem) => {
            result = {
                ...result,
                ...convertFieldToJson(keyItem),
            };
        });
        return {
            [key]: result,
        };
    }
    if (value.tagName === "array") {
        let result = [];
        Array.from(value.childNodes)
            .filter((item) => item.tagName === "key")
            .forEach((keyItem) => {
            result.push(convertFieldToJson(keyItem));
        });
        return {
            [key]: result,
        };
    }
    if (value.tagName === "string") {
        return {
            [key]: convertValueXMLToArray(value.textContent),
        };
    }
    if (value.tagName === "integer") {
        return {
            [key]: parseInt(value.textContent),
        };
    }
    if (value.tagName === "float") {
        return {
            [key]: parseFloat(value.textContent),
        };
    }
    if (value.tagName === "true") {
        return {
            [key]: true,
        };
    }
    if (value.tagName === "false") {
        return {
            [key]: false,
        };
    }
    return {};
}
function resolvePath(...params) {
    if (params[1].match(/^[a-z]+:\/\//i)) {
        return params[1];
    }
    const root = (params[0]).replace(/\/$/, "").split("/");
    params[0] = root.slice(0, root.length - 1).join("/");
    return params.join("/");
}
class TilesResource {
    constructor(image, plist) {
        this.__caching = new Map();
        this.tileRoot = image;
        this.plist = plist;
    }
    /**
     * @param {string} name
     * @return {any}
     */
    get(name) {
        if (this.has(name)) {
            const { frame, rotated, sourceSize } = this.plist.frames[name];
            if (this.__caching.has(name) === false) {
                const image = cutImage(this.tileRoot, +frame[0][0], +frame[0][1], +frame[1][0], +frame[1][1], rotated ? -90 : 0);
                this.__caching.set(name, Object.assign(image, {
                    image,
                    size: {
                        width: +sourceSize[0] || +frame[1][0],
                        height: +sourceSize[1] || +frame[1][1],
                    },
                }));
            }
            return this.__caching.get(name);
        }
        else {
            throw new Error(`fCanvas<addons/loadResourceImage>: Error does not exist this file "${name}" in declaration .plist`);
        }
    }
    /**
     * @param {string} name
     * @return {boolean}
     */
    has(name) {
        return name in this.plist.frames;
    }
}
/**
 * @param {string} path
 * @return {Promise<TilesResource>}
 */
async function loadResourceImage(path) {
    if (path.match(/\.plist$/) == null) {
        path += `.plist`;
    }
    const plist = await fetch(`${path}`)
        .then((response) => response.text())
        .then((str) => new DOMParser().parseFromString(str, "text/xml"));
    let plistJson = {};
    plist
        .querySelectorAll("plist > dict:first-child > key")
        .forEach((itemKey) => {
        plistJson = {
            ...plistJson,
            ...convertFieldToJson(itemKey),
        };
    });
    const image = await loadImage(resolvePath(path, plistJson?.metadata.realTextureFileName ||
        plistJson?.metadata.textureFileName));
    return new TilesResource(image, plistJson);
    //// ----------------- convert to json ------------------
}
class Resource {
    constructor(description, autoLoad = true) {
        this.resourceLoaded = new Map();
        this.resourceDescription = Object.create(null);
        const resourceDescription = Object.create(null);
        for (const prop in description) {
            if (typeof description[prop] === "string") {
                resourceDescription[prop] = {
                    src: description[prop],
                    lazy: true,
                };
            }
            else {
                resourceDescription[prop] = description[prop];
            }
        }
        this.resourceDescription = resourceDescription;
        /// observe
        const { set, delete: _delete } = this.resourceLoaded;
        const $this = this;
        this.resourceLoaded.set = function (...params) {
            /// call this._set
            $this[params[0]] = params[1];
            return set.apply(this, params);
        };
        this.resourceLoaded.delete = function (...params) {
            /// call this._set
            delete $this[params[0]];
            return _delete.apply(this, params);
        };
        if (autoLoad) {
            const resourceAutoLoad = [];
            for (const prop in this.resourceDescription) {
                if (this.resourceDescription[prop].lazy === false) {
                    resourceAutoLoad.push(this.load(prop));
                }
            }
            // @ts-expect-error
            return new Promise(async (resolve, reject) => {
                try {
                    await Promise.all(resourceAutoLoad);
                    resolve(this);
                }
                catch (err) {
                    reject(err);
                }
            });
        }
    }
    async load(name) {
        if (name) {
            if (name in this.resourceDescription) {
                if (this.isLoaded(name) === false) {
                    const { src, type } = this.resourceDescription[name];
                    switch (type) {
                        case "image":
                            this.resourceLoaded.set(name, await loadImage(src));
                            break;
                        case "audio":
                            this.resourceLoaded.set(name, await loadAudio(src));
                            break;
                        case "plist":
                            this.resourceLoaded.set(name, await loadResourceImage(src));
                            break;
                        default:
                            console.warn(`fCanvas<Resource>: can't load "${name} because it is "${type}`);
                    }
                }
                else {
                    console.warn(`fCanvas<Resource>: "${name}" resource loaded.`);
                }
            }
            else {
                console.error(`fCanvas<Resource>: "${name} resource not exists.`);
            }
        }
    }
    isLoaded(name) {
        if (name) {
            return this.resourceLoaded.has(name);
        }
        else {
            for (const prop in this.resourceDescription) {
                if (this.resourceLoaded.has(prop) === false) {
                    return false;
                }
            }
            return true;
        }
    }
    get(type, path) {
        const _path = path.split("/");
        const resourceName = _path[0];
        const resoucreProp = _path.slice(1).join("/");
        const info = this.resourceDescription[resourceName];
        if (info && info.type === type) {
            if (this.resourceLoaded.has(resourceName)) {
                const resource = this.resourceLoaded.get(resourceName);
                if (resource) {
                    switch (info.type) {
                        case "plist":
                            return resoucreProp
                                ? resource.get(resoucreProp)
                                : resource;
                        case "image":
                        case "audio":
                        default:
                            return resource;
                    }
                }
                throw new Error(`fCanvas<Resource>: "${resourceName} not exists.`);
            }
            else {
                throw new Error(`fCanvas<Resource>: "${resourceName} not loaded.`);
            }
        }
        else {
            throw new Error(`fCanvas<Resource>: "${resourceName}" not exitst.`);
        }
    }
}

function CircleImpact(circle1, circle2) {
    return ((circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2 <
        (circle1.radius + circle2.radius) ** 2);
}
function CircleImpactPoint(circle, x, y) {
    if (x == null || y == null) {
        return false;
    }
    return (x - circle.x) ** 2 + (y - circle.y) ** 2 < circle.radius ** 2;
}
function CircleImpactRect(circle, rect) {
    const x = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const y = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const distance = (x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y);
    return distance < circle.radius ** 2;
}
function RectImpact(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y);
}
function RectImpactPoint(rect, x, y) {
    if (x == null || y == null) {
        return false;
    }
    return (rect.x < x &&
        rect.x + rect.width > x &&
        rect.y < y &&
        rect.y + rect.height > y);
}
function getOffset(el) {
    let { x, y } = el;
    if (el.type === "rect") {
        [x, y] = el.$parent._argsRect(el.x, el.y, el.width, el.height);
    }
    return {
        x,
        y,
    };
}
function getDirectionElement(el1, el2) {
    let { x: x1, y: y1 } = getOffset(el1);
    let { x: x2, y: y2 } = getOffset(el2);
    return (Math.atan2(x2 - x1, y2 - y1) * 180) / Math.PI;
}
function interfering(element1, element2, company = true) {
    switch (element1.type) {
        case "rect":
            switch (element2.type) {
                case "rect":
                    if (RectImpact(element1, element2)) {
                        return company
                            ? {
                                direction: getDirectionElement(element1, element2),
                                element: element2,
                            }
                            : true;
                    }
                    break;
                case "circle":
                    if (CircleImpactRect(element2, element1)) {
                        return company
                            ? {
                                direction: getDirectionElement(element1, element2),
                                element: element2,
                            }
                            : true;
                    }
                    break;
                case "point":
                    if (RectImpactPoint(element1, element2.x, element2.y)) {
                        return company
                            ? {
                                direction: getDirectionElement(element1, element2),
                                element: element2,
                            }
                            : true;
                    }
                    break;
            }
            break;
        case "circle":
            switch (element2.type) {
                case "rect":
                    return interfering(element2, element1, company);
                case "circle":
                    if (CircleImpact(element1, element2)) {
                        return company
                            ? {
                                direction: getDirectionElement(element1, element2),
                                element: element2,
                            }
                            : true;
                    }
                    break;
                case "point":
                    if (CircleImpactPoint(element1, element2.x, element2.y)) {
                        return company
                            ? {
                                direction: getDirectionElement(element1, element2),
                                element: element2,
                            }
                            : true;
                    }
                    break;
            }
            break;
        case "point": {
            switch (element2.type) {
                case "rect":
                case "circle":
                    return interfering(element2, element1, company);
                case "point":
                    if (element1.x === element2.x && element1.y === element2.y) {
                        return company
                            ? {
                                direction: getDirectionElement(element1, element2),
                                element: element2,
                            }
                            : true;
                    }
            }
        }
    }
    return company ? false : null;
}
function presser(el, ...otherEl) {
    let result;
    otherEl.some((el2) => {
        const r = interfering(el, el2);
        if (r) {
            result = r;
            return true;
        }
    });
    return result ?? null;
}
function pressed(el, ...otherEl) {
    return otherEl.some((el2) => interfering(el, el2, false));
}

export default fCanvas;
export { Animate, Camera, Emitter, Resource, Store, Vector, aspectRatio, cancelAnimationFrame, changeSize, constrain, createElement, cutImage, draw, even, getDirectionElement, hypot, isMobile, isTouch, keyPressed, lerp, loadAudio, loadImage, loadResourceImage, map, mouseClicked, mouseMoved, mousePressed, mouseWheel, odd, passive, pressed, presser, random, randomInt, range, requestAnimationFrame, setup, touchEnd, touchMove, touchStart, unlimited };
