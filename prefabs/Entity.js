
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
        // Sprite
    }

    // Sprite
    createSprite() {
        if (this.spr) {
            this.spr.destroy();
        }

        this.spr = this.ctx.add.sprite(this.x, this.y, this.key);
        this.spr.setOrigin(0.5);
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
}






















