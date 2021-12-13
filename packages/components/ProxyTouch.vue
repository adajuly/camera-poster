<template>
  <div class="proxy-canvas" ref="proxyCanvas"></div>
</template>

<script>
import ppo from "ppo";
import Agile from "agilejs";
import xEmitter from "xemitterjs";
import Rect from "../utils/Rect";
import Utils from "../utils/Utils";
import Strip from "../utils/Strip";
import addHammerPinch from "../utils/addHammerPinch";

export default {
  name: "ProxyTouch",
  props: {
    width: Number,
    height: Number,
    ratio: Number,
    alpha: Number,
  },
  data: function() {
    return {
      photo: null,
      currentObj: null,
      proxyObjs: {}
    };
  },
  mounted() {
    ppo.loadjs("//cdn.bootcdn.net/ajax/libs/hammer.js/2.0.4/hammer.min.js", async () => {
      const { Hammer } = window;
      addHammerPinch(Hammer);
      await Utils.sleep(20);
      this.addContainer();
      this.addListener();
      this.addStrip();
    });
  },
  destroyed() {
    const { container } = this;
    xEmitter.off("ADD_PROXY_PHOTO", this.addProxyPhoto);
    xEmitter.off("REMOVE_ICON", this.removeProxyIcon);
    xEmitter.off("ADD_PROXY_ICON", this.addProxyIcon);
    xEmitter.off("SWAP_SPRITE", this.swapSprite);

    this.strip.destroy();
    container.destroy();
  },
  methods: {
    addContainer: function() {
      const { width, height } = this;
      const stage = new Agile.Dom(this.$refs.proxyCanvas);
      const container = new Agile.Rect(0, 0);
      
      Agile.mode = '3d';
      container.originalWidth = width;
      container.originalHeight = height;
      container.color = Agile.Color.alpha0;
      container.zIndex = 8;
      container.regX = 0;
      container.regY = 0;
      container.z = 1;

      container.css({
        overflow: "hidden",
        left: "0px",
        top: "0px"
      });

      container.touchStart((x, y, e) => {
        if (e.target === container.element || /^photo/gi.test(e.target.id)) {
          xEmitter.emit("REMOVE_STRIP");
        }
      });

      stage.addChild(container);
      this.container = container;
    },

    addListener: function() {
      this.removeProxyIcon = this.removeProxyIcon.bind(this);
      this.addProxyPhoto = this.addProxyPhoto.bind(this);
      this.addProxyIcon = this.addProxyIcon.bind(this);
      this.swapSprite = this.swapSprite.bind(this);

      xEmitter.on("ADD_PROXY_PHOTO", this.addProxyPhoto);
      xEmitter.on("ADD_PROXY_ICON", this.addProxyIcon);
      xEmitter.on("REMOVE_ICON", this.removeProxyIcon);
      xEmitter.on("SWAP_SPRITE", this.swapSprite);
    },

    addStrip: function() {
      const { proxyObjs, container, ratio } = this;
      const strip = new Strip({
        container,
        proxyObjs,
        ratio
      });

      this.strip = strip;
    },

    swapSprite: function(rect) {
      if (/^photo/gi.test(rect.id)) return;
      let { container } = this;
      container.addChild(rect);
    },

    addProxyPhoto: function(obj) {
      let { photo, container, ratio } = this;

      if (!photo) photo = new Agile.Rect();
      photo.originalWidth = obj.width / ratio;
      photo.originalHeight = obj.height / ratio;
      photo.x = obj.x / ratio;
      photo.y = obj.y / ratio;
      photo.id = obj.id;
      photo.start = { x: photo.x, y: photo.y };
      photo.alpha = 0;

      container.addChildAt(photo, 0);
      this.addTouchPinch(photo, null);
      this.photo = photo;
    },

    addProxyIcon: function(obj) {
      const { container, ratio } = this;

      const icon = new Agile.Rect();
      icon.originalWidth = obj.width / ratio;
      icon.originalHeight = obj.height / ratio;
      icon.x = obj.x / ratio;
      icon.y = obj.y / ratio;
      icon.id = obj.id;
      icon.start = { x: icon.x, y: icon.y };
      icon.alpha = this.alpha || 0;
      container.addChild(icon);

      const rect = new Rect({
        id: icon.id,
        x: icon.x,
        y: icon.y,
        rotation: icon.rotation,
        scale: icon.scaleX,
        width: icon.originalWidth,
        height: icon.originalHeight
      });

      this.addTouchPinch(icon, rect);
    },

    removeProxyIcon: function(id) {
      const { Hammer } = window;
      const { proxyObjs } = this;
      const proxyObj = proxyObjs[id];
      if (!proxyObj) return;

      if (proxyObj.div.parent) proxyObj.div.parent.removeChild(proxyObj.div);
      proxyObj.div.destroy();
      Hammer.destroyPinch(proxyObj.mc);
      delete proxyObjs[id];
    },

    addTouchPinch: function(div, rect) {
      const { Hammer } = window;
      const { proxyObjs } = this;
      const id = div.id;
      if (proxyObjs[id]) Hammer.destroyPinch(proxyObjs[id].mc);

      const mc = Hammer.setPinch(div);
      proxyObjs[id] = { id, mc, div, rect };
      return mc;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.proxy-canvas {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
