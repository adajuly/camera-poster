<template>
  <input type="file" :style="inputStyle" class="camera-input" accept="image/*;capture=camera" @change="onChange" />
</template>

<script>
import xEmitter from "xemitterjs";

export default {
  name: "CameraInput",
  props: {
    styleObject: Object,
    changeCB: Function,
  },
  computed: {
    inputStyle: function() {
      return this.styleObject ? this.styleObject : { position: "absolute", left: 0, top: 0 };
    }
  },
  mounted() {},
  methods: {
    onChange: function(e) {
      const file = e.target.files[0];
      // 增加安全审核
      // await ....
      this.changeCB&&this.changeCB(file)
      xEmitter.emit("PHOTO_UPLOAD", file);
      // this.resetValue(e);
    },
    resetValue(e) {
      setTimeout(() => (e.target.value = null), 200);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.camera-input {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  outline: 0;
  opacity: 0;
}
</style>
