import Bullet from './bullet';

class Player extends Phaser.GameObjects.Rectangle {
  static SIZE = 32;
  static SPEED = 200;
  static JUMP_SPEED = 420;
  static SHOOT_DELAY = 1000;
  static MAX_AIM_TIME = 2000;
  static MAX_ANGLE = Math.PI;
  static MIN_ANGLE = Math.PI/4;
  static MAX_SHOOT_SPEED = 600;
  static MIN_SHOOT_SPEED = 0;

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
    this.graphics = game.add.graphics();
    this.graphics.lineStyle(2, 0x000000, 0.1);
  }

  shoot() {
    this.scene.bullets.push(new Bullet(this.scene, this.x, this.y, this.aimAngle, this.aimSpeed));
  }

  throwFlag() {
    this.hasFlag = false;

    this.scene.flag.x = this.x;
    this.scene.flag.y = this.y;
  }

  calculatePath() {
    this.bulletPath.destroy();
    this.bulletPath.moveTo(this.x, this.y);
    let t = 0;
    let timeStep = 0.01;
    while (t < 2) {
      let x = this.x + Math.sin(this.aimAngle) * this.aimSpeed * t;
      let y = this.y + Math.cos(this.aimAngle) * this.aimSpeed * t - 0.5 * -600 * t * t;
      this.bulletPath.lineTo(x, y);
      t += timeStep;
    }
}

  update(delta) {
    if (this.scene.cursor.left.isDown) {
      this.body.setVelocityX(-Player.SPEED);
    } else if (this.scene.cursor.right.isDown) {
      this.body.setVelocityX(Player.SPEED);
    } else {
      this.body.setVelocityX(0);
    }
    this.scene.cursor.up.on(
      'down',
      () => {
        if (this.body.blocked.down) {
          this.body.setVelocityY(-Player.JUMP_SPEED);
        }
      },
      this
    );


    if (this.scene.cursor.space.isDown) {
        this.accumulatedDelta += delta
        this.aimAngle = Phaser.Math.Interpolation.SmoothStep(this.accumulatedDelta / Player.MAX_AIM_TIME, Player.MIN_ANGLE, Player.MAX_ANGLE);
        this.aimSpeed = Phaser.Math.Interpolation.SmoothStep(this.accumulatedDelta / Player.MAX_AIM_TIME, Player.MIN_SHOOT_SPEED, Player.MAX_SHOOT_SPEED);
        this.calculatePath();
        if (this.aimAngle >= Player.MAX_ANGLE) {
            this.shoot();
            this.accumulatedDelta = 0;
            this.aimAngle = 0;
            this.aimSpeed = 0;
        }
    }

    if (this.scene.cursor.space.isUp && this.accumulatedDelta > 0) {
        this.shoot();
        this.accumulatedDelta = 0;
        this.aimAngle = 0;
        this.aimSpeed = 0;
        this.bulletPath.destroy();
    }

    if (this.hasFlag) {
      this.scene.flag.x = this.x;
      this.scene.flag.y = this.y;
    }

    // draw path if it has points
    if (this.bulletPath.curves.length > 0) {
        console.log(this.bulletPath.curves.length)
        this.graphics.clear();
        this.graphics.setAlpha(0.1);
        this.bulletPath.draw(this.graphics);
    }
  }
}

export default Player;
