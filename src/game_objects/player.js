import Bullet from './bullet';

class Player extends Phaser.GameObjects.Rectangle {
    static SIZE = 32;
    static SPEED = 200;
    static JUMP_SPEED = 420;
    static SHOOT_DELAY = 1000;

    constructor(game, x, y) {
        super(game, x, y, Player.SIZE, Player.SIZE, 0xFFFFFF, 1.0);
        game.add.existing(this);
        this.can_shoot = true;
        this.setOrigin(0, 0);
        this.scene.time.addEvent({
            delay: Player.SHOOT_DELAY,
            callback: () => {
                this.can_shoot = true;
                console.log("can shoot")
            },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.scene.cursor.left.isDown) {
            this.body.setVelocityX(-Player.SPEED);
        } else if (this.scene.cursor.right.isDown) {
            this.body.setVelocityX(Player.SPEED);
        }
        else {
            this.body.setVelocityX(0);
        }
        this.scene.cursor.up.on('down', () =>
        {
            if (this.body.blocked.down)
            {
                this.body.setVelocityY(-Player.JUMP_SPEED);
            }
        }, this);
        if (this.scene.input.activePointer.leftButtonDown() && this.can_shoot) {
            let mouse_x = this.scene.input.activePointer.x;
            let mouse_y = this.scene.input.activePointer.y;
            let player_x = this.x;
            let player_y = this.y;
            let direction = new Phaser.Math.Vector2(mouse_x - player_x, mouse_y - player_y);
            direction.normalize();
            this.scene.bullets.push(new Bullet(this.scene, this.x, this.y, direction))
            this.can_shoot = false
        }
        
    }

}

export default Player;