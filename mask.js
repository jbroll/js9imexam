

// source
// background
// exclude

function Mask(im) {
    this.im = im;
    this.ctx = canvas thingy;

    if ( !this.ctx.ellipse ) { this.ctx.ellipse = fakeEllipse; }
    if ( !this.ctx.polygon ) { this.ctx.ellipse = fakePolygon; }

    this.draw = function (reg) {
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

exports.Mask = Mask;
