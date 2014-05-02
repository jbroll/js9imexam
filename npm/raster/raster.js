/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals */ 

"use strict";

(function() {

    // http://cogsandlevers.blogspot.com/2013/11/scanline-based-filled-polygons.html
    //
    function drawHLine(buffer, width, x1, x2, y, k, rop) {

	if ( x1 < 0     ) { x1 = 0;     }
	if ( x2 > width ) { x2 = width; }

	var ofs = x1 + y * width; 			// calculate the offset into the buffer
        var x;

	switch ( rop ) { 				// draw all of the pixels
	 case undefined:
	 case "set": for (x = x1; x < x2; x++) { buffer[ofs++]  = k; }; break;
	 case "add": for (x = x1; x < x2; x++) { buffer[ofs++] += k; }; break;
	}
    }

    function scanline(x1, y1, x2, y2, miny, edges) {
	var x, y, xi;

	if (y1 > y2) { 					// flip the points if need be
	     y = y1; y1 = y2; y2 = y;
	     x = x1; x1 = x2; x2 = x;
	}

	y1 = Math.floor(y1)+1;
	y2 = Math.floor(y2);

	//if ( y2 < y1 ) { y2++ }

	x = x1; 					// start at the start
	var dx = (x2 - x1) / (y2 - y1); 		// change in x over change in y will give us the gradient
	var ofs = Math.round(y1 - miny); 		// the offset the start writing at (into the array)

	for ( y = y1; y <= y2; y++ ) { 		// cover all y co-ordinates in the line

	    xi = Math.floor(x) + 1;

	    // check if we've gone over/under the max/min
	    //
	    if ( edges[ofs].minx > xi ) { edges[ofs].minx = xi; }
	    if ( edges[ofs].maxx < xi ) { edges[ofs].maxx = xi; }

	    x += dx; 					// move along the gradient
	    ofs ++; 					// move along the buffer

	}
    }

    function _drawPolygon(buffer, width, points, color, rop) {
	var i;
	var miny = points[0].y-1; 			// work out the minimum and maximum y values
	var maxy = points[0].y-1;

	for ( i = 1; i < points.length; i++ ) {
	    if ( points[i].y-1 < miny) { miny = points[i].y-1; }
	    if ( points[i].y-1 > maxy) { maxy = points[i].y-1; }
	}

	var h = maxy - miny; 				// the height is the size of our edges array
	var edges = [];

	for ( i = 0; i <= h+1; i++ ) { 			// build the array with unreasonable limits
	    edges.push({ minx:  1000000, maxx: -1000000 });
	}

	for ( i = 0; i < points.length-1; i++ ) { 	// process each line in the polygon
	    scanline(points[i  ].x-1, points[i  ].y-1
		   , points[i+1].x-1, points[i+1].y-1, miny, edges);
	}
	scanline(points[i].x-1, points[i].y-1, points[0].x-1, points[0].y-1, miny, edges);

	// draw each horizontal line
	for ( i = 0; i < edges.length; i++ ) {
	    drawHLine( buffer, width
		     , Math.floor(edges[i].minx)
		     , Math.floor(edges[i].maxx)
		     , Math.floor(i + miny), color, rop);
	}
    }

    function d2r(d) { return d * (Math.PI / 180); }

    function rotPoints(points, angle, about) {
	var x, y, i;
	var reply = [];

	angle = d2r(angle);

	var sin = Math.sin(angle);
	var cos = Math.cos(angle);

	for ( i = 0; i < points.length; i++ ) {
	    x = about.x + (((points[i].x-about.x) * cos) - ((points[i].y-about.y) * sin));
	    y = about.y + (((points[i].x-about.x) * sin) + ((points[i].y-about.y) * cos));

	    reply.push({ x: x, y: y });
	}

	return reply;
    }

    function polyEllipse(x, y, w, h) {
	var ex, ey, i;
	var reply = [];

	for ( i = 0; i < 2 * Math.PI; i += 0.01 ) {
	    ex = x + w*Math.cos(i);
	    ey = y + h*Math.sin(i);

	    reply.push({ x: ex, y: ey });
	}

	return reply;
    }

    function polyBox(x, y, w, h) {
	return [  { x: x-w/2, y: y-h/2 }
		, { x: x-w/2, y: y+h/2 }
		, { x: x+w/2, y: y+h/2 }
		, { x: x+w/2, y: y-h/2 } ];
    }

    exports.drawPolygon = function (buffer, width, points,    color, rop)       { _drawPolygon(buffer, width, points,                      color, rop); };
    exports.drawCircle  = function (buffer, width, x, y, rad, color, rop)       { _drawPolygon(buffer, width, polyEllipse(x, y, rad, rad), color, rop); };
    exports.drawEllipse = function (buffer, width, x, y, h, w, rot, color, rop) { _drawPolygon(buffer, width, rotPoints(polyEllipse(x, y, h, w), rot, { x: x, y: y }), color, rop); };
    exports.drawBox     = function (buffer, width, x, y, h, w, rot, color, rop) { _drawPolygon(buffer, width, rotPoints(polyBox    (x, y, h, w), rot, { x: x, y: y }), color, rop); };
}());
