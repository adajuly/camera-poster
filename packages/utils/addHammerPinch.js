import xEmitter from "xemitterjs";
import RAFManager from "raf-manager";

const debug = false;
let added = false;

function addHammerPinch(Hammer) {
  if (added) return;
  added = true;

  Hammer.setPinch = function(rect) {
    let initScale = 1;
    let initRotation = 0;

    // recognize Hammer Manager
    const mc = new Hammer.Manager(rect.element);
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get("pan"));
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get("pan"), mc.get("rotate")]);
    mc.add(new Hammer.Tap());
    mc.add(new Hammer.Press({ event: "press" }));

    // add Event
    mc.on("panstart panmove panend", onPan);
    mc.on("rotatestart rotatemove", onRotate);
    mc.on("pinchstart pinchmove", onPinch);
    mc.on("tap", onTap);
    mc.on("press", onPress);

    // event Handler
    function onPan(e) {
      rect.x = rect.start.x + e.deltaX;
      rect.y = rect.start.y + e.deltaY;

      printEventInfo(e);
      addTransformUpdate();
      if (e.type == "panstart") {
        disPatchEvent(1);
      } else if (e.type == "panend") {
        disPatchEvent(2);
        touchOver(rect);
      }
    }

    function onRotate(e) {
      if (e.type == "rotatestart") initRotation = rect.rotation || 0;
      rect.rotation = initRotation + e.rotation;

      printEventInfo(e);
      addTransformUpdate();
    }

    function onPinch(e) {
      if (e.type == "pinchstart") {
        initScale = rect.scaleX || 1;
        disPatchEvent(1);
      }

      rect.scaleX = rect.scaleY = initScale * e.scale;
      printEventInfo(e);
      addTransformUpdate();

      if (e.type == "pinchend") {
        touchOver(rect);
      }
    }

    function onTap(e) {
      printEventInfo(e);
      disPatchEvent(1);
      disPatchEvent(2);
    }

    function onPress(e) {
      printEventInfo(e);
      disPatchEvent(1);
      disPatchEvent(2);
    }

    function touchOver(rect) {
      RAFManager.remove(transformUpdateFunc);
      rect.start.x = rect.x;
      rect.start.y = rect.y;
    }

    // 1是添加 2是拖动
    function disPatchEvent(type = 2) {
      if (type == 1) xEmitter.emit("SWAP_SPRITE", rect);
      else xEmitter.emit("UPDATE_TRANSFORM", rect);
    }

    function printEventInfo(e) {
      if (debug) console.log(e.type);
    }

    const transformUpdateFunc = () => disPatchEvent(2);

    function addTransformUpdate() {
      transformUpdateFunc();
      // if (RAFManager.getIndex(transformUpdateFunc) < 0) {
      //   RAFManager.add(transformUpdateFunc);
      // }
    }

    mc.transformUpdateFunc = transformUpdateFunc;
    return mc;
  };

  Hammer.destroyPinch = function(mc) {
    RAFManager.remove(mc.transformUpdateFunc);
    mc.destroy();
  };
}

export default addHammerPinch;
