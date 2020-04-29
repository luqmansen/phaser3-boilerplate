class Boot extends Phaser.Scene {

    constructor() {
        super({key: 'Boot', active: true})
    }

    init(){
        this.CONFIG = this.sys.game.CONFIG;
    }

    preload(){

    }

    create(){
        this.scene.start('Preload')
    }
}