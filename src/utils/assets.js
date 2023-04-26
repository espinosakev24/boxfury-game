
class Assets {
    static loadAssets(scene) {
        scene.load.setBaseURL('http://localhost:8080/src');
        scene.load.image('tiles', 'assets/tile_images/platform_tileset.png');
        scene.load.tilemapTiledJSON('map', 'assets/tmx/base.json');
        scene.load.image('emptyArrow', 'assets/images/arrowEmpty.png');
    }

}

export default Assets;
