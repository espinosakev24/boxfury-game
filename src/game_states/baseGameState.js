class BaseGameState {
  constructor(scene) {
    this.scene = scene;
    this.graphics = this.scene.add.graphics();
  }

  update(time, delta) {}
}

export default BaseGameState;
