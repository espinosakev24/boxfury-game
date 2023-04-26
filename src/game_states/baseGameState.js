class BaseGameState {
    constructor(game) {
        this.game = game;
        this.graphics = this.game.add.graphics();
    }

    update(time, delta) {}
}

export default BaseGameState;