class Flag extends Phaser.GameObjects.Sprite {
  static WIDTH = 32;
  static HEIGHT = 48;
  static COLOR = 0xfe654f;

  constructor(scene, x, y) {
    super(scene, x, y, 'flag');
    scene.add.existing(this);
    this.setOrigin(0, 0);
    this.setTint(Flag.COLOR);
    this.setDepth(2);
    this.setDisplaySize(Flag.WIDTH, Flag.HEIGHT);
  }
}

export default Flag;
