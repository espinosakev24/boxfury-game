import Phaser from 'phaser';
import Player from '../game_objects/player';

class Game extends Phaser.Scene {  
  static WIDTH = 800;
  static HEIGHT = 600;

  constructor() {
    super("Box Fury");
  }

  preload() {
  }

  create() {
    this.graphics = this.add.graphics(
      { lineStyle: { width: 1, color: 0xffffff }, fillStyle: { color: 0xffffff } }
    )
    this.player = new Player();
  }
  update() {
    this.player.update();

    // Drawing

    this.graphics.clear();

    this.player.draw(this.graphics)

  }
}

export default Game;