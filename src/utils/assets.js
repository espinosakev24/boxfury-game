class Assets {
  static loadAssets(scene) {
    scene.load.setBaseURL('http://localhost:8080/src');
    scene.load.image('scribble_spritesheet', 'assets/tile_images/scribble_spritesheet.png');
    scene.load.tilemapTiledJSON('map', 'assets/tmx/base.json');
    scene.load.image('player', 'assets/images/character_squareRed.png');
    scene.load.image('bow', 'assets/images/item_bow.png');
    scene.load.image('arrow', 'assets/images/item_arrow.png');
    scene.load.image('flag', 'assets/images/tile_flag.png');
  }
}

export default Assets;
