import Phaser from 'phaser';
import { GameState } from '../game_states';
import Assets from '../utils/assets';
import { gameKeys } from '../utils';

class Game extends Phaser.Scene {
  static WIDTH = 760;
  static HEIGHT = 640;

  constructor() {
    super('Box Fury');
  }

  preload() {
    Assets.loadAssets(this);
  }

  create() {
    this.keys = {};

    this.cursor = this.input.keyboard.createCursorKeys();
    for (const key of gameKeys) {
      this.keys[key] = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[key]
      );
    }
    this.gameState = new GameState(this, 'map');
  }

  update(time, delta) {
    this.gameState.update(time, delta);
  }
}

export default Game;
