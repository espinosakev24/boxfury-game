class Team {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.players = [];
  }
  addPlayer(player) {
    this.players.push(player);
  }
  removePlayer(player) {
    this.players.splice(this.players.indexOf(player), 1);
  }
  getPlayers() {
    return this.players;
  }
}

export default Team;
