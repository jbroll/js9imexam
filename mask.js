/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, bitwise: true */
/*globals $, document, imexam, Uint8Array, Uint32Array */ 

"use strict";


// source
// background
// exclude

    //DELETE-ME var imexam = require("./imexam");

    function d2r(d) { return d * (Math.PI / 180); }
    function rgb(regno) {
	var r = (regno >> 16) & 0x0000FF;
	var g = (regno >>  8) & 0x0000FF;
	var b =  regno        & 0x0000FF;
	
	return "rgb(" + r.toFixed(0) + "," + g.toFixed(0) + "," + b.toFixed(0) + ")";
    }
    function fakeEllipse(cx, cy, w, h, r, start, end, dir){
	
	var lx = cx - w/2,
	    rx = cx + w/2,
	    ty = cy - h/2,
	    by = cy + h/2;

	var magic = 0.551784;
	var xmagic = magic*w/2;
	var ymagic = h*magic/2;

	this.save();
        this.translate(cx, cy);
        this.rotate(r);
        this.translate(-cx, -cy);

	this.moveTo(cx,ty);
	this.bezierCurveTo(cx+xmagic,ty,rx,cy-ymagic,rx,cy);
	this.bezierCurveTo(rx,cy+ymagic,cx+xmagic,by,cx,by);
	this.bezierCurveTo(cx-xmagic,by,lx,cy+ymagic,lx,cy);
	this.bezierCurveTo(lx,cy-ymagic,cx-xmagic,ty,cx,ty);

	this.restore();
    }

    function drawCircle(ctx, x, y, rad, regno) {
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
	ctx.fillStyle = rgb(regno);
	ctx.fill();
    }
    function drawBox(ctx, x, y, h, w, rot, regno) {
	ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.translate(-x, -y);
	
	ctx.fillStyle = rgb(regno);
	ctx.fillRect(x-w/2, y-h/2, w, h);
	
	ctx.restore();
    }
    function drawEllipse(ctx, x, y, h, w, rot, regno) {
	ctx.beginPath();
	ctx.ellipse(x, y, h, w, rot, 0, 2 * Math.PI, false);
	ctx.fillStyle = rgb(regno);
	ctx.fill();
    }
    function drawPolygon(ctx, points, regno) {
	var i;

	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for ( i = 1; i < points.length; i++ ) {
	    ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.fillStyle = rgb(regno);
	ctx.fill();
    }


    function Mask (im) {
	this.im = im;

	this.canvas = document.createElement("canvas");
	this.canvas.width  = im.raw.width;
	this.canvas.height = im.raw.height;

	this.ctx = this.canvas.getContext("2d");

	this.ctx.smoothingEnabled = false;
	this.ctx.mozImageSmoothingEnabled = false;
	this.ctx.webkitImageSmoothingEnabled = false;

	if ( !this.ctx.ellipse ) { this.ctx.ellipse = fakeEllipse; }
    }


    Mask.prototype.done = function () {
	this.canvas.parent.removeChild(this.canvas);
    };

    Mask.prototype.getMask = function () {
	var pixl = new Uint8Array(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data);
	var data = imexam.ndops.zeros([this.canvas.height, this.canvas.width], Uint32Array);

	var width = this.canvas.width;

	imexam.ndops.fill(data, function (i, j) {
		var offs  = (i * width + j ) * 4;

		var value = (pixl[offs]     << 16)
			  + (pixl[offs + 1] <<  8)
			  +  pixl[offs + 2];

		return value;
	});

	return data;
    };

    Mask.prototype.listRegions = function (regs) {
	var i, j;
	var reg, regno = 1, radii;

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

    Mask.prototype.drawRegions = function (regs) {
	var reg, x, y, i;

	for ( i = 0; i < regs.length; i++ ) {
	    reg = regs[i];

	    switch ( reg.shape ) {
	     case "circle":
		drawCircle(this.ctx, reg.pos.x, reg.pos.y, reg.radius, reg.regno);
	     	break;

	     case "box":
		drawBox(this.ctx, reg.pos.x, reg.pos.y, reg.size.width, reg.size.height, d2r(reg.angle), reg.regno);
	     	break;

	     case "ellipse":
		drawEllipse(this.ctx, reg.pos.x, reg.pos.y, reg.eradius.x, reg.eradius.y, d2r(reg.angle), reg.regno);
	     	break;

	     case "polygon":
		drawPolygon(this.ctx, reg.points, reg.regno);
	     	break;
	    }
	}
    };

module.exports = Mask;


