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

