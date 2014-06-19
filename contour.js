(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9, imexam */ 

"use strict";


(function() {
      var imexam = require("./imexam");
    //var conrec = require("./conrec");
      var contfv = require("./contfv");

    function drawContours(div, display) {
	var i;
	var im   = JS9.GetImage(display);
	var form = $(div).find(".contour-form")[0];

	var data = imexam.ndops.ndarray(im.raw.data, [im.raw.height, im.raw.width]);

	var levelString = form.level.value;

	var level = JSON.parse("[" + levelString.split(/\s+/).join(",") + "]");

	if ( false ) {
	    var c      = new conrec.Conrec();

	    try {
		c.contour(data
			, 0, data.shape[0]-1, 0, data.shape[1]-1
			, imexam.ndops.iota(1, data.shape[0]), imexam.ndops.iota(1, data.shape[1])
			, level.length, level);
	    } catch (e) {
		alert("Too many coutour segments: Check your coutour levels.\n\nAre you trying to coutour the background levels of an image?");
		return;
	    }


	    var contours = c.contourList().map(function(contour) {
		    return { shape: "polygon", pts: contour };
		    });
	} else {
	    var contours = [];
	    var points   = [];

	    contours.push({ shape: "polygon", pts: points });

	    contfv(level, data.shape[0], data.shape[1], data.data
		, function(x, y, level) {
		    if ( level === undefined ) {
			points = [];
			contours.push({ shape: "polygon", pts: points });
		    } else {
			points.push({ x: x+0.5, y: y+0.5 });
		    }
		  });
	}

	contours.length = contours.length-1;


	JS9.NewShapeLayer(im, "contour", JS9.Catalogs.opts);
	JS9.RemoveShapes(im, "contour");
	JS9.AddShapes(im, "contour", contours, {color: "yellow"});
    }

    function getMinMax(div, display) {
	var im  = JS9.GetImage(display);

	if ( im ) {
	    var form = $(div).find(".contour-form")[0];
	    var data = imexam.ndops.ndarray(im.raw.data, [im.raw.width, im.raw.height]);

	    form.min.value = imexam.ndops.minvalue(data).toFixed(2);
	    form.max.value = imexam.ndops.maxvalue(data).toFixed(2);
	}
    }

    function makeLevel(div, display) {
	var i;
	var im  = JS9.GetImage(display);

	if ( im ) {
	    var form = $(div).find(".contour-form")[0];

	    var n     = Number(form.nlevel.value);
	    var level = imexam.ndops.ndarray(imexam.ndops.iota(1, n));

	    var min   = Number(form.min.value);
	    var max   = Number(form.max.value);

	    imexam.ndops.divs(level, level, n+1);		// Try n levels from min to max.
	    imexam.ndops.muls(level, level, max-min);
	    imexam.ndops.adds(level, level, min);

	    var levText = [];
	    for ( i = 0; i < level.shape[0]; i++ ) {
		levText.push(level.data[i].toFixed(2));
	    }

	    form.level.value = levText.join("\n");
	}
    }

    function contInit() {
	var im  = JS9.GetImage(this.display);
	var div = this.div;

	div.innerHTML = '<form class="contour-form">							\
	    <table><tr>	<td>N</td>									\
			<td><input type=text name=nlevel value=10 size=10></td>				\
		       	<td><input type=button value="Draw Contours" class="drw-contour"></td></tr>	\
	           <tr>	<td>Min</td>									\
			<td><input type=text name=min size=10></td>					\
		       	<td><input type=button value="Set Min/Max" class="get-min-max"></td></tr>	\
	           <tr>	<td>Max</td>									\
			<td><input type=text name=max size=10></td></tr>				\
	           <tr>	<td valign=top>Levels:</td>							\
	    		<td><textarea type=textarea rows=12 cols=10 name=level class="contour-levels">	\
			    </textarea>									\
		       	<td valign=top><input type=button value="Make Levels" class="make-levels"></td>	\
		   </tr>										\
	    </table>											\
	    <p>												\
	    </form>';

	var display = this.display;

	$(div).find(".drw-contour").click(function () { drawContours(div, display); });
	$(div).find(".get-min-max").click(function () { getMinMax(div, display); });
	$(div).find(".make-levels").click(function () { makeLevel(div, display); });


	if ( im !== undefined ) {
	    getMinMax(div, display);
	    makeLevel(div, display);
	}

	imexam.fixupDiv(this);
    }

    JS9.RegisterPlugin("ImExam", "Contours", contInit, {
	    menu: "view",

            winTitle: "Contours",
            menuItem: "Contours",
	    help:     "imexam/coutours.html",

	    toolbarSeparate: true,
	    toolbarHTML: "$title",

            winDims: [250, 250],
    });
}());


},{"./contfv":1}]},{},[2])
