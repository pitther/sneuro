class DCanvas {
    constructor(el){
        this.ctx = el.getContext('2d');
        this.pixel = 25;
        let is_mouse_down = false;
        this.canv = el;
        this.canv.width = 400;
        this.canv.height = 400;
        this.nowLikely = null;

        el.addEventListener('mousedown', function() {
            is_mouse_down = true;
            this.ctx.beginPath();
        }.bind(this));

        el.addEventListener('mouseup', function() {
            is_mouse_down = false;
            if (ACTIONHANDLER.mostLikely){
                let v = CANVAS.calculate();
                SERVER.runNet(v,"ml");
            }
        }.bind(this));

        el.addEventListener('mousemove', function(e) {
            if( is_mouse_down )
            {
                this.ctx.fillStyle = 'red';
                this.ctx.strokeStyle = 'red';
                this.ctx.lineWidth = this.pixel;

                this.ctx.lineTo(e.offsetX, e.offsetY);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(e.offsetX, e.offsetY, this.pixel / 2, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.moveTo(e.offsetX, e.offsetY);
            }
        }.bind(this))

    }
    updateLikely(result,likely){
        let s = JSON.stringify(result).split(",").join("\n");
        s = s.replace("{","");
        s = s.replace("}","");
        document.getElementById("ooo").innerHTML = s;
        document.getElementById("outp").value = 'This is: '+likely+ ' (y/n)';
        this.nowLikely = likely;
    }
    drawLine(x1, y1, x2, y2, color = 'gray') {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineJoin = 'miter';
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    drawCircle(x,y,r){
        this.ctx.beginPath();
        this.ctx.lineWidth = .1;
        this.ctx.arc(x,y,r,0,2*Math.PI);
        this.ctx.stroke();
    }
    drawCell(x, y, w, h) {
        this.ctx.fillStyle = 'blue';
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineJoin = 'miter';
        this.ctx.lineWidth = 1;
        this.ctx.rect(x, y, w, h);
        this.ctx.fill();
    }
    clear() {
        this.nowLikely = null;
        this.drawCell();
        setTimeout(function(){

            this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        }.bind(this), 100);
    }
    drawGrid() {
        const w = this.canv.width;
        const h = this.canv.height;
        const p = w / this.pixel;

        const xStep = w / p;
        const yStep = h / p;

        for( let x = 0; x < w; x += xStep )
        {
            this.drawLine(x, 0, x, h);
        }

        for( let y = 0; y < h; y += yStep )
        {
            this.drawLine(0, y, w, y);
        }
    }
    calculate(draw = false) {
        const w = this.canv.width;
        const h = this.canv.height;
        const p = w / this.pixel;

        const xStep = w / p;
        const yStep = h / p;

        const vector = [];
        let __draw = [];

        for( let x = 0; x < w; x += xStep )
        {
            for( let y = 0; y < h; y += yStep )
            {
                const data = this.ctx.getImageData(x, y, xStep, yStep);

                let nonEmptyPixelsCount = 0;
                for( let i = 0; i < data.data.length; i += 10 )
                {
                    const isEmpty = data.data[i] === 0;

                    if( !isEmpty )
                    {
                        nonEmptyPixelsCount += 1;
                    }
                }

                if( nonEmptyPixelsCount > 1 && draw )
                {
                    __draw.push([x, y, xStep, yStep]);
                }

                vector.push(nonEmptyPixelsCount > 1 ? 1 : 0);
            }
        }

        if( draw )
        {
            this.clear();
            this.drawGrid();

            for( let _d in __draw )
            {
                this.drawCell( __draw[_d][0], __draw[_d][1], __draw[_d][2], __draw[_d][3] );
            }
        }

        return vector;
    }
}