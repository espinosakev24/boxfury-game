import { PLAYER_MOVEMENTS } from "../constants";
import Player from "./player.js";

class MPC extends Phaser.GameObjects.Sprite {
  constructor(gameState, x, y, id) {
    super(gameState.scene, x, y, "player");
    this.id = id;
    this.gameState = gameState;
    this.scene.add.existing(this);
  }

  destroy() {
    // TODO
  }

  movement() {
    // Not implemented
  }
  update() {}
}

export default MPC;
