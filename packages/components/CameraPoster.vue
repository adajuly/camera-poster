<template>
  <div class="canvas-con" :style="getStyle()" ref="canvasConRef">
    <proxy-touch :width="getWidth()" :height="getHeight()" :ratio="ratio" :alpha="alpha"/>
    <canvas-draw
      :width="getWidth()"
      :height="getHeight()"
      :quality="quality"
      :photoWidth="photoWidth"
      :ratio="ratio"
      :background="background"
      :frontImg="frontImg"
      :backImg="backImg"
      :frontImgPos="frontImgPos"
      :backImgSize="backImgSize"
      :backImgPos="backImgPos"
      ref="canvasDraw"
    />
  </div>
</template>

<script>
import xEmitter from "xemitterjs";
import CanvasDraw from "./CanvasDraw";
import ProxyTouch from "./ProxyTouch";

export default {
  name: "ComeraPoster", 
  components: { ProxyTouch, CanvasDraw },
  props: {
    styleObject: Object,
    width: Number,
    height: Number,
    quality: Number,
    background: String,
    frontImg: String,
    photoWidth: Number,
    frontImgPos: {
      type: String,
      default: "CC"
    },
    backImg: String,
    backImgSize: String,
    backImgPos: {
      type: String,
      default: "CC"
    },
    ratio: {
      type: Number,
      default: 2
    },
    alpha: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {};
  },
  mounted() {
    this.$forceUpdate();
  },
  methods: {
    addIcon: function(src) {
      xEmitter.emit("ADD_ICON", src);
    },

    changeFrontImg: function(src) {
      xEmitter.emit("CHANGE_FRONT_IMG", src);
    },

    toDataURL: function(png = "image/png") {
      return this.$refs.canvasDraw.toDataURL(png);
    },

    toImage: function(width, height) {
      const data = this.toDataURL();
      const image = new Image();
      image.src = data;
      if (width) image.width = width;
      if (height) image.height = height;

      return image;
    },

    getSize: function(type) {
      let size = 0;
      const ref = this.$refs.canvasConRef;
      if (ref) {
        if (type == "height") {
          size = ref.clientHeight || ref.getBoundingClientRect()[type];
        } else {
          size = ref.clientWidth || ref.getBoundingClientRect()[type];
        }
      }

      return parseInt(size);
    },
    getStyle: function() {
      const { width, height } = this;
      return { ...this.styleObject, width, height };
    },
    getWidth: function() {
      let { width } = this.getStyle();
      width = width || this.getSize("width");
      return parseInt(width);
    },
    getHeight: function() {
      let { height } = this.getStyle();
      height = height || this.getSize("height");
      return parseInt(height);
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
.canvas-con {
  position: relative;
}
</style>
