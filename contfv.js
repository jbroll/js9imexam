/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true, bitwise: true */
/*globals typed, Int8Array */

"use strict";

(function() {

    var top    = 0;
    var right  = 1;
    var bottom = 2;
    var left   = 3;
    var none   = 4;

    function contour (levels, xdim, ydim, image, draw)
    {
      var c;
      var level;

      var used = new Uint8Array(xdim*ydim);
      var ii,jj;


      for ( c=0; c < levels.length; c++ ) {
	level = levels[c];

	for ( ii=0; ii < xdim*ydim; ii++) {
	  used[ii] = 0;
	}

	//  Search outer edges
	//
	//  Search top
	for ( jj=0, ii=0; ii < xdim-1; ii++ ) {
	  if ( image[jj*xdim + ii] < level && level <= image[jj*xdim + ii+1]) {
	    trace(xdim, ydim, level, ii  , jj  ,    top, image, used, draw);
	  }
	}

	//  Search right
	for (jj=0; jj < ydim-1; jj++) {
	  if ( image[jj*xdim + ii] < level && level <= image[(jj+1)*xdim + ii]) {
	    trace(xdim, ydim, level, ii-1, jj  ,  right, image, used, draw);
	  }
	}

	//  Search Bottom
	for (ii--; ii >= 0; ii--) {
	  if ( image[jj*xdim + ii+1]<level && level <= image[jj*xdim + ii]) {
	    trace(xdim, ydim, level, ii  , jj-1, bottom, image, used, draw);
	  }
	}

	//  Search Left
	for (ii=0, jj--; jj >= 0; jj--) {
	  if ( image[(jj+1)*xdim + ii] < level && level <= image[jj*xdim + ii] ) {
	    trace(xdim, ydim, level, ii  , jj  ,   left, image, used, draw);
	  }
	}

	//  Search each row of the image
	for (jj=1; jj < ydim-1; jj++) {
	  for (ii=0; ii < xdim-1; ii++) {
	    if ( !used[jj*xdim + ii] && image[jj*xdim + ii] < level && level <= image[jj*xdim + ii+1]) {
	      trace(xdim, ydim, level, ii, jj  ,    top, image, used, draw);
	    }
	  }
	}
      }
    }

    function trace (xdim, ydim, level, xCell, yCell, side, image, used, draw)
    {
      var ii = xCell;
      var jj = yCell;
      var origSide = side;

      var init = 1;
      var done = (ii<0 || ii>=xdim-1 || jj<0 && jj>=ydim-1);

      var flag;
      var a, b, c, d;
      var X, Y;

      while ( !done ) {
	flag = 0;

	a = image[ jj   *xdim + ii];
	b = image[ jj   *xdim + ii+1];
	c = image[(jj+1)*xdim + ii+1];
	d = image[(jj+1)*xdim + ii];

	if (init) {
	  init = 0;
	  switch (side) {
	  case top:
	    X = (level-a) / (b-a) + ii;
	    Y = jj;
	    break;
	  case right:
	    X = ii+1;
	    Y = (level-b) / (c-b) + jj;
	    break;
	  case bottom:
	    X = (level-c) / (d-c) + ii;
	    Y = jj+1;
	    break;
	  case left:
	    X = ii;
	    Y = (level-a) / (d-a) + jj;
	    break;
	  }

	}
	else {
	  if ( side==top ) { used[jj*xdim + ii] = 1; }

	  do {
	    if ( ++side == none ) { side = top; }

	    switch (side) {
	    case top:
	      if (a>=level && level>b) {
		flag = 1;
		X = (level-a) / (b-a) + ii;
		Y = jj;
		jj--;
	      }
	      break;
	    case right:
	      if( b>=level && level>c ) {
		flag = 1;
		X = ii+1;
		Y = (level-b) / (c-b) + jj;
		ii++;
	      }
	      break;
	    case bottom:
	      if( c>=level && level>d ) {
		flag = 1;
		X = (level-d) / (c-d) + ii;
		Y = jj+1;
		jj++;
	      }
	      break;
	    case left:
	      if( d>=level && level>a ) {
		flag = 1;
		X = ii;
		Y = (level-a) / (d-a) + jj;
		ii--;
	      }
	      break;
	    }
	  } while ( !flag );

	  if ( ++side === none ) { side = top; }
	  if ( ++side === none ) { side = top; }

	  if (ii==xCell && jj==yCell && side==origSide) { done = 1; }
	  if (ii<0 || ii>=xdim-1 || jj<0 || jj>=ydim-1) { done = 1; }
	}

	draw(X+.5 ,Y+.5, level);

	if (done) { draw(0, 0, undefined); }
      }
    }

    module.exports = contour;
}());

