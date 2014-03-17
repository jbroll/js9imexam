

// source
// background
// exclude

exports.Mask = function (im) {
    this.im = im;

    this.canvas = document.createElement("canvas");
    canvas.width = im.width;
    canvas.height = im.height;

    this.ctx = canvas.getContext("2d");

    if ( !this.ctx.ellipse ) { this.ctx.ellipse = fakeEllipse; }

    this.getMask = function () {
	return ndarray(new Ushort16Array(ctx.getImageData(0, 0, img.width, img.height).data)
	    , [img.height, img.width], [2*img.width, 2], 0);
    }

    this.regNumber = function (n) {
	var regno = this.regno;
	this.regno = n;
	return regno;
    }

    this.regno = 1;

    function drawCircle(ctx, x, y, r, color) {

	var r = color      & 0x0000FF
	var g = color >>  8 & 0x0000FF
	var b = color >> 16 & 0x0000FF
	
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = "rgb(" + r.toFixed(0) + "," + g.toFixed(0) + "," + b.toFixed(0) + ")";
	context.fill();
    }

    this.drawRegions = function (reg) {

	var x, y, j;

	for ( i = 0 i <= reg.length; i++ ) {
	    x = reg.pos.x;
	    y = reg.pos.y;

	    if ( reg[i].regno ) {
		regno = this.regno++;
	    }

	    switch reg[i].shape {
	     case "annulus":
		for ( j = 0; j < reg.annuli.length; j++ ) {
		    drawcircle(x, y, reg.radii[j], regno);
		    regno++;
		}
	     	break;
	     case "circle":
		drawcircle(x, y, reg.radius, regno);
	     	break;

	     case "box":
		cxt.box(x, y, reg.size.width, reg.size.height)
	     	break;

	     case "ellipse":
		cxt.ellipse(x, y, r);
	     	break;
	     case "polygon":

		cxt.polygon(...);
	     	break;
	    }
	    this.regno++;
	}
    }
}

