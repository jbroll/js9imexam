/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $ */ 

"use strict";

// source
// background
// exclude

(function() {
    var raster = require("./raster");

    function hasTag(reg, tag) {
	var i;

	for ( i = 0; i < reg.tags.length; i++ ) {
	    if ( reg.tags[i] === tag ) { return true; }
	}

	return false;
    }
    exports.hasTag = hasTag;

    exports.listRegions = function (regs) {
	var i, j;
	var reg, regno = 1;

	var reply = [];

	for ( i = 0; i < regs.length; i++ ) {
	    reg = regs[i];

	    switch ( reg.shape ) {
	     case "annulus":
		for ( j = 0; j < reg.radii.length; j++ ) {
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

    exports.drawRegions = function (regs, buffer, width) {
	var reg, t, i;

	var type = [ "include", "exclude" ];

	for ( t = 0; t < 2; t++ ) {
	    for ( i = regs.length - 1; i >= 0; i-- ) {
		reg = regs[i];

		if ( hasTag(reg, type[t]) ) {
		    switch ( reg.shape ) {
		     case "polygon": raster.drawPolygon(buffer, width, reg.points,                       reg.regno); 				 break;
		     case "circle":  raster.drawCircle( buffer, width, reg.pos.x, reg.pos.y, reg.radius, reg.regno); 				 break;
		     case "box":     raster.drawBox(    buffer, width, reg.pos.x, reg.pos.y, reg.size.width, reg.size.height, reg.angle, reg.regno); break;
		     case "ellipse": raster.drawEllipse(buffer, width, reg.pos.x, reg.pos.y, reg.eradius.x,  reg.eradius.y,   reg.angle, reg.regno); break;
		    }
		}
	    }
	}
    };
}());

