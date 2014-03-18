(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9, imexam */ 

"use strict";


(function() {
     var imexam = require("./imexam");
    var Mask = require("./mask");

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
	var mask = new Mask(im);

	var regs = JS9.Regions(im);
	var list = mask.listRegions(regs);
	           mask.drawRegions(list);

	var cnts = imexam.ndops.imcnts(data, mask.getMask(), list.length+1);

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
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, bitwise: true */
/*globals $, document, imexam, Uint8Array, Uint32Array */ 

"use strict";


// source
// background
// exclude

     var imexam = require("./imexam");

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



},{}]},{},[1])