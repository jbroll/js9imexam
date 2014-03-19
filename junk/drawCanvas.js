
    function d2r(d) { return d * (Math.PI / 180); }
    function rgb(regno) {
	var r = (regno >> 16) & 0x0000FF;
	var g = (regno >>  8) & 0x0000FF;
	var b =  regno        & 0x0000FF;
	
	return "rgb(" + r.toFixed(0) + "," + g.toFixed(0) + "," + b.toFixed(0) + ")";
    }
    function fakeEllipse(cx, cy, w, h, r, start, end, dir){
	
	var lx = cx - w/2,
	    rx = cx + w/2,
	    ty = cy - h/2,
	    by = cy + h/2;

	var magic = 0.551784;
	var xmagic = magic*w/2;
	var ymagic = h*magic/2;

	this.save();
        this.translate(cx, cy);
        this.rotate(r);
        this.translate(-cx, -cy);

	this.moveTo(cx,ty);
	this.bezierCurveTo(cx+xmagic,ty,rx,cy-ymagic,rx,cy);
	this.bezierCurveTo(rx,cy+ymagic,cx+xmagic,by,cx,by);
	this.bezierCurveTo(cx-xmagic,by,lx,cy+ymagic,lx,cy);
	this.bezierCurveTo(lx,cy-ymagic,cx-xmagic,ty,cx,ty);

	this.restore();
    }

    function drawCircle(ctx, x, y, rad, regno) {
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
	ctx.fillStyle = rgb(regno);
	ctx.fill();
    }
    function drawBox(ctx, x, y, h, w, rot, regno) {
	ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.translate(-x, -y);
	
	ctx.fillStyle = rgb(regno);
	ctx.fillRect(x-w/2, y-h/2, w, h);
	
	ctx.restore();
    }
    function drawEllipse(ctx, x, y, h, w, rot, regno) {
	ctx.beginPath();
	ctx.ellipse(x, y, h, w, rot, 0, 2 * Math.PI, false);
	ctx.fillStyle = rgb(regno);
	ctx.fill();
    }
    function drawPolygon(ctx, points, regno) {
	var i;

	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for ( i = 1; i < points.length; i++ ) {
	    ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.fillStyle = rgb(regno);
	ctx.fill();
    }

