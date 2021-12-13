export default class Rect {
  constructor(conf) {
    this.id = "";
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.scale = 1;
    this.rotation = 0;
    this.points = null;
    this.init(conf);
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
  }

  getID() {
    return this.id;
  }

  getByID($id) {
    if ($id === this.id) return this;
    else return null;
  }

  init(conf) {
    this.initGlobal(conf);
    this.getHypotenuse();
  }

  initGlobal(conf) {
    this.id = conf.id || "null_" + Math.random();
    this.x = conf.x || 0;
    this.y = conf.y || 0;
    this.width = conf.width || 0;
    this.height = conf.height || 0;
    this.scale = conf.scale || 1;
    this.rotation = conf.rotation || 0;
    this.points = [0, 0, 0, 0];
  }

  //////////////////////////////////////////////////////////////////
  //
  //       1 ********** 2
  //       *            *
  //       4 ********** 3
  //
  //////////////////////////////////////////////////////////////////
  getPoint(num, disx = 0, disy = 0) {
    let x1 = ((num % 3 == 0 ? -1 : 1) * this.scale * this.width) / 2 + disx;
    let y1 = ((num <= 1 ? -1 : 1) * this.scale * this.height) / 2 + disy;
    this.points[num] = this.rotateCoordinates(x1, y1, this.rotation);

    return this.points[num];
  }

  updateTransform(x1, y1, s, r) {
    this.x = x1;
    this.y = y1;
    this.scale = s;
    this.rotation = r;
  }

  // 斜边和角度
  getHypotenuse(num = 1) {
    const hypotenuse = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
    const bevel = Math.atan2((num <= 1 ? -1 : 1) * this.height, (num % 3 == 0 ? -1 : 1) * this.width);

    return [hypotenuse, bevel];
  }

  // rotate coord
  rotateCoordinates(x1, y1, angle) {
    let x2 = this.x + Math.cos(angle) * x1 - Math.sin(angle) * y1;
    let y2 = this.y + Math.sin(angle) * x1 + Math.cos(angle) * y1;
    return [x2, y2];
  }
}
