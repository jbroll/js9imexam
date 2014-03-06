
// Recursive function to compute the area of a pixel at x,y that falls with in
// radius r.
//
function pixwt(r, x, y, D) {
	var d;

    if ( x < 0 || y < 0 ) {
	return pixwt(r, Math.abs(x), Math.abs(y), D);
    }

    if ( D === undefined ) {
	D = 1;
    }

    if ( D < .001 ) {					// Just stop after a while.
	return 0;
    }

    d = D / 2.0;


    if ( (x+d)*(x+d) + (y+d)*(y+d)        <= r*r ) {	// Outside corner is inside circle
	return D*D;
    } else if ( (x-d)*(x-d) + (y-d)*(y-d) >= r*r ) {	// Inside corner is outside circle
	return 0;
    } else {
	d = D/4.0;
	D = D/2.0;

	var reply =
		pixwt(r, x+d, y+0, D) +
	       	pixwt(r, x+0, y+d, D) +
	       	pixwt(r, x-d, y-0, D) +
	      	pixwt(r, x-0, y-d, D);

	return reply;
    }
}


imops.circle_mask = function(nx, ny, x, y, r) {

    return ndops.fill(ndops.ndarray([nx, ny]), function(i, j) {

	    return pixwt(r, i-nx+x, j-ny+y);
    });
}
