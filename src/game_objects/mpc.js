import { PLAYER_MOVEMENTS } from '../constants';

import { Bullet } from '../game_objects';

class MPC extends Phaser.GameObjects.Sprite {
  constructor(gameState, x, y, id) {
    super(gameState.scene, x, y, 'player');
    this.id = id;
    this.gameState = gameState;
    this.scene.add.existing(this);
    this.lastXPos = 0;

    this.bow = this.scene.add.image(this.x, this.y, 'bow');
    this.scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.bow.setOrigin(0, 0.5);
    this.bow.setDepth(1);

    this.setDepth(2);

    this.body.setSize(32, 64, true);
  }

  update() {
    const dir = this.lastXPos - this.x;

    this.bow.x = this.x;
    this.bow.y = this.y;

    dir !== 0 && this.setFlipX(dir > 0);

    this.bow.setRotation(!this.flipX ? Math.PI / 4 : (Math.PI * 3) / 4);

    this.lastXPos = this.x;

    this.accumulatedDelta;

    if (this.aimAngle !== 0) {
      this.bow.setRotation(
        !this.flipX
          ? -this.aimAngle + Math.PI / 2
          : (Math.PI * 2) / 4 + this.aimAngle
      );
    }
  }

  shoot() {
    const bulletDir = this.flipX ? -1 : 1;
    this.gameState.bullets.push(
      new Bullet(
        this.scene,
        this.gameState,
        this.x,
        this.y,
        this.aimAngle,
        this.aimSpeed,
        bulletDir
      )
    );
    this.canShoot = false;
  }

  destroy() {
    super.destroy();
  }

  movement({ action, aimSpeed }) {
    if (action === PLAYER_MOVEMENTS.SHOOT) {
      this.aimSpeed = aimSpeed;
      this.shoot();
    }
    // Not implemented
  }

  resetAim() {
    this.accumulatedDelta = 0;
    this.aimAngle = 0;
    this.aimSpeed = 0;
  }
}

export default MPC;
