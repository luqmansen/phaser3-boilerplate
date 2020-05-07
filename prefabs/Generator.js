class Generator{

    constructor(ctx) {
        this.CONFIG = ctx.CONFIG;
        this.DEPTH = ctx.DEPTH;
        this.helper = new Helper()


        this.ctx = ctx;

        this.cols = 11;
        this.rows = 20;

        this.layers = {
            floor : [],
            walls : [],
            monster : [],
            pickups : [],
            turrets : [],
            overlay : false
        };

        this.frames = {
            floor : 0,
            walls : this.helper.getRadInt(156,158),
        }

        this.ty_offset = 0;
        this.px_offset = 0;

        this.height = 0;

    }

    setup(){
        this.createFloor();
        this.createRoomLayers();
    }
    // Update ================================================================
    update(){
        this.checkNewRoom();
        this.scrollFloor();
    }

    saveHeight()
    {
        // total hegiht fo all the rooms (bottom edge of the room)
        this.height = this.layers.walls.length * this.CONFIG.tile
    }

    checkNewRoom()
    {
        // check camera has reach end
        if(this.ctx.cameras.main.scrollY + this.ctx.cameras.main.height < this.height)
        {
            return;
        }
        // calculate y offset
        this.ty_offset = Math.floor(this.ctx.cameras.main.scrollY /this.CONFIG.tile)
        this.px_offset = this.ctx.cameras.main.scrollY
        // destroy old rows 
        this.destroyPassedRows();

        // append new room
        this.createRoomLayers();
    }

    destroyPassedRows(){
        let row_num = Math.floor(this.px_offset / this.CONFIG.tile)

        for (let ty= 0; ty < row_num; ty++)
        {
            for (let tx = 0; tx < this.cols; tx++)
            {
                if (this.layers.walls[ty][tx].spr)
                {
                    this.layers.walls[ty][tx].spr.destroy();
                }
            }
        }
    }

    createRoomLayers(){
        //add walls
        // generate
        let walls = this.generateWalls();
        // draw
        walls = this.createWalls(walls);
        // append to layer
        this.layers.walls = this.layers.walls.concat(walls)

        //save total height fo all the rooms
        this.saveHeight();
    }

    // Walls layer
    generateWalls()
    {
        // 2d arrays
        let walls = [];
        
        for (let ty =0; ty<1.5 * this.rows; ty++)
        {
            // first 4 rows are empty
            // after that, 3 walls every 3 rows
            if (this.layers.walls.length + ty >= 5 && (ty + 1) % 3 === 0)
            {
                walls.push(this.generateWallRow());
            }
            else
            {
                walls.push(this.generateEmptyRow(ty))
            }

        }
        return walls;
    }

    generateEmptyRow()
    {
        
        let row = [];
        for (let tx = 0; tx < this.cols; tx++)
        {
            row.push({
                tx :tx,
                is_wall: false
            });
        }
        return row;
    }

    generateWallRow()
    {
        // how many gaps
        let gaps = [];

        for (let i = 0; i < this.helper.getRadInt(1,2); i++)
        {
            // how wide the gaps
            gaps.push({
                idx: i,
                width: 2
            });
        }
        //  where is the first gap
        let min  = 1;
        let max = this.cols - gaps[0].width -1;

        let tx = this.helper.getRadInt(min, max);

        gaps[0] = this.buildGap(tx, gaps[0].width)

        // where is the second gap
        if (gaps[1])
        {
            tx = this.helper.getRadInt(min, max);

            while (gaps[0].taken.indexOf(tx) >= 0)
            {
                tx = this.helper.getRadInt(min, max)
            }

            gaps[0] = this.buildGap(tx, gaps[1].width)
        }

        // build the row of walls with gaps
        return this.buildRow(gaps);
    }

    buildGap(tx, width)
    {
        let gap = {
            tx : tx, 
            width : width
        };

        gap.empty = []

        for (let i= 0; i < width; i++)
        {
            gap.empty.push(tx + 1);
        } 

        gap.taken = [];

        for (let i = -2; i < width+ 2; i++)
        {
            gap.taken.push(tx + i)
        }

        return gap
    }

    buildRow(gaps)
    {
        let row = [];

        // first create wall on all tiles
         for (let tx =0; tx < this.cols; tx++)
         {
             row.push({
                 tx:tx,
                 frame : this.frames.walls,
                 is_wall : true
             })
         }

         //delete walls where there are gaps
         gaps.forEach((el) => {
             for (let tx = el.tx; tx < el.tx + el.width; tx++)
             {
                 if (row[tx])
                 {
                     row[tx].is_wall = false;
                 }
             }
         }, this);

         return row;
    }

    createWalls(walls){
        let x;
        let y;
        let spr;

        // row by row
        for (let ty = 0; ty < walls.length; ty++)
        {
            // col by col
            for (let tx=0; tx < walls[ty].length; tx++)
            {
                // pixel position of wall sprite
                 x = (tx * this.CONFIG.tile) + this.CONFIG.map_offset
                 y = (ty + this.layers.walls.length) * this.CONFIG.tile

                 if (walls[ty][tx].is_wall)
                 {
                     spr = this.ctx.add.sprite(x,y, 'obstacle1')
                     spr.setOrigin(0);
                     spr.setDepth(this.DEPTH.wall)
                     spr.setFrame(this.helper.getRadInt(155,158))

                     walls[ty][tx].spr = spr;
                 }
            }
        }

        return walls
    }


    // Floor layer ================================================================
    createFloor() {
        let x;
        let y;
        let spr;

        // draw floor bigger than view
        let cols = this.cols;
        let rows = this.rows + 1;

        // save floor in array
        let floor = [];

        for (let ty = 0; ty <rows; ty++){
            floor[ty] = [];

            for (let tx = 0; tx < cols; tx++){
                x = (tx * this.CONFIG.tile) + this.CONFIG.map_offset;
                y = (ty * this.CONFIG.tile);

                spr = this.ctx.add.sprite(x, y, 'tileset');
                spr.setOrigin(0)
                spr.setDepth(this.DEPTH.floor)

                floor[ty][tx] = spr;
            }
        }
        this.layers.floor = floor;
    }

    scrollFloor() {
        let offset = this.ctx.cameras.main.scrollY - this.layers.floor[0][0].y;

        if (offset >= this.CONFIG.tile){
            this.destroyFloorRow();
            this.appendFloorRow();
        }
    }

    destroyFloorRow(){
        for (let tx=0; tx < this.layers.floor[0]; tx++){
            this.layers.floor[0][tx].destroy();
        }

        this.layers.floor.splice(0,1)
    }

    appendFloorRow(){
        let x;
        let spr;

        // calculate row at end of the floor
        let ty = this.layers.floor.length;
        let y = this.layers.floor[ty -  1][0].y + this.CONFIG.tile;

        // add empty row to the floor
        this.layers.floor.push([]);

        // Draw tiles
        for (let tx = 0; tx < this.cols; tx++){

            x = (tx * this.CONFIG.tile) + this.CONFIG.map_offset;

            spr = this.ctx.add.sprite(x, y, 'tileset')
            spr.setOrigin(0);
            spr.setDepth(this.DEPTH.floor);

            this.layers.floor[ty][tx] = spr;
        }
    }

    checkTileBlocked(tx, ty)
    {
         if (typeof tx === 'object')
         {
              ty = tx.tx
              tx = tx.tx
         }

         // Check if outside grid, count is as wall
         if (typeof this.layers.walls[ty] === "undefined")
         {
             return true
         }
         else if (typeof this.layers.walls[ty][tx] === "undefined" )
         {
             return true;
         } 
         // flagges as wall
         else  {
            return this.layers.walls[ty][tx].is_wall
         }
    }

}