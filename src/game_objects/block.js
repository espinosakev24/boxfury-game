class Block extends Phaser.GameObjects.Rectangle {
    static SIZE = 2223;
    static COLOR = 0xFEEFDD;

    constructor(game, x, y) {
        super(game, x, y, Block.SIZE, Block.SIZE, Block.COLOR, 1.0);
        game.add.existing(this);
        this.setOrigin(0, 0);
    }
}

export default Block;