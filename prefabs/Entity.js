
class Entity {

    constructor(ctx, x, y, key) {
        this.MAP_OFFSET = ctx.CONFIG.map_offset;
        this.TILE_SIZE = ctx.CONFIG.tile;

        this.helper = new Helper();

        this.ctx    = ctx;

        this.x      = x;
        this.y      = y;
        this.width  = 32;
        this.height = 32;
        this.depth  = 0;

        this.key    = key;

        this.frames = {
            idle    : 0,
            hurt    : 3
        };

        this.states = {
            idle    :true,
            walks   :false,
            hurt    :false,
            death   :false,
            last    :false
        };

        this.direction = {
            last    : false,
            current : 'down'
        }

        this.health = {
            total: 1,
            current: 1
        };
        this.speed = {
            base    : 0,
            current : 0,
            max     : 0
        };

        // Tile  position
        //  Shadow
        this.createShadow();
        // Sprite
        this.createSprite();
    }

    // Sprite ================================================================
    createSprite() {
        this.spr = this.ctx.add.sprite(this.x, this.y, this.key);
        this.spr.setOrigin(0.5);
    }

    destroy() {
        if (this.spr) {
            this.spr.destroy()
        }
        this.spr = false;
    }

    updateSpriteDirection() {
        switch (this.direction.current) {
            case "left":
                this.spr.setAngle(90);
                break;
            case "right":
                this.spr.setAngle(-90);
                break;
            case "up":
                this.spr.setAngle(180);
                break;
            default:
                this.spr.setAngle(0);
        }
    }

    createShadow() {
        this.shadow = this.ctx.add.graphics({x : this.x, y: this.y})

        let alpha   = 0.4;
        let radius  = 8;

        this.shadow.fillStyle('0x000000', alpha);
        this.shadow.fillCircle(0,0, radius)
    }

    destroyShadows() {
        if (this.shadow) {
            this.shadow.destroy()
        }
        this.shadow = false;
    }

    // Animations ================================================================
    startNewAnim(key) {
        this.stopAnim();

        switch (key) {
            case 'idle':
                this.startIdleAnim();
                break;
            case 'walk':
                this.startWalkAnim();
                break;
            default:
                console.log(this.key + 'INVALID ANIM KEY', key);
        }
    }

    stopAnim() {
        this.spr.anims.stop()
        this.spr.setFrame(this.frames.idle)
    }

    startIdleAnim() {
        this.spr.setFrame(this.frames.idle)
    }

    startWalkAnim() {
        this.spr.play(this.key + '-walk')
    }

    // Setters ================================================================
}





















