import io from 'socket.io-client';
import { MPC, Player } from '../game_objects';

class SocketHandler {
  constructor(gameState) {
    gameState.socket = io('http://localhost:8000');

    gameState.socket.emit('player_connect', {
      id: gameState.me.id,
      x: gameState.me.x,
      y: gameState.me.y,
    });

    gameState.socket.on('connected', (data) => {
      data.players.forEach((player) => {
        if (player.id === gameState.me.id) return;

        const newPlayer = new MPC(gameState, player.x, player.y, player.id);

        gameState.scene.physics.add.collider(newPlayer, gameState.world_layer);
        gameState.players.push(newPlayer);
      });
    });

    gameState.socket.on('new_player_connected', (data) => {
      const newPlayer = new MPC(gameState, data.x, data.y, data.id);
      gameState.scene.physics.add.collider(newPlayer, gameState.world_layer);

      gameState.players.push(newPlayer);
    });

    gameState.socket.on('player_disconnected', ({ id }) => {
      console.log(gameState.players);
      const playerDisconnected = gameState.players.find(
        (player) => player.id === id
      );

      gameState.players = gameState.players.filter(
        (player) => player.id !== id
      );

      playerDisconnected.destroy();
    });

    /**
     * From broadcast
     * @param {Object} data
     */
    gameState.socket.on('player_moved', ({ action, id }) => {
      const playerMoved = gameState.players.find((player) => player.id === id);

      playerMoved.movement(action);
    });
  }
}

export default SocketHandler;
