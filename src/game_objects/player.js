import Bullet from './bullet';
import Flag from './flag';
import { checkOverlap } from '../utils';


class Player extends Phaser.GameObjects.Rectangle {
  static SIZE = 32;
  static SPEED = 300;
  static JUMP_SPEED = 420;
  static SHOOT_DELAY = 1000;
  static MAX_AIM_TIME = 500;
  static MAX_ANGLE = Math.PI;
  static MIN_ANGLE = Math.PI / 4;
  static MAX_SHOOT_SPEED = 700;
  static MIN_SHOOT_SPEED = 400;
  static PLAYER_RIGHT_DIRECTION = 1;
  static PLAYER_LEFT_DIRECTION = -1;
  static S_KEY_CODE = 83;

  constructor(game, x, y) {
    super(game, x, y, Player.SIZE, Player.SIZE, 0xffffff, 1.0);
    game.add.existing(this);
    this.canShoot = true;
    this.setOrigin(0.5, 0.5);
    this.aimAngle = 0;
    this.aimSpeed = 0;
    this.accumulatedDelta = 0;
    this.hasFlag = false;
    this.bulletPath = new Phaser.Curves.Path();
    this.lastDirection = Player.PLAYER_RIGHT_DIRECTION;

    game.physics.add.collider(this, game.blockBodies);
    game.physics.add.existing(this);
    game.input.keyboard.on('keydown', this.handleInputPressed, this);
  }

  update(delta, graphics) {
    this.movement();
    this.scene.keys.W.on('down', this.jump, this);

    if (this.scene.cursor.space.isDown) {
      this.aim(delta);
    }

    if (this.scene.cursor.space.isUp && this.accumulatedDelta > 0) {
      this.shoot();
      this.resetAim();
    }

    graphics.clear();

    if (this.bulletPath.curves.length > 0) {
      this.drawBulletCurve(graphics);
    }

    if (this.hasFlag) {
      this.drawFlag(graphics);
    }
  }

  /**
   * Draw the bullet path
   * @param {Phaser.Input.Keyboard.Key} key
   * @memberof Player
   */
  drawBulletCurve(graphics) {
    graphics.lineStyle(2, 0x000000, 1.0);
    this.bulletPath.draw(graphics);
  }

  /**
   * Shoot the bullet
   */
  shoot() {
    this.scene.bullets.push(
      new Bullet(
        this.scene,
        this.x,
        this.y,
        this.aimAngle,
        this.aimSpeed,
        this.lastDirection
      )
    );
  }

  throwFlag() {
    this.hasFlag = false;
    this.scene.putFlag(this.x, this.y);
  }

  /**
   * Calculate the bullet path
   */
  calculatePath() {
    this.bulletPath.destroy();
    this.bulletPath.moveTo(this.x, this.y);
    let t = 0;
    let timeStep = 0.01;
    while (t < 0.1) {
      let x =
        this.x +
        Math.sin(this.aimAngle) * this.aimSpeed * t * this.lastDirection;
      let y =
        this.y +
        Math.cos(this.aimAngle) * this.aimSpeed * t -
        0.5 * -600 * t * t;
      this.bulletPath.lineTo(x, y);
      t += timeStep;
    }
  }

  jump() {
    if (this.body.blocked.down) {
      this.body.setVelocityY(-Player.JUMP_SPEED);
    }
  }

  movement() {
    if (this.scene.keys.A.isDown) {
      this.body.setVelocityX(-Player.SPEED);
      this.lastDirection = Player.PLAYER_LEFT_DIRECTION;
    } else if (this.scene.keys.D.isDown) {
      this.body.setVelocityX(Player.SPEED);
      this.lastDirection = Player.PLAYER_RIGHT_DIRECTION;
    } else {
      this.body.setVelocityX(0);
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
    this.calculatePath();
    if (this.aimAngle >= Player.MAX_ANGLE) {
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
    this.bulletPath.destroy();
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
      if (this.hasFlag){
        this.throwFlag();
      }
      else if(checkOverlap(this, this.scene.flag) && !this.hasFlag){
        this.scene.flag.destroy();
        this.hasFlag = true;
      }
    }
  }
}

export default Player;
