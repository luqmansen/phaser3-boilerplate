

class Helper {

    constructor() {}

    getRadInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    convertPxToTile(x, y, tile_size)
    {
        // start of tilemap
        x -= 4;

        let tx = Math.floor(x / tile_size)
        let ty = Math.floor(y / tile_size)

        return {
            tx : tx,
            ty : ty
        }

    }

    getTileCenter(tx, ty, tile_size)
    {
        let offset = {
            x : 4,
            y : 0
        };

        if (typeof tx === 'object')
        {
            tile_size = ty;
            ty = tx.ty;
            tx = tx.tx
        }

        return {
            x : (tx + 0.5) * tile_size + offset.x,
            y : (ty + 0.5) * tile_size + offset.y
        }
    }
    
}