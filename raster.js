/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals */ 

"use strict";

(function() {

    // http://cogsandlevers.blogspot.com/2013/11/scanline-based-filled-polygons.html
    //
    function drawHLine(x1, x2, y, k, buffer, width) {
        var x;
	var ofs = x1 + y * width; 			// calculate the offset into the buffer

	for (x = x1; x < x2; x++) { 			// draw all of the pixels
	    buffer[ofs++] = k;
	}
    }

    function scanline(x1, y1, x2, y2, miny, edges) {
	var x, y;

	if (y1 > y2) { 					// flip the points if need be
	     y = y1; y1 = y2; y2 = y;
	     x = x1; x1 = x2; x2 = x;
	}

	x = x1; 					// start at the start
	var dx = (x2 - x1) / (y2 - y1); 		// change in x over change in y will give us the gradient
	var ofs = Math.round(y1 - miny); 		// the offset the start writing at (into the array)

	for ( y = y1; y < y2; y++ ) { 		// cover all y co-ordinates in the line

	    // check if we've gone over/under the max/min
	    //
	    if ( edges[ofs].minx > x ) { edges[ofs].minx = x; }
	    if ( edges[ofs].maxx < x ) { edges[ofs].maxx = x; }

	    x += dx; 					// move along the gradient
	    ofs ++; 					// move along the buffer

	}
    }

    function _drawPolygon(points, color, buffer, width) {
	var i;
	var miny = points[0].y; 			// work out the minimum and maximum y values
	var maxy = points[0].y;

	for ( i = 1; i < points.length; i++ ) {
	    if ( points[i].y < miny) { miny = points[i].y; }
	    if ( points[i].y > maxy) { maxy = points[i].y; }
	}

	var h = maxy - miny; 				// the height is the size of our edges array
	var edges = [];

	for ( i = 0; i <= h+1; i++ ) { 			// build the array with unreasonable limits
	    edges.push({ minx:  1000000, maxx: -1000000 });
	}

	for ( i = 0; i < points.length-1; i++ ) { 	// process each line in the polygon
	    scanline(points[i  ].x, points[i  ].y
		   , points[i+1].x, points[i+1].y, miny, edges);
	}
	scanline(points[i].x, points[i].y, points[0].x, points[0].y, miny, edges);

	// draw each horizontal line
	for ( i = 0; i < edges.length; i++ ) {
	    drawHLine( Math.floor(edges[i].minx), Math.floor(edges[i].maxx),
		Math.floor(i + miny), color, buffer, width);
	}
    }


    function d2r(d) { return d * (Math.PI / 180); }

    function rotPoints(points, angle, about) {
	var x, y, i;
	var reply = [];

	angle = d2r(angle);

	for ( i = 0; i < points.length; i++ ) {
	    x = about.x + (((points[i].x-about.x) * Math.cos(angle)) - ((points[i].y-about.y) * Math.sin(angle)));
	    y = about.y + (((points[i].x-about.x) * Math.sin(angle)) + ((points[i].y-about.y) * Math.cos(angle)));

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

    exports.drawCircle = function (x, y, rad, color, buffer, width) {
	_drawPolygon(polyEllipse(x, y, rad, rad), color, buffer, width);
    };

    exports.drawPolygon = function (points, color, buffer, width) {
	_drawPolygon(points, color, buffer, width);
    };

    exports.drawEllipse = function (x, y, h, w, rot, color, buffer, width) {
	_drawPolygon(rotPoints(polyEllipse(x, y, h, w), rot, { x: x, y: y }), color, buffer, width);
    };

    exports.drawBox = function (x, y, h, w, rot, color, buffer, width) {
	_drawPolygon(rotPoints(polyBox(x, y, h, w), rot, { x: x, y: y }), color, buffer, width);
    };
}());
