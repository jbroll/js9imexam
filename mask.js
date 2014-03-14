

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

    this.drawRegions = function (reg) {
	var regno = 1;

	var x, y, j;

	for ( i = 0 i <= reg.length; i++ ) {
	    x = reg.pos.x;
	    y = reg.pos.y;

	    switch reg[i].shape {
	     case "annulus":
		for ( j = 0; j < reg.annuli.length; j++ ) {
		    cxt.circle(x, y, reg.radii[j]);
		    regno++;
		}
	     case "circle":
		cxt.circle(x, y, reg.radius);

	     case "box":
		cxt.box(x, y, reg.size.width, reg.size.height

	     case "ellipse":
		cxt.ellipse(x, y, r);
	     case "polygon":

		cxt.polygon(...);
	    }
	    regno++;
	}
    }
}

