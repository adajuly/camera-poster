import Agile from "agilejs";
import xEmitter from "xemitterjs";
import { removeIcon, zoomIcon } from "../utils/Icon";

export default class Strip {
  constructor(conf) {
    this.initGlobal(conf);
    this.initUI();
    this.initInteractive();
    this.addListener();
  }

  initGlobal(conf) {
    this.container = conf.container;
    this.proxyObjs = conf.proxyObjs;
    this.ratio = conf.ratio || 2;
    this.zoomIcon = conf.zoomIcon || zoomIcon;
    this.removeIcon = conf.removeIcon || removeIcon;

    this.point1 = [];
    this.point2 = [];
    this.point3 = [];
    this.point4 = [];

    this.distance = 0;
    this.currentObj = null;
  }

  initUI() {
    const removeBtn = new Agile.Image(this.removeIcon);
    removeBtn.regX = 0.5;
    removeBtn.regY = 0.5;
    removeBtn.alpha = 0;
    removeBtn.scaleX = removeBtn.scaleY = 1 / this.ratio;

    const zoomBtn = new Agile.Image(this.zoomIcon);
    zoomBtn.regX = 0.5;
    zoomBtn.regY = 0.5;
    zoomBtn.alpha = 0;
    zoomBtn.scaleX = zoomBtn.scaleY = 1 / this.ratio;

    this.zoomBtn = zoomBtn;
    this.removeBtn = removeBtn;
  }

  initInteractive() {
    const { Hammer } = window;
    const { zoomBtn, removeBtn } = this;

    removeBtn.touchStart(() => {
      let { currentObj } = this;
      if (!currentObj) return;

      xEmitter.emit("REMOVE_ICON", currentObj.id);
      this.currentObj = null;
    });

    const onPan = e => {
      let { currentObj } = this;
      let x, y;
      let rect = currentObj.div;
      x = e.deltaX + rect.firstStrip.x;
      y = e.deltaY + rect.firstStrip.y;

      if (e.type === "panend") {
        rect.firstStrip.x = x;
        rect.firstStrip.y = y;
        rect.notFirstMove = false;
      } else {
        rect.notFirstMove = true;
      }

      //set rotation scale
      let _hypotenuse = currentObj.rect.getHypotenuse()[0];
      let _bevel = currentObj.rect.getHypotenuse()[1];
      let ry = y - rect.y;
      let rx = x - rect.x;
      let bevel = ((Math.atan2(ry, rx) - _bevel) * 180) / Math.PI;
      let scale = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2)) / _hypotenuse;

      rect.scaleX = rect.scaleY = scale;
      rect.rotation = bevel;

      xEmitter.emit("UPDATE_TRANSFORM", rect);
    };

    const mc = new Hammer.Manager(zoomBtn.element);
    mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));
    mc.on("panstart panmove panend", onPan);
    this.mc = mc;
  }

  addListener() {
    this.updateTransform = this.updateTransform.bind(this);
    this.removeAllStrip = this.removeAllStrip.bind(this);

    xEmitter.on("UPDATE_TRANSFORM", this.updateTransform);
    xEmitter.on("REMOVE_ICON", this.removeAllStrip);
    xEmitter.on("REMOVE_STRIP", this.removeAllStrip);
  }

  removeAllStrip() {
    const { removeBtn, zoomBtn } = this;
    if (removeBtn.parent) removeBtn.parent.removeChild(removeBtn);
    if (zoomBtn.parent) zoomBtn.parent.removeChild(zoomBtn);
  }

  updateTransform(rect) {
    if (/photo/gi.test(rect.id)) return;

    let { proxyObjs, currentObj, removeBtn, zoomBtn, container } = this;

    currentObj = proxyObjs[rect.id];
    currentObj.rect.updateTransform(rect.x, rect.y, rect.scaleX, (rect.rotation * Math.PI) / 180);

    this.point1 = currentObj.rect.getPoint(0);
    this.point2 = currentObj.rect.getPoint(1);

    removeBtn.x = this.point1[0];
    removeBtn.y = this.point1[1];

    zoomBtn.x = this.point2[0];
    zoomBtn.y = this.point2[1];

    removeBtn.alpha = 1;
    zoomBtn.alpha = 1;
    container.addChild(removeBtn);
    container.addChild(zoomBtn);

    if (!rect.notFirstMove) {
      rect.firstStrip = { x: this.point2[0], y: this.point2[1] };
    }

    this.currentObj = currentObj;
  }

  destroy() {
    xEmitter.off("UPDATE_TRANSFORM", this.updateTransform);
    xEmitter.off("REMOVE_STRIP", this.removeAllStrip);
    xEmitter.off("REMOVE_ICON", this.removeAllStrip);
    this.removeAllStrip();
    this.mc.destroy();
  }
}
