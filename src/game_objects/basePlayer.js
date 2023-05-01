class basePlayer extends Phaser.GameObjects.Sprite {
  constructor(gameState, x, y, id) {}

  destroy() {
    super.destroy();
    this.bow.destroy();
  }
}
