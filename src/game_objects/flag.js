class Flag extends Phaser.GameObjects.Rectangle {
  static WIDTH = 10;
  static HEIGHT = 32;

  constructor(scene, x, y) {
    super(scene, x, y, Flag.WIDTH, Flag.HEIGHT, 0xfe654f, 1.0);
    scene.add.existing(this);
    this.setOrigin(0, 0);
  }
}

export default Flag;
