
function log() { console.log.apply(null, arguments); }

var cwise     = require("cwise")
var ndarray   = require("ndarray")
var ndops     = require("ndarray-ops")

ndops.pack    = require("ndarray-pack")
ndops.unpack  = require("ndarray-unpack")
ndops.fill    = require("ndarray-fill")
ndops.sort    = require("ndarray-sort")
ndops.moments = require("ndarray-moments")

numeric       = require("numeric")

ndops.maxvalue = ndops.sup
ndops.minvalue = ndops.inf

ndops.size = function(shape) {
	var i;
	var size = 1
	for ( i = 0; i < shape.length; i++ ) {
	    size *= shape[i];
	}

	return size;
}

ndops.ndarray = function(shape) {
	return ndarray(new Float64Array(ndops.size(shape)), shape)
}

ndops.reshape = function(a, shape) {

    if ( a.size != ndops.size(shape) ) {
	throw new Error("sizes not equil " + a.size + " != ", + ndops.size(shape));
    }

    return ndarray(a.data, shape);
}

ndops.section = function(a, x1, x2, y1, y2) {
	return a.lo(x1, y1).hi(x2-x1, y2-y1)
}

ndops.print = function(a, width, prec) {
    var x, y;
    var line;

    if ( width === undefined ) { width = 7; }
    if ( prec === undefined  ) { prec  = 3; }

    if ( a.shape.length === 1 ) {
	line = ""
	for (x=0;x<a.shape[0];++x) {
	    line += a.get(x).toFixed(prec) + " ";
	}
	console.log(line)
    } else {
	for ( y = a.shape[0]-1; y >= 0; --y ) {
	  line = ""
	  for ( x = 0; x < a.shape[1]; ++x ) {
	    line += a.get(y, x).toFixed(prec) + " ";
	  }

	  console.log(line)
	}
	console.log("\n")
    }
}

ndops._hist = cwise({
      args: ["array", "scalar", "scalar", "scalar"]
    , pre: function(a, width, min, max) {
	var size = (max-min) / width + 1

	this.width = width
	this.size = size
	this.min = min
	this.max = max

	this.h = new Int32Array(size);
    }
    , body: function(a) {
    	var bin = Math.round(Math.max(0, Math.min(this.size, (a-this.min)/this.width)));

    	this.h[bin]++;
    }
    , post: function() {
    	return this.h
    }
})

ndops.hist = function(a, width, min, max) {
	hist = new Object()

    if ( min === undefined ) {
	min = ndops.minvalue(a);
    }
    if ( max === undefined ) {
	max = ndops.maxvalue(a);
    }
    if ( width === undefined ) {
	width = (max-min) / 2500;
    }

    hist.min   = min
    hist.max   = max
    hist.width = width

    reply = ndops._hist(a, width, min, max);
    hist.data = ndarray(reply, [reply.length])

    return hist
}

ndops._proj = cwise({
	  args: ["array", "scalar", "scalar", "index"]
	, pre: function(a, axis, size) {
		this.proj = new Float32Array(size);
	  }
	, body: function(a, axis, size, index) {
	    this.proj[index[axis]] = this.proj[index[axis]] + a;
	  }
	, post: function() {
	    return this.proj;
	  }
});
ndops.proj = function(a, axis, length) {
	return ndarray(ndops._proj(a, axis, a.shape[axis]), [a.shape[axis]]);
}

ndops.qcenter = cwise({
	  args: ["array"
		,  {offset:[-1,-1], array:0}
		,  {offset:[-1, 0], array:0}
		,  {offset:[-1, 1], array:0}
		,  {offset:[ 0,-1], array:0}
		,  {offset:[ 0, 1], array:0}
		,  {offset:[ 1,-1], array:0}
		,  {offset:[ 1, 0], array:0}
		,  {offset:[ 1, 1], array:0}, "index"]
	, pre:  function() {
	  	this.max = Number.MIN_VALUE;
		this.idx = undefined;
	  }
	, body: function(e, a, b, c, d, f, g, h, i, index) {
		var sum = a + b + c + d + e + f + g + h + i;

		if ( this.max < sum ) {
		    this.max = sum;
		    this.idx = index.concat();
		}
	  }
	, post: function() {
		return this.idx;
	  }
});


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


var imops = new Object();

imops.circle_mask = function(nx, ny, x, y, r) {

    return ndops.fill(ndops.ndarray([nx, ny]), function(i, j) {

	    return pixwt(r, i-nx+x, j-ny+y);
    });
}


ndops.sum_wt = cwise({
	  args: ["array", "array", "index"]
	, pre: function() {
		this.sum = 0;
	  }
	, body: function(a, b, index) {
		this.sum += a * b;
	  }
	, post: function() {
		return this.sum;
	  }
	});

ndops._centroid = cwise({
	  args: ["array", "scalar", "scalar", "index"]
	, pre: function(a, nx, ny) {
		this.sum   = 0;
		this.sumx  = 0;
		this.sumy  = 0;
		this.sumxx = 0;
		this.sumyy = 0;

		this.nx = nx;
		this.ny = ny;
	  }
	, body: function(a, nx, ny, index) {
		if ( a > 0 ) {
		    this.sum	+= a
		    this.sumx	+= a * index[1]
		    this.sumxx	+= a * index[1] * index[1]
		    this.sumy	+= a * index[0]
		    this.sumyy	+= a * index[0] * index[0]
		}
	  }
	, post: function() {
	    	var reply = new Object;

		reply.sum = this.sum;
		reply.cenx = this.sumx/this.sum;
		reply.ceny = this.sumy/this.sum;

		var rmom = ( this.sumxx - this.sumx * this.sumx / this.sum + this.sumyy - this.sumy * this.sumy / this.sum ) / this.sum;

		if ( rmom <= 0 ) {
		    reply.fwhm = -1.0;
		} else {
		    reply.fwhm = Math.sqrt(rmom)  * 2.354 / Math.sqrt(2.0);
		}

		return reply;
	}
})

ndops.centroid = function(a) {
    var reply = ndops._centroid(a, a.shape[0], a.shape[1]);

    return(reply);
}

ndops.flatten = function() {
	var size = 0
	for ( i = 0; i < arguments.length; i++ ) {
	    size += arguments[i].size;
	}

	var reply = ndops.ndarray([size]);
	var off   = 0;

	for ( n = 0; n < arguments.length; n++ ) {
	    a = arguments[n];

	    ndops.assign(ndarray(reply.data, a.shape, undefined, off), a);

	    off += a.size;
	}

	return reply;
}

ndops.median = function(a) {
	ndops.sort(a);

	return a.get(a.size/2);
}




imops.backgr = function(data, width) {
	var back = new Object();


	var pixels = ndops.flatten(ndops.section(data, 0, width, 0, data.shape[1])
			   , ndops.section(data, data.shape[0]-width, data.shape[0], 0, data.shape[1])
			   , ndops.section(data, width, data.shape[0]-width, 0, width)
			   , ndops.section(data, width, data.shape[0]-width, data.shape[1]-width, data.shape[1]))


	var moment = ndops.moments(2, pixels);

	back.noise = Math.sqrt(moment[1] - moment[0]*moment[0])
	back.value = ndops.median(pixels);

	return back;
}

imops.mksection = function(x, y, w, h) {
	return [[x-(w/2), x+(w/2)], [y-(h/2), y+(h/2)]]
}

imops._rproj = cwise({
	  args: ["array", "scalar", "scalar", "scalar", "index"]
	, pre: function(a, cy, cy, length) {
	        this.reply = new Float64Array(length*2);
		this.i = 0
	  }
	, body: function(a, cx, cy, length, index) {
		this.reply[this.i*2  ] = Math.sqrt((index[0]-cx)*(index[0]-cx) + (index[1]-cy)*(index[1]-cy))
		this.reply[this.i*2+1] = a

		this.i++;
	  }
	, post: function() {
		return this.reply;
	}
})

imops.rproj = function(im, center) {
    var reply = ndarray(imops._rproj(im, center[0], center[1], im.size), [im.size, 2])

    ndops.sort(reply)

    return reply;
}

imops.imstat = function (image, section, type) {
	var stat = new Object();

	// Select a chunk of data contained in the region.
	//
	stat.sect = section
	stat.imag = ndops.section(image, section[1][0],  section[1][1], section[0][0], section[0][1]);

	// Make a mask of the pixel weight for each pixel in/out of the region.
	//
	if ( type === "circle" ) {
	    stat.mask = imops.circle_mask(stat.imag.shape[0],   stat.imag.shape[1]
				        , stat.imag.shape[0]/2, stat.imag.shape[1]/2
					, Math.min(stat.imag.shape[0]/2, stat.imag.shape[1]/2));
	} else {
	    stat.mask = ndops.ndarray([stat.imag.shape[0], stat.imag.shape[1]]);
	    ndops.assigns(stat.mask, 1);
	}



	backgr  = imops.backgr(stat.imag, 4);

	stat.backgr = backgr.value
	stat.noise  = backgr.noise


	stat.data = ndops.ndarray(stat.imag.shape);
	ndops.subs(stat.data, stat.imag, stat.backgr);
	

	stat.centroid = ndops.centroid(stat.data, ndops.qcenter(stat.data));

	stat.hist    = ndops.hist(stat.imag);
	stat.xproj   = ndops.proj(stat.imag, 1);
	stat.yproj   = ndops.proj(stat.imag, 0);
	stat.rproj   = imops.rproj(stat.imag, [stat.centroid.cenx, stat.centroid.ceny]);

	stat.centroid.cenx += section[0][0]
	stat.centroid.ceny += section[1][0]

	stat.counts  = ndops.sum_wt(stat.data, stat.mask)

	// stat.ee80    = ndops.ee80(im, stat.counts-stat.backgr);

	return stat;
}

exports.numeric = numeric
exports.ndarray = ndarray
exports.ndops   = ndops
exports.imops   = imops

