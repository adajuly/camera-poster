<template>
  <canvas class="canvas" ref="canvasRef" />
</template>

<script>
import ppo from "ppo";
import xEmitter from "xemitterjs";
import RAFManager from "raf-manager";
import Utils from "../utils/Utils";

let PIXI;
const FPI = Math.PI / 180;

export default {
  name: "CanvasDraw",
  props: {
    styleObject: Object,
    width: Number,
    height: Number,
    photoWidth: Number,
    frontImg: String,
    backImg: String,
    frontImgPos: String,
    backImgPos: String,
    background: {
      type: String,
      default: "#ffffff"
    },
    quality: {
      type: Number,
      default: 85
    },
    backImgSize: {
      type: String,
      default: "cover"
    },
    ratio: Number
  },
  data: function() {
    return {
      photo: null,
      spritesObj: {}
    };
  },
  mounted() {
    ppo.loadjs("//adajuly.github.io/libs/pixi.canvas.min.js", async () => {
      PIXI = window.PIXI;
      await Utils.sleep(20);
      this.initPIXI();
      this.addListener();
      this.addFrontAndBackImg();
    });
  },
  destroyed() {
    const { renderer, render } = this;
    xEmitter.off("ADD_ICON", this.addIconSprite);
    xEmitter.off("SWAP_SPRITE", this.swapSprite);
    xEmitter.off("PHOTO_UPLOAD", this.addPhotoSprite);
    xEmitter.off("REMOVE_ICON", this.removeIconSprite);
    xEmitter.off("CHANGE_FRONT_IMG", this.changeFrontImg);
    xEmitter.off("UPDATE_TRANSFORM", this.addPhotoSprite);

    RAFManager.remove(render);
    renderer.destroy(true);
  },

  //-----------------------------------------
  // all methods
  //-----------------------------------------
  methods: {
    initPIXI: function() {
      let renderOpt = {};
      if (this.background == "transparent") renderOpt = { transparent: true };
      const background = Number(this.background.replace("#", "0x"));
      const canvas = this.$refs.canvasRef;
      const stage = new PIXI.Stage(background);
      const container = new PIXI.DisplayObjectContainer();

      const canvasWidth = this.width * this.ratio;
      const canvasHeight = this.height * this.ratio;
      const renderer = new PIXI.CanvasRenderer(canvasWidth, canvasHeight, {
        view: canvas,
        resolution: 1,
        ...renderOpt
      });
      stage.addChild(container);

      this.container = container;
      this.renderer = renderer;
      this.stage = stage;

      this.render = this.render.bind(this);
      RAFManager.add(this.render);
    },

    addListener: function() {
      this.addPhotoAndResize = this.addPhotoAndResize.bind(this);
      this.removeIconSprite = this.removeIconSprite.bind(this);
      this.updateTransform = this.updateTransform.bind(this);
      this.changeFrontImg = this.changeFrontImg.bind(this);
      this.addIconSprite = this.addIconSprite.bind(this);
      this.swapSprite = this.swapSprite.bind(this);

      xEmitter.on("ADD_ICON", this.addIconSprite);
      xEmitter.on("REMOVE_ICON", this.removeIconSprite);
      xEmitter.on("SWAP_SPRITE", this.swapSprite);
      xEmitter.on("PHOTO_UPLOAD", this.addPhotoAndResize);
      xEmitter.on("CHANGE_FRONT_IMG", this.changeFrontImg);
      xEmitter.on("UPDATE_TRANSFORM", this.updateTransform);
    },

    toDataURL: function(type) {
      const { renderer } = this;
      return renderer.view.toDataURL(type);
    },

    addFrontAndBackImg: function() {
      const { stage } = this;
      const width = this.getCanvasWidth();
      const height = this.getCanvasHeight();
      const frontCon = new PIXI.DisplayObjectContainer();
      stage.addChild(frontCon);
      this.frontCon = frontCon;

      if (this.frontImg) {
        const front = PIXI.Sprite.fromImage(this.frontImg);
        Utils.convertToPos({
          sprite: front,
          pos: this.frontImgPos,
          width,
          height
        });
        frontCon.addChild(front);
        this.front = front;
      }

      if (this.backImg) {
        const backCon = new PIXI.DisplayObjectContainer();
        const back = PIXI.Sprite.fromImage(this.backImg);
        Utils.convertToPos({
          sprite: back,
          pos: this.backImgPos,
          width,
          height
        });

        if (this.backImgSize == "cover") {
          Utils.coverSize({
            sprite: back,
            width,
            height
          });
        }

        backCon.addChild(back);
        stage.addChildAt(backCon, 0);
      }
    },

    changeFrontImg: function(src) {
      const { front } = this;
      front.setTexture(PIXI.Texture.fromImage(src));
    },

    render: function() {
      const { renderer, stage } = this;
      renderer.render(stage);
    },

    //-----------------------------------------
    // add photo and resize photo
    //-----------------------------------------
    addPhotoAndResize: function(file) {
      ppo.loadjs("//adajuly.github.io/libs/canvas-resize.js", () => {
        const GAP = 50;
        window.canvasResize(file, {
          width: this.getCanvasWidth() + GAP,
          height: this.getCanvasHeight() + GAP,
          crop: false,
          quality: this.quality,
          callback: (canvas, width, height) => {
            this.addPhotoSprite({ canvas, width, height });
          }
        });
      });
    },

    addPhotoSprite: function(data) {
      const { canvas } = data;
      let { photo, container, spritesObj } = this;
      if (!photo) {
        photo = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
        photo.id = `photo_${ppo.uuid()}`;
        spritesObj[photo.id] = photo;
        this.photo = photo;
      } else {
        photo.setTexture(PIXI.Texture.fromCanvas(canvas));
      }

      photo.anchor.x = photo.anchor.y = 0.5;
      photo.position.x = this.getCanvasWidth() / 2;
      photo.position.y = this.getCanvasHeight() / 2;
      this.resizePhotoSprite(photo, data);
      container.addChildAt(photo, 0);
      setTimeout(() => xEmitter.emit("ADD_PROXY_PHOTO", photo), 50);
    },

    resizePhotoSprite(photo, data) {
      let swidth, sheight;
      const scale = data.width / data.height;
      const targetWidth = this.photoWidth || this.getCanvasWidth();
      swidth = targetWidth;
      sheight = targetWidth / scale;

      photo.width = swidth;
      photo.height = sheight;
      photo.initScale = photo.scale.x;
    },

    addIconSprite: function(image) {
      const { frontCon, spritesObj } = this;
      const icon = PIXI.Sprite.fromImage(image);
      icon.initScale = 1;
      icon.anchor.x = icon.anchor.y = 0.5;
      icon.position.x = ppo.randomFromA2B(icon.width / 2, this.getCanvasWidth() - icon.width / 2) >> 0;
      icon.position.y = ppo.randomFromA2B(icon.height / 2, this.getCanvasHeight() - icon.height / 2) >> 0;
      icon.id = `icon_${ppo.uuid()}`;
      spritesObj[icon.id] = icon;
      frontCon.addChild(icon);

      setTimeout(() => xEmitter.emit("ADD_PROXY_ICON", icon), 50);
    },

    removeIconSprite(id) {
      const { spritesObj } = this;
      if (spritesObj[id]) {
        const sprite = spritesObj[id];
        sprite.parent && sprite.parent.removeChild(sprite);
        delete spritesObj[id];
      }
    },

    swapSprite: function(rect) {
      if (/^photo/gi.test(rect.id)) return;

      const { spritesObj } = this;
      const sprite = spritesObj[rect.id];
      if (sprite && sprite.parent) {
        sprite.parent.addChild(sprite);
      }
    },

    //-----------------------------------------
    // update pos when touch proxy
    //-----------------------------------------
    updateTransform: function(rect) {
      const { spritesObj, ratio } = this;

      if (spritesObj[rect.id]) {
        const sprite = spritesObj[rect.id];
        sprite.position.x = rect.x * ratio;
        sprite.position.y = rect.y * ratio;
        sprite.scale.x = sprite.scale.y = rect.scaleX * sprite.initScale;
        sprite.rotation = rect.rotation * FPI;
      }
    },

    getCanvasWidth: function() {
      const { renderer } = this;
      return renderer.width;
    },
    getCanvasHeight: function() {
      const { renderer } = this;
      return renderer.height;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
}
</style>
