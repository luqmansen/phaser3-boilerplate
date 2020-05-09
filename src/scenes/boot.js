import Phaser from 'phaser'
import fontsXML from '../assets/fonts/click.xml'
import fontsImage from '../assets/fonts/ClickPixel.png'

export default class Boot extends Phaser.Scene {

    constructor() {
        super({key: 'Boot', active: true})
    }


    preload(){
        // Bitmap font for preload scenes
        this.load.bitmapFont('ClickPixel', fontsImage, fontsXML)
    }

    create(){
        this.scene.start('Preload')
    }
}