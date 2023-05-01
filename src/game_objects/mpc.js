import { PLAYER_MOVEMENTS } from '../constants';
import Player from './player.js';

class MPC extends Player {
  constructor(gameState, x, y, id) {
    super(gameState, x, y, id);
  }

  movement(key) {
    if (key === PLAYER_MOVEMENTS.RIGHT) {
      this.body.setVelocityX(Player.SPEED);
    }

    if (key === PLAYER_MOVEMENTS.LEFT) {
      this.body.setVelocityX(-Player.SPEED);
    }

    if (key === PLAYER_MOVEMENTS.STOP) {
      this.body.setVelocityX(0);
    }

    if (key === PLAYER_MOVEMENTS.JUMP) {
      if (this.body.blocked.down) {
        this.body.setVelocityY(-Player.JUMP_SPEED);
      }
    }
  }

  destroy() {
    super.destroy();
    this.bow.destroy();
  }

  update() {}
}

export default MPC;
