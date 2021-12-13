export default {
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  convertToPos({ sprite, pos, width, height }) {
    pos = pos.toUpperCase().split("");
    const x = pos[0];
    const y = pos[1];

    switch (x) {
      case "R":
        sprite.anchor.x = 1;
        sprite.position.x = width;
        break;

      case "L":
        sprite.anchor.x = 0;
        sprite.position.x = 0;
        break;

      default:
        sprite.anchor.x = 0.5;
        sprite.position.x = width / 2;
        break;
    }

    switch (y) {
      case "B":
        sprite.anchor.y = 1;
        sprite.position.y = height;
        break;

      case "T":
        sprite.anchor.y = 0;
        sprite.position.y = 0;
        break;

      default:
        sprite.anchor.y = 0.5;
        sprite.position.y = height / 2;
        break;
    }
  },

  coverSize({ sprite, width, height }) {
    const texture = sprite.texture.baseTexture;

    const loadFun = () => {
      const w = sprite.width;
      const h = sprite.height;
      const scale1 = w / h;
      const scale2 = width / height;

      if (scale1 > scale2) {
        sprite.height = height;
        sprite.width = scale1 * sprite.height;
      } else {
        sprite.width = width;
        sprite.height = sprite.width / scale1;
      }
    };

    if (texture.hasLoaded) {
      loadFun();
    } else {
      texture.on("loaded", loadFun);
    }
  }
};
