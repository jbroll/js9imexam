(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9, imexam, Uint32Array */ 

"use strict";


(function() {
     var imexam = require("./imexam");
    var mask = require("./mask");

    function hasTag(reg, tag) {
	var i;

	for ( i = 0; i < reg.tags.length; i++ ) {
	    if ( reg.tags[i] === tag ) { return true; }
	}

	return false;
    }

    function runImCnts(im, xreg) {
	var i;
	var div  = this.div;
	var text = $(div).find(".imcnts-result")[0];

	var data = imexam.ndops.ndarray(im.raw.data, [im.raw.height, im.raw.width]);

	var regs = JS9.Regions(im);
	var mimg = imexam.ndops.zeros(data.shape, Uint32Array);

	var list = mask.listRegions(regs);
	           mask.drawRegions(list, mimg);

	var cnts = imexam.ndops.imcnts(data, mimg, list.length+1);

	var backgr_cnts = 0, backgr_area = 0;

	var back = [];
	var srce = [];
	var net, regno;

	for ( i = 0; i < list.length; i++ ) {
	    if ( hasTag(list[i], "background") ) {
		regno = list[i].regno;

		backgr_cnts += cnts.cnts.get(regno);
		backgr_area += cnts.area.get(regno);

		back.push({ regno: regno, cnts: cnts.cnts[regno], area: cnts.area[regno] });
	    }
	}

	for ( i = 0; i < list.length; i++ ) {
	    if ( hasTag(list[i], "source") ) {
		regno = list[i].regno;

		if ( backgr_area > 0 ) {
		    net = cnts.cnts.get(regno) - (backgr_cnts * (cnts.area.get(regno)/backgr_area));
		} else {
		    net = cnts.cnts.get(regno);
		}

		srce.push({ regno: regno, net: net, cnts: cnts.cnts.get(regno), area: cnts.area.get(regno) });
	    }
	}

	var image = { filename: "Mask", bitpix: 32, naxis: 2
			, axis: { 1: data.shape[0], 2: data.shape[1] } 
			, dmin: 0, dmax: regno
			, head: {}, data: mimg.data
		    };
	JS9.Load(image);

	$(text).html($.map(srce, JSON.stringify).join("\n"));
    }

/*
    function getRegions(div, display) {
	var im  = JS9.GetImage(display);

	if ( im ) {
	    var data = imexam.ndops.ndarray(im.raw.data);
	    var form = $(div).find(".imcnts-form")[0];

	    form.min.value = imexam.ndops.minvalue(data).toFixed(2);
	    form.max.value = imexam.ndops.maxvalue(data).toFixed(2);
	}
    }
 */

    function imcntsInit() {
	var div = this.div;

/*
	div.innerHTML = '<form class="imcnts-form">							\
	    <table><tr>	<td>Source</td>									\
			<td>Background</td>								\
		       	<td><input type=button value="Run ImCnts" class="run-imcnts"></td></tr>		\
	           <tr>	<td><textarea type=textarea rows=12 cols=20 name=level class="imcnts-src">	\
			    </textarea>									\
	    		<td><textarea type=textarea rows=12 cols=20 name=level class="imcnts-bkg">	\
			    </textarea>									\
		       	<td><input type=button value="Get Regions" class="get-min-max"></td></tr>	\
	           <tr>	<td>Results</td></tr>								\
	           <tr> <td colspan=3><textarea type=textarea rows=12 cols=60 name=level class="imcnts-levels">	\
			              </textarea>							\
		   </tr>										\
	    </table>											\
	    <p>												\
	    </form>';
 */

	div.innerHTML = '<form class="imcnts-form">							\
	    <table>											\
	           <tr>	<td>Counts in Regions</td></tr>							\
	           <tr> <td colspan=3><textarea type=textarea rows=12 cols=60 name=level class="imcnts-result">	\
			              </textarea>							\
		   </tr>										\
	    </table>											\
	    <p>												\
	    </form>';

	//var display = this.display;
	//$(div).find(".run-imcnts").click(function ()  { runImCnts (div, display); });
	//$(div).find(".get-regions").click(function () { getRegions(div, display); });

	imexam.fixupDiv(this);
    }

    JS9.RegisterPlugin("ImExam", "ImCnts", imcntsInit, {
	    menu: "analysis",

            winTitle: "ImCounts",
            menuItem: "ImCounts",
	    help:     "imexam/imcnts.html",

	    toolbarSeparate: true,
	    toolbarHTML: " ",

            regionchange: runImCnts,
            winDims: [500, 250],
    });
}());

},{"./mask":2}],2:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $ */ 

"use strict";

// source
// background
// exclude

(function() {
    var raster = require("./raster");


    exports.listRegions = function (regs) {
	var i, j;
	var reg, regno = 1;

	var reply = [];

	for ( i = 0; i < regs.length; i++ ) {
	    reg = regs[i];

	    switch ( reg.shape ) {
	     case "annulus":
		for ( j = reg.radii.length-1; j >= 0; j-- ) {
		    if ( reg.radii[j] !== 0.0 ) {
			reply[regno-1] = $.extend($.extend({}, reg), { regno: regno++, shape: "circle", radius: reg.radii[j] });
		    }
		}
	     	break;
	     default:
		reply[regno-1] = $.extend({ regno: regno++ }, reg);
		break;
	    }
	}

	return reply;
    };

    exports.drawRegions = function (regs, data) {
	var reg, i;

	for ( i = 0; i < regs.length; i++ ) {
	    reg = regs[i];

	    switch ( reg.shape ) {
	     case "circle":
		raster.drawCircle(reg.pos.x, reg.pos.y, reg.radius, reg.regno, data.data, data.shape[0]);
	     	break;

	     case "box":
		raster.drawBox(reg.pos.x, reg.pos.y, reg.size.width, reg.size.height, reg.angle, reg.regno, data.data, data.shape[0]);
	     	break;

	     case "ellipse":
		raster.drawEllipse(reg.pos.x, reg.pos.y, reg.eradius.x, reg.eradius.y, reg.angle, reg.regno, data.data, data.shape[0]);
	     	break;

	     case "polygon":
		raster.drawPolygon(reg.points, reg.regno, data.data, data.shape[0]);
	     	break;
	    }
	}
    };
}());


},{"./raster":3}],3:[function(require,module,exports){
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

},{}]},{},[1])