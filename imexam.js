
function log() { console.log.apply(null, arguments); }

var cwise     = require("cwise")
var ndarray   = require("ndarray")
var ndops     = require("ndarray-ops")

ndops.pack    = require("ndarray-pack")
ndops.unpack  = require("ndarray-unpack")
ndops.fill    = require("ndarray-fill")
ndops.sort    = require("ndarray-sort")
ndops.moments = require("ndarray-moments")

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

ndops.print = function(a, prec) {
    var x, y;

    if ( prec === undefined ) { prec = 3; }

    if ( a.shape.length === 1 ) {
	for (x=0;x<a.shape[0];++x) {
	    process.stdout.write(a.get(x, y).toFixed(prec) + " ");
	}
        process.stdout.write("\n");
    } else {
	for ( y = a.shape[1]-1; y >= 0; --y ) {
	  for ( x = 0; x < a.shape[0]; ++x ) {
	    process.stdout.write(a.get(x, y).toFixed(prec) + " ");
	  }

	  process.stdout.write("\n");
	}
	process.stdout.write("\n");
    }
}

ndops.maxvalue = cwise({
	  args: ["array"]
	, pre: function(a) {
	  	this.max = Number.MIN_VALUE;
	  }
	, body: function(a) {
	    if ( a > this.max ) {
		this.max = a;
	    }
	  }
	, post: function() {
	    return this.max;
	  }
});

ndops.minvalue = cwise({
	  args: ["array"]
	, pre: function(a) {
	  	this.min = Number.MAX_VALUE;
	  }
	, body: function(a) {
	    if ( a < this.min ) {
		this.min = a;
	    }
	  }
	, post: function() {
	    return this.min;
	  }
});


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

ndops.centroid = cwise({
	  args: ["array", "scalar", "scalar", "index"]
	, pre: function(a, cx, cy) {
		this.center = new Array(2);

		this.center[0] = cx;
		this.center[1] = cy;

		this.sum   = 0
		this.sumx  = 0
		this.sumy  = 0
		this.sumxx = 0
		this.sumyy = 0
	  }
	, body: function(a, index) {
	  }
	, post: function() {
		return this.center;
	}
})


ndops.flatten = function() {
	var size = 0
	for ( i = 0; i < arguments.length; i++ ) {
	    size += arguments[i].size;
	}

	var reply = ndops.ndarray([size]);
	var off   = 0;

	for ( n = 0; n < arguments.length; n++ ) {
	    a = arguments[n];


	    ndops.assign(ndarray(reply.data, a.shape, a.stride, off), a);

	    off += a.size;
	}

	return reply;
}

ndops.median = function(a) {
	ndops.sort(a);

	console.log(a.get(a.size/2))

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
	
	stat.centoid = ndops.centroid(stat.imag, ndops.qcenter(stat.data));


	stat.xproj   = ndops.proj(stat.imag, 1);
	stat.yproj   = ndops.proj(stat.imag, 0);
	//stat.rproj   = ndops.rproj(stat.imag, stat.centroid);

	stat.counts  = ndops.sum_wt(stat.data, stat.mask)

	// stat.ee80    = ndops.ee80(im, stat.counts-stat.backgr);

	return stat;
}

exports.ndarray = ndarray
exports.ndops   = ndops
exports.imops   = imops

