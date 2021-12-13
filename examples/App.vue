<template>
  <div id="app">
    <CameraPoster
      v-if="show"
      class="poster"
      ref="cameraposter"
      :styleObject="styleObject"
      :frontImg="front1"
      :backImg="back"
      :photoWidth="300"
      frontImgPos="CB"
      background="transparent"
    />

    <div>
      <div class="icon" @click="onClick('01')"><img src="./assets/01.png" width="100%" /></div>
      <div class="icon" @click="onClick('02')"><img src="./assets/02.png" width="100%" /></div>
      <div class="icon" @click="onClick('03')"><img src="./assets/03.png" width="100%" /></div>
      <div class="icon" @click="onClick('04')"><img src="./assets/04.png" width="100%" /></div>
    </div>

    <div>
      <div class="button"><CameraInput :changeCB="showFile"/>上 传</div>
      <div class="btn-group">
        <div class="button" @click="clickChange">换一换</div>
        <div class="button" @click="screenshotChange">截 图</div>
      </div>
    </div>

    <div class="btn-right">
      <div class="button" @click="show = !show">卸载场景</div>
    </div>
  </div>
</template>

<script>
import { CameraInput, CameraPoster } from "../packages";
import front1 from "./assets/front1.png";
import front2 from "./assets/front2.png";
import back from "./assets/back.jpg";

export default {
  name: "App",
  components: {
    CameraInput,
    CameraPoster
  },
  data: function() {
    return {
      styleObject: {
        //height:
      },
      show: true,
      index: 0,
      front1: front1,
      back: back
    };
  },
  methods: {
    showFile(f){
      console.log(f)
    },
    onClick: function(id) {
      this.$refs.cameraposter.addIcon(require(`./assets/${id}.png`));
    },
    clickChange: function() {
      this.index++;
      const img = this.index % 2 == 0 ? front1 : front2;
      this.$refs.cameraposter.changeFrontImg(img);
    },
    screenshotChange: function() {
      const img = this.$refs.cameraposter.toImage(200);
      document.body.append(img);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  margin-top: 40px;
}
.button {
  margin: 20px auto;
  width: 180px;
  height: 50px;
  background: #fccff2;
  position: relative;
  line-height: 50px;
}
.btn-group .button {
  display: inline-block;
  margin-right: 20px;
  margin-top: 0;
  height: 40px;
  width: 120px;
  background: #22ccff;
  line-height: 40px;
  cursor: pointer;
}
.btn-right {
  position: absolute;
  z-index: 99;
  right: 6px;
  top: 6px;
}
.btn-right .button {
  margin-top: 0;
  height: 40px;
  width: 80px;
  background: green;
  line-height: 40px;
  color: #fff;
  cursor: pointer;
}
.poster {
  margin: 0 auto;
  width: 90%;
  height: 400px;
  background: #ffcccc;
}
.icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  margin: 10px;
  margin-top: 20px;
}
</style>
