import Bullet from './bullet';

class Player extends Phaser.GameObjects.Rectangle {
  static SIZE = 32;
  static SPEED = 200;
  static JUMP_SPEED = 420;
  static SHOOT_DELAY = 1000;
  static MAX_AIM_TIME = 1000;
  static MAX_ANGLE = 90;

  constructor(game, x, y) {
    super(game, x, y, Player.SIZE, Player.SIZE, 0xffffff, 1.0);
    game.add.existing(this);
    this.can_shoot = true;
    this.setOrigin(0, 0);
    this.scene.time.addEvent({
      delay: Player.SHOOT_DELAY,
      callback: () => {
        this.can_shoot = true;
      },
      callbackScope: this,
      loop: true,
    });

    this.aimAngle = 0;

    this.angleIncreaseTime = 0;

    this.hasFlag = false;
  }

  shoot(aimAngle) {
    this.scene.bullets.push(new Bullet(this.scene, this.x, this.y, aimAngle));
  }

  throwFlag() {
    this.hasFlag = false;

    this.scene.flag.x = this.x;
    this.scene.flag.y = this.y;
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

    //  The player will reach a max angle of 90 degrees after two seconds of holding the button space, once the button is released the player will shoot
    if (
      this.scene.cursor.space.isDown &&
      this.angleIncreaseTime < Player.MAX_AIM_TIME
    ) {
      this.aimAngle = Phaser.Math.RadToDeg(
        Math.min(
          ((this.angleIncreaseTime / Player.MAX_AIM_TIME) * Math.PI) / 2,
          Math.PI / 2
        )
      );

      this.angleIncreaseTime += delta;
    }
    if (this.scene.cursor.space.isUp) {
      if (this.angleIncreaseTime > 0) {
        this.aimAngle = Phaser.Math.RadToDeg(
          Math.min(
            ((this.angleIncreaseTime / Player.MAX_AIM_TIME) * Math.PI) / 2,
            Math.PI / 2
          )
        );
        this.shoot(this.aimAngle);
        this.aimAngle = 0;
      }
      this.angleIncreaseTime = 0;
    }

    if (this.hasFlag) {
      this.scene.flag.x = this.x;
      this.scene.flag.y = this.y;
    }
  }
}

export default Player;
