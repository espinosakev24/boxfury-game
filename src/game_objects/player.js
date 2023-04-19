import Game from '../scenes/game';

class Player {
    static SIZE = 32;
    static SPEED = 3;

    constructor() {
        this.position = new Phaser.Math.Vector2(100, 100);
        this.velocity = new Phaser.Math.Vector2(1, 0).scale(Player.SPEED);

    }

    update() {
        this.position = this.position.add(new Phaser.Math.Vector2(this.velocity.x, this.velocity.y));
        // invert velocity if we hit the edge of the screen
        if (this.position.x < 0 || this.position.x > Game.WIDTH - Player.SIZE) {
            this.velocity.x *= -1;
        }
    }

    draw(graphics) {
        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.fillStyle(0xFFFFFF, 1.0);
        graphics.fillRect(this.position.x, this.position.y, Player.SIZE, Player.SIZE);
        graphics.strokeRect(this.position.x, this.position.y, Player.SIZE, Player.SIZE);
    }

}

export default Player;