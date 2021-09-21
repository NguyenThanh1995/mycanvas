import { AutoToPx, noop, Offset } from "../utils/index";
import fCanvas, { noopFCanvas, ParamsToRgb, DirectionPattern } from "./fCanvas";
import Peers from "../classes/Peers";

type ParamsDrawImage =
  | [number, number]
  | [number, number, number, number]
  | [number, number, number, number, number, number, number, number];
type LineJoin = "bevel" | "round" | "miter";
type LineCap = "butt" | "round" | "square";

export default abstract class MyElement {
  private static _count: number = 0;
  public get type(): "rect" | "circle" | "point" | "unknown" {
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
  private readonly _id: number = MyElement._count++;
  public get id(): number {
    return this._id;
  }
  private readonly _els: {
    [propName: string]: {
      canvas: fCanvas;
      setuped: boolean;
    };
  } = Object.create(null);
  private _idActiveNow: number = -1;
  private readonly _queue: MyElement[] = [];

  private __addEl(canvas: fCanvas): void {
    if (canvas.id in this._els === false) {
      this._els[canvas.id] = {
        canvas,
        setuped: false,
      };
    }
  }
  constructor(canvas?: fCanvas) {
    if (!(canvas instanceof fCanvas)) {
      canvas = noopFCanvas;
    }

    this.__addEl(canvas);
  }

  _run(canvas: fCanvas, peers?: Peers): void {
    this.__addEl(canvas);
    this._idActiveNow = canvas.id;

    if (
      typeof (this as any).setup === "function" &&
      this._els[this._idActiveNow].setuped === false
    ) {
      const result = (this as any).setup();

      if (result !== null && typeof result === "object") {
        for (const prop in result) {
          (this as any)[prop] = (result as any)[prop];
        }
      }

      this._els[this._idActiveNow].setuped = true;
    }

    if (peers) {
      if (typeof (this as any).updatePeer === "function") {
        if (typeof (this as any).draw === "function") {
          (this as any).draw();
        }
        (this as any).updatePeer(peers);
      } else if (typeof (this as any).draw === "function") {
        (this as any).draw();
      }
    } else {
      if (typeof (this as any).update === "function") {
        if (typeof (this as any).draw === "function") {
          (this as any).draw();
        }
        (this as any).update();
      } else if (typeof (this as any).draw === "function") {
        (this as any).draw();
      }
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
  add(...elements: MyElement[]): void {
    this._queue.push(...elements);
  }
  run(element: MyElement): void {
    this.$parent.run(element);
  }
  get $parent(): fCanvas {
    const canvas = this._els[this._idActiveNow === -1 ? 0 : this._idActiveNow];

    if (canvas?.canvas instanceof fCanvas) {
      return canvas.canvas;
    } else {
      console.warn(
        "fCanvas: The current referenced version of the fCanvas.run function is incorrect."
      );
      return this._els[0].canvas;
    }
  }

  get $context2d(): CanvasRenderingContext2D {
    return this.$parent.$context2d;
  }
  sin(angle: number): number {
    return this.$parent.sin(angle);
  }
  asin(sin: number): number {
    return this.$parent.asin(sin);
  }
  cos(angle: number): number {
    return this.$parent.cos(angle);
  }
  acos(cos: number): number {
    return this.$parent.asin(cos);
  }
  tan(angle: number): number {
    return this.$parent.tan(angle);
  }
  atan(tan: number): number {
    return this.$parent.atan(tan);
  }
  atan2(y: number, x: number): number {
    return this.$parent.atan2(y, x);
  }

  get mouseX(): number | null {
    return this.$parent.mouseX;
  }
  get mouseY(): number | null {
    return this.$parent.mouseY;
  }
  get movedX(): number {
    return this.$parent.movedX;
  }
  get movedY(): number {
    return this.$parent.movedY;
  }
  get pmouseX(): number {
    return this.$parent.pmouseX;
  }
  get pmouseY(): number {
    return this.$parent.pmouseY;
  }
  get mouseIsPressed(): boolean {
    return this.$parent.mouseIsPressed;
  }

  get windowWidth(): number {
    return this.$parent.windowWidth;
  }
  get windowHeight(): number {
    return this.$parent.windowHeight;
  }
  fill(
    hue: number,
    saturation: number,
    lightness: number,
    alpha?: number
  ): this;
  fill(red: number, green: number, blue: number, alpha?: number): this;
  fill(color?: string | CanvasGradient | CanvasImageSource | number): this;
  fill(...args: ParamsToRgb): this {
    this.$context2d.fillStyle = this.$parent._toRgb(args);
    this.$context2d.fill();

    return this;
  }
  stroke(
    hue: number,
    saturation: number,
    lightness: number,
    alpha?: number
  ): this;
  stroke(red: number, green: number, blue: number, alpha?: number): this;
  stroke(color?: string | CanvasGradient | CanvasImageSource | number): this;
  stroke(...args: ParamsToRgb): this {
    this.$context2d.strokeStyle = this.$parent._toRgb(args);
    this.$context2d.stroke();

    return this;
  }
  noFill(): this {
    return this.fill(0, 0, 0, 0);
  }
  lineWidth(): number;
  lineWidth(width: number): this;
  lineWidth(value?: number): number | this {
    if (value === undefined) {
      return this.$context2d.lineWidth;
    }
    this.$context2d.lineWidth = this.$parent._getPixel(value);

    return this;
  }
  miterLimit(): number;
  miterLimit(value: number): this;
  miterLimit(value?: number): number | this {
    if (value === undefined) {
      return this.$context2d.miterLimit;
    }
    this.lineJoin("miter");

    this.$context2d.miterLimit = value;

    return this;
  }
  shadowOffset(): Offset;
  shadowOffset(x: number, y: number): this;
  shadowOffset(x?: number, y?: number): Offset | this {
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
  measureText(text: string): number {
    return this.$parent.measureText(text);
  }
  begin(): this {
    this.$context2d.beginPath();

    return this;
  }
  close(): this {
    this.$context2d.closePath();

    return this;
  }
  save(): this {
    this.$parent.save();

    return this;
  }
  restore(): this {
    this.$parent.restore();

    return this;
  }
  rotate(): number;
  rotate(angle: number): this;
  rotate(angle?: number): number | this {
    if (angle === undefined) {
      return this.$parent.rotate();
    }
    this.$parent.rotate(angle);

    return this;
  }
  translate(): Offset;
  translate(x: number, y: number): this;
  translate(x?: number, y?: number): Offset | this {
    if (arguments.length === 0) {
      return this.$parent.translate();
    }

    this.$parent.translate(x as number, y as number);

    return this;
  }
  arc(
    x: number,
    y: number,
    radius: number,
    astart: number,
    astop: number,
    reverse?: boolean
  ): this {
    this.begin();
    this.$context2d.arc(
      this.$parent._getPixel(x),
      this.$parent._getPixel(y),
      radius,
      this.$parent._toRadius(astart) - Math.PI / 2,
      this.$parent._toRadius(astop) - Math.PI / 2,
      reverse
    );
    this.close();

    return this;
  }
  pie(
    x: number,
    y: number,
    radius: number,
    astart: number,
    astop: number,
    reverse?: boolean
  ): this {
    return this.move(x, y).arc(x, y, radius, astart, astop, reverse).to(x, y);
  }
  line(x1: number, y1: number, x2: number, y2: number): this {
    // this.begin();
    return this.move(x1, y1).to(x2, y2);
    // this.close();fix
  }
  ellipse(
    x: number,
    y: number,
    radius1: number,
    radius2: number,
    astart: number,
    astop: number,
    reverse: number
  ): this {
    this.begin();
    this.$context2d.ellipse(
      this.$parent._getPixel(x),
      this.$parent._getPixel(y),
      radius1,
      radius2,
      this.$parent._toRadius(astart) - Math.PI / 2,
      this.$parent._toRadius(astop),
      reverse
    );
    this.close();

    return this;
  }
  circle(x: number, y: number, radius: number): this {
    return this.arc(
      x,
      y,
      radius,
      0,
      this.$parent.angleMode() === "degress" ? 360 : Math.PI * 2
    );
  }
  point(x: number, y: number): this {
    return this.circle(x, y, 1);
  }
  triangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): this {
    return this.move(x1, y1).to(x2, y2).to(x3, y3);
  }

  drawImage(image: CanvasImageSource, x: number, y: number): this;
  drawImage(
    image: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number
  ): this;
  drawImage(
    image: CanvasImageSource,
    sx: number,
    sy: number,
    swidth: number,
    sheight: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): this;
  drawImage(image: CanvasImageSource, ...args: number[]): this {
    // @ts-expect-error
    this.$context2d.drawImage(image, ...(args as ParamsDrawImage));

    return this;
  }
  rRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: string | number
  ): this;
  rRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radiusLeft: string | number,
    radiusRight: string | number
  ): this;
  rRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radiusTopLeft: string | number,
    radiusTopRight: string | number,
    radiusBottomRight: string | number,
    radiusBottomLeft: string | number
  ): this;
  rRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radiusTopLeft?: string | number,
    radiusTopRight?: string | number,
    radiusBottomRight?: string | number,
    radiusBottomLeft?: string | number
  ): this {
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
  rect(x: number, y: number, width: number, height: number): this {
    this.begin();
    [x, y, width, height] = this.$parent._argsRect(x, y, width, height);
    this.$context2d.rect(
      this.$parent._getPixel(x),
      this.$parent._getPixel(y),
      width,
      height
    );
    this.close();

    return this;
  }
  quadratic(cpx: number, cpy: number, x: number, y: number): this {
    this.$context2d.quadraticCurveTo(cpx, cpy, x, y);

    return this;
  }
  bezier(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): this {
    this.$context2d.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

    return this;
  }
  move(x: number, y: number): this {
    this.$context2d.moveTo(
      this.$parent._getPixel(x),
      this.$parent._getPixel(y)
    );

    return this;
  }
  to(x: number, y: number): this {
    this.$context2d.lineTo(
      this.$parent._getPixel(x),
      this.$parent._getPixel(y)
    );

    return this;
  }
  fillText(text: string, x: number, y: number, maxWidth?: number): this {
    this.$context2d.fillText(
      text,
      this.$parent._getPixel(x),
      this.$parent._getPixel(y),
      maxWidth
    );

    return this;
  }
  strokeText(text: string, x: number, y: number, maxWidth?: number): this {
    this.$context2d.strokeText(
      text,
      this.$parent._getPixel(x),
      this.$parent._getPixel(y),
      maxWidth
    );

    return this;
  }
  fillRect(x: number, y: number, width: number, height: number): this {
    this.$context2d.fillRect(
      this.$parent._getPixel(x),
      this.$parent._getPixel(y),
      width,
      height
    );

    return this;
  }
  strokeRect(x: number, y: number, width: number, height: number): this {
    this.$context2d.strokeRect(
      this.$parent._getPixel(x),
      this.$parent._getPixel(y),
      width,
      height
    );

    return this;
  }
  lineDashOffset(): number;
  lineDashOffset(value: number): this;
  lineDashOffset(value?: number): number | this {
    if (value === undefined) {
      return this.$context2d.lineDashOffset;
    }

    this.$context2d.lineDashOffset = value;

    return this;
  }
  lineDash(): number[];
  lineDash(segments: number[]): this;
  lineDash(...segments: number[]): this;
  lineDash(...segments: Array<number[] | number>): number[] | this {
    if (segments.length === 0) {
      return this.$context2d.getLineDash();
    }

    if (Array.isArray(segments[0])) {
      this.$context2d.setLineDash(segments[0]);
    }

    this.$context2d.setLineDash(segments as number[]);

    return this;
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this {
    this.$context2d.arcTo(
      this.$parent._getPixel(x1),
      this.$parent._getPixel(y1),
      this.$parent._getPixel(x2),
      this.$parent._getPixel(y2),
      radius
    );

    return this;
  }
  isPoint(x: number, y: number): boolean {
    return this.$context2d.isPointInPath(x, y);
  }
  createImageData(height: ImageData): ImageData;
  createImageData(width: number, height: number): ImageData;
  createImageData(width: ImageData | number, height?: number): ImageData {
    return height
      ? this.$parent.createImageData(width as number, height)
      : this.$parent.createImageData(width as ImageData);
  }
  getImageData(x: number, y: number, width: number, height: number): ImageData {
    return this.$parent.getImageData(x, y, width, height);
  }
  putImageData(imageData: ImageData, x: number, y: number): this;
  putImageData(
    imageData: ImageData,
    x: number,
    y: number,
    xs: number,
    ys: number,
    width: number,
    height: number
  ): this;
  putImageData(
    imageData: ImageData,
    x: number,
    y: number,
    xs?: number,
    ys?: number,
    width?: number,
    height?: number
  ): this {
    if (arguments.length === 7) {
      this.$parent.putImageData(
        imageData,
        x,
        y,
        xs as number,
        ys as number,
        width as number,
        height as number
      );
    } else {
      this.$parent.putImageData(imageData, x, y);
    }

    return this;
  }
  createPattern(
    image: CanvasImageSource,
    direction: DirectionPattern
  ): CanvasPattern | null {
    return this.$parent.createPattern(image, direction);
  }
  createRadialGradient(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
  ): CanvasGradient {
    return this.$parent.createRadialGradient(x1, y1, r1, x2, y2, r2);
  }
  createLinearGradient(
    x: number,
    y: number,
    width: number,
    height: number
  ): CanvasGradient {
    return this.$parent.createLinearGradient(x, y, width, height);
  }

  lineJoin(): LineJoin;
  lineJoin(type: LineJoin): this;
  lineJoin(type?: LineJoin): LineJoin | this {
    if (type === undefined) {
      return this.$context2d.lineJoin;
    }

    this.$context2d.lineJoin = type;

    return this;
  }
  lineCap(): LineCap;
  lineCap(value: LineCap): this;
  lineCap(value?: LineCap): LineCap | this {
    if (value === undefined) {
      return this.$context2d.lineCap;
    }
    this.$context2d.lineCap = value;
    return this;
  }
  shadowBlur(): number;
  shadowBlur(opacity: number): this;
  shadowBlur(opacity?: number): number | this {
    if (opacity === undefined) {
      return this.$context2d.shadowBlur;
    }

    this.$context2d.shadowBlur = opacity;

    return this;
  }

  shadowColor(
    hue: number,
    saturation: number,
    lightness: number,
    alpha?: number
  ): this;
  shadowColor(red: number, green: number, blue: number, alpha?: number): this;
  shadowColor(
    color?: string | CanvasGradient | CanvasImageSource | number
  ): this;
  shadowColor(...args: ParamsToRgb): this {
    this.$context2d.shadowColor = this.$parent._toRgb(args);

    return this;
  }
  drawFocusIfNeeded(element: Element): this;
  drawFocusIfNeeded(path: Path2D, element: Element): this;
  drawFocusIfNeeded(path: Element | Path2D, element?: Element): this {
    if (element === undefined) {
      this.$context2d.drawFocusIfNeeded(path as Element);
    } else {
      this.$context2d.drawFocusIfNeeded(path as Path2D, element);
    }

    return this;
  }

  polyline(...points: number[]): this;
  polyline(...points: [number, number][]): this;
  polyline(...points: number[] | Array<[number, number]>): this {
    if (points.length > 0) {
      if (Array.isArray(points[0])) {
        this.move(points[0][0], points[0][1]);

        let index = 1;
        const { length } = points;

        while (index < length) {
          this.to(
            (points[index] as [number, number])[0],
            (points[index] as [number, number])[1]
          );
          index++;
        }
      } else {
        if (points.length > 1) {
          this.move(points[0], points[1] as number);

          let index = 2;
          const { length } = points;

          while (index < length - 1) {
            this.to(points[index] as number, points[index + 1] as number);
            index += 2;
          }
        }
      }
    }

    return this;
  }
  polygon(...points: number[]): this;
  polygon(...points: [number, number][]): this;
  polygon(...points: number[] | Array<[number, number]>): this {
    if (Array.isArray(points[0])) {
      this.polyline(...(points as [number, number][]), points[0]);
    } else {
      this.polyline(
        ...(points as number[]),
        points[0] as number,
        points[1] as number
      );
    }

    return this;
  }

  drawing(program: noop): void {
    this.begin();
    program.call(this);
    this.close();
  }
  backup(program: noop): void {
    this.save();
    program.call(this);
    this.restore();
  }
}

export class Point3D extends MyElement {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(x?: number, y?: number, z?: number) {
    super();
    [this.x, this.y, this.z] = [x || 0, y || 0, z || 0];
  }
  rotateX(angle: number): void {
    this.y =
      this.y * this.$parent.cos(angle) + this.z * this.$parent.sin(angle);
    this.z =
      -this.y * this.$parent.sin(angle) + this.z * this.$parent.cos(angle);
  }
  rotateY(angle: number): void {
    this.x =
      this.x * this.$parent.cos(angle) + this.z * this.$parent.sin(angle);
    this.z =
      -this.x * this.$parent.sin(angle) + this.z * this.$parent.cos(angle);
  }
  rotateZ(angle: number): void {
    this.x =
      this.x * this.$parent.cos(angle) - this.y * this.$parent.sin(angle);
    this.y =
      this.x * this.$parent.sin(angle) + this.y * this.$parent.cos(angle);
  }
}

export class Point3DCenter extends MyElement {
  private static persistent = 1000;
  private __x: number;
  private __y: number;
  private __z: number = 0;

  constructor(x: number, y: number, z?: number) {
    super();
    [this.__x, this.__y, this.__z] = [x, y, z || 0];
  }
  public get scale(): number {
    return Point3DCenter.persistent / (Point3DCenter.persistent + this.__z);
  }
  public get x(): number {
    return (
      (this.__x - this.$parent.width / 2) * this.scale + this.$parent.width / 2
    );
  }
  public set x(value: number) {
    this.__x = value;
  }
  public get y(): number {
    return (
      (this.__y - this.$parent.height / 2) * this.scale +
      this.$parent.height / 2
    );
  }
  public set y(value: number) {
    this.__y = value;
  }
  public get z(): number {
    return this.__z;
  }
  public set z(value: number) {
    this.__z = value;
  }

  public get(value: number): number;
  public get(prop: string): number;
  public get(prop: number | string): number {
    if (typeof prop === "number") {
      return this.scale * prop;
    }

    return this.scale * (this as any)[prop];
  }
}

export function createElement(callback: {
  (canvas: MyElement): void;
}): MyElement {
  return new (class extends MyElement {
    draw: noop = () => {
      callback(this);
    };
  })();
}
