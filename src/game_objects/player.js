import Bullet from './bullet';
import Flag from './flag';
import { checkOverlap } from '../utils';

class Player extends Phaser.GameObjects.Rectangle {
  static SIZE = 32;
  static SPEED = 300;
  static JUMP_SPEED = 420;
  static SHOOT_DELAY = 1000;
  static MAX_AIM_TIME = 1000;
  static MAX_ANGLE = Math.PI;
  static MIN_ANGLE = Math.PI / 4;
  static MAX_SHOOT_SPEED = 700;
  static MIN_SHOOT_SPEED = 400;
  static PLAYER_RIGHT_DIRECTION = 1;
  static PLAYER_LEFT_DIRECTION = -1;
  static S_KEY_CODE = 83;

  constructor(gameState, x, y, id) {
    super(gameState.scene, x, y, Player.SIZE, Player.SIZE, 0xffffff, 1.0);
    this.id = id;
    this.gameState = gameState;
    this.scene.add.existing(this);
    this.canShoot = true;
    this.setOrigin(0.5, 0.5);
    this.aimAngle = 0;
    this.aimSpeed = 0;
    this.accumulatedDelta = 0;
    this.shootTimer = 0;
    this.hasFlag = false;
    this.lastDirection = Player.PLAYER_RIGHT_DIRECTION;
    this.scene.physics.add.existing(this);
    this.scene.input.keyboard.on('keydown', this.handleInputPressed, this);
    this.team = 1;
    // this.arrow = this.scene.add.image(0, 0, 'emptyArrow');
    // this.arrow.setOrigin(0, 0.5);
    // this.arrow.setDepth(1);
    this.setDepth(1);
  }

  update(delta, graphics) {
    this.shootTimer += delta;
    this.movement();
    this.scene.keys.W.on('down', this.jump, this);

    if (this.scene.cursor.space.isDown && this.canShoot) {
      this.aim(delta);
    }
    if (this.shootTimer > Player.SHOOT_DELAY) {
      this.canShoot = true;
      this.shootTimer = 0;
    }

    if (this.scene.cursor.space.isUp && this.accumulatedDelta > 0) {
      this.canShoot && !this.hasFlag && this.shoot();
      this.resetAim();
    }

    graphics.clear();

    if (this.hasFlag) {
      this.drawFlag(graphics);
    }
  }

  drawAimArrow(graphics) {}

  /**
   * Shoot the bullet
   */
  shoot() {
    this.gameState.bullets.push(
      new Bullet(
        this.scene,
        this.gameState,
        this.x,
        this.y,
        this.aimAngle,
        this.aimSpeed,
        this.lastDirection
      )
    );
    this.canShoot = false;
  }

  throwFlag() {
    this.hasFlag = false;
    this.gameState.putFlag(this.x, this.y);
  }

  jump() {
    if (this.body.blocked.down) {
      this.body.setVelocityY(-Player.JUMP_SPEED);
    }
  }

  movement() {
    this.body.setVelocityX(0);
    if (this.scene.keys.A.isDown) {
      this.body.setVelocityX(-Player.SPEED);
      this.lastDirection = Player.PLAYER_LEFT_DIRECTION;
    } else if (this.scene.keys.D.isDown) {
      this.body.setVelocityX(Player.SPEED);
      this.lastDirection = Player.PLAYER_RIGHT_DIRECTION;
    }
  }

  /**
   * Aim the bullet and calculate the path
   * @param {*} delta
   */
  aim(delta) {
    this.accumulatedDelta += delta;
    this.aimAngle = Phaser.Math.Interpolation.SmoothStep(
      this.accumulatedDelta / Player.MAX_AIM_TIME,
      Player.MIN_ANGLE,
      Player.MAX_ANGLE
    );
    this.aimSpeed = Phaser.Math.Interpolation.SmoothStep(
      this.accumulatedDelta / Player.MAX_AIM_TIME,
      Player.MIN_SHOOT_SPEED,
      Player.MAX_SHOOT_SPEED
    );

    if (this.aimAngle >= Player.MAX_ANGLE && this.canShoot && !this.hasFlag) {
      this.shoot();
      this.accumulatedDelta = 0;
      this.aimAngle = 0;
      this.aimSpeed = 0;
    }
  }

  /**
   * Draw the flag
   * @param {*} graphics
   */
  drawFlag(graphics) {
    graphics.lineStyle(2, 0x000000, 1.0);
    graphics.fillStyle(0xfe654f, 1.0);
    graphics.fillRect(
      this.x -
        Flag.WIDTH / 2 +
        (Player.SIZE / 2 - Flag.WIDTH / 2) * -this.lastDirection,
      this.y - 32,
      10,
      32
    );
  }

  /**
   * Reset the aim
   * @memberof Player
   */
  resetAim() {
    this.accumulatedDelta = 0;
    this.aimAngle = 0;
    this.aimSpeed = 0;
  }

  /**
   * Handle the input pressed event
   * @param {*} event
   */
  handleInputPressed(event) {
    if (event.keyCode === Player.S_KEY_CODE) {
      if (this.hasFlag) {
        this.throwFlag();
      } else if (checkOverlap(this, this.gameState.flag) && !this.hasFlag) {
        this.gameState.flag.destroy();
        this.hasFlag = true;
      }
    }
  }
}

export default Player;
