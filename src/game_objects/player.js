import Bullet from './bullet';
import Flag from './flag';
import { checkOverlap } from '../utils';
import { KEYBOARD, PLAYER_MOVEMENTS } from '../constants';

class Player extends Phaser.GameObjects.Sprite {
  static WIDTH = 32;
  static HEIGHT = 64;
  static SPEED = 300;
  static JUMP_SPEED = 450;
  static SHOOT_DELAY = 800;
  static MAX_AIM_TIME = 800;
  static MAX_ANGLE = Math.PI;
  static MIN_ANGLE = Math.PI / 4;
  static MAX_SHOOT_SPEED = 700;
  static MIN_SHOOT_SPEED = 400;
  static PLAYER_RIGHT_DIRECTION = 1;
  static PLAYER_LEFT_DIRECTION = -1;
  static S_KEY_CODE = 83;
  static TICKS_PER_SECOND = 80;

  constructor(gameState, x, y, id) {
    super(gameState.scene, x, y, 'player');
    this.id = id;
    this.gameState = gameState;
    this.scene.add.existing(this);
    this.canShoot = true;
    this.aimAngle = 0;
    this.aimSpeed = 0;
    this.accumulatedDelta = 0;
    this.shootTimer = 0;
    this.setOrigin(0.5, 0.5);
    this.hasFlag = false;
    this.lastDirection = Player.PLAYER_RIGHT_DIRECTION;
    this.scene.physics.add.existing(this);
    this.body.setSize(Player.WIDTH, Player.HEIGHT, true);
    this.scene.input.keyboard.on('keydown', this.handleInputPressed, this);
    this.scene.input.keyboard.on('keyup', this.handleInputReleased, this);
    this.team = 1;
    this.bow = this.scene.add.image(this.x, this.y, 'bow');
    this.bow.setOrigin(0, 0.5);
    this.bow.setDepth(1);
    this.setDepth(2);
    this.flagTexture = this.scene.add.image(this.x, this.y, 'flag');
    this.flagTexture.setTint(Flag.COLOR);
    this.flagTexture.setDepth(1);
    this.flagTexture.setDisplaySize(Flag.WIDTH, Flag.HEIGHT);
    this.flagTexture.setOrigin(0, 0);
    this.flagTexture.visible = false;

    this.timeElapsed = 0;
  }

  update(delta) {
    this.bow.x = this.x;
    this.bow.y = this.y;

    this.setFlipX(!(this.lastDirection === Player.PLAYER_RIGHT_DIRECTION));

    this.shootTimer += delta;
    this.movement();
    this.scene.keys.W.on('down', this.jump, this);

    if (this.scene.cursor.space.isDown && this.canShoot) {
      this.aim(delta);
    } else {
      this.bow.setRotation(
        this.lastDirection === Player.PLAYER_RIGHT_DIRECTION
          ? Math.PI / 4
          : (Math.PI * 3) / 4
      );
    }
    if (this.shootTimer > Player.SHOOT_DELAY) {
      this.canShoot = true;
      this.shootTimer = 0;
    }

    if (this.scene.cursor.space.isUp && this.accumulatedDelta > 0) {
      this.canShoot && !this.hasFlag && this.shoot();
      this.resetAim();
    }

    this.flagTexture.visible = this.hasFlag;
    this.bow.visible = !this.hasFlag;

    if (this.hasFlag) {
      this.flagTexture.x = this.x;
      this.flagTexture.y = this.y - 70;
    }

    this.timeElapsed += delta;

    if (this.timeElapsed > 1000 / Player.TICKS_PER_SECOND) {
      this.timeElapsed = 0;
      this.gameState.socket.emit('player_update', {
        id: this.id,
        x: this.x,
        y: this.y,
        aimAngle: this.aimAngle,
      });
    }
  }

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
    this.bow.setRotation(
      this.lastDirection === Player.PLAYER_RIGHT_DIRECTION
        ? -this.aimAngle + Math.PI / 2
        : (Math.PI * 2) / 4 + this.aimAngle
    );

    if (this.aimAngle >= Player.MAX_ANGLE && this.canShoot && !this.hasFlag) {
      this.accumulatedDelta = 0;
      this.aimAngle = 0;
      this.aimSpeed = 0;
    }
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

    this.handleEmitEvent(event.keyCode);

    // console.log(event.keyCode);
  }

  handleInputReleased({ keyCode }) {
    if (keyCode === KEYBOARD.A || keyCode === KEYBOARD.D) {
      this.gameState.socket.emit('player_action', {
        action: PLAYER_MOVEMENTS.STOP,
        id: this.id,
      });
    }

    if (keyCode === KEYBOARD.SPACE && this.canShoot && !this.hasFlag) {
      this.gameState.socket.emit('player_action', {
        action: PLAYER_MOVEMENTS.SHOOT,
        id: this.id,
        aimSpeed: this.aimSpeed,
      });
    }
  }

  handleEmitEvent(key) {
    if (!this.gameState.socket) return;

    if (key === KEYBOARD.D) {
      this.gameState.socket.emit('player_action', {
        action: PLAYER_MOVEMENTS.RIGHT,
        id: this.id,
      });
    }

    if (key === KEYBOARD.A) {
      this.gameState.socket.emit('player_action', {
        action: PLAYER_MOVEMENTS.LEFT,
        id: this.id,
      });
    }

    if (key === KEYBOARD.W) {
      this.gameState.socket.emit('player_action', {
        action: PLAYER_MOVEMENTS.JUMP,
        id: this.id,
      });
    }

    if (key === KEYBOARD.S) {
      this.gameState.socket.emit('player_action', {
        action: PLAYER_MOVEMENTS.AIM,
        id: this.id,
      });
    }
  }
}

export default Player;
