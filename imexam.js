/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals Float64Array, Float32Array, Int32Array */ 

"use strict";

var cwise     = require("cwise");
var ndarray   = require("ndarray");
var ndops     = require("ndarray-ops");

ndops.pack    = require("ndarray-pack");
ndops.unpack  = require("ndarray-unpack");
ndops.fill    = require("ndarray-fill");
ndops.sort    = require("ndarray-sort");
ndops.moments = require("ndarray-moments");

var numeric   = require("numeric");

var template  = require("./template");

var imops = {};

ndops.maxvalue = ndops.sup;
ndops.minvalue = ndops.inf;

ndops.size = function(shape) {
        var i;
        var size = 1;
        for ( i = 0; i < shape.length; i++ ) {
            size *= shape[i];
        }

        return size;
};

ndops.ndarray = function(shape) {
        return ndarray(new Float64Array(ndops.size(shape)), shape);
};

ndops.reshape = function(a, shape) {

    if ( a.size !== ndops.size(shape) ) {
        throw new Error("sizes not equil " + a.size + " != ", + ndops.size(shape));
    }

    return ndarray(a.data, shape);
};

ndops.section = function(a, sect) {
        var x1 = sect[0][0];
        var x2 = sect[0][1];
        var y1 = sect[1][0];
        var y2 = sect[1][1];

        return a.lo(y1, x1).hi(y2-y1, x2-x1);
};

ndops.print = function(a, width, prec) {
    var x, y;
    var line;

    if ( width === undefined ) { width = 7; }
    if ( prec === undefined  ) { prec  = 3; }

    if ( a.shape.length === 1 ) {
        line = "";
        for (x=0;x<a.shape[0];++x) {
            line += a.get(x).toFixed(prec) + " ";
            //if ( x > 17 ) { break;}
        }
        console.log(line);
    } else {
        for ( y = a.shape[0]-1; y >= 0; --y ) {
          line = "";
          for ( x = 0; x < a.shape[1]; ++x ) {
            line += a.get(y, x).toFixed(prec) + " ";
          }

          console.log(line);
        }
        console.log("\n");
    }
};

ndops._hist = cwise({
      args: ["array", "scalar", "scalar", "scalar"]
    , pre: function(a, width, min, max) {
        var size = (max-min) / width + 1;

        this.width = width;
        this.size = size;
        this.min = min;
        this.max = max;

        this.h = new Int32Array(size);
    }
    , body: function(a) {
        var bin = Math.round(Math.max(0, Math.min(this.size, (a-this.min)/this.width)));

        this.h[bin]++;
    }
    , post: function() {
        return this.h;
    }
});

ndops.hist = function(a, width, min, max) {
    var hist = {};
    var reply;

    if ( min === undefined ) {
        min = ndops.minvalue(a);
    }
    if ( max === undefined ) {
        max = ndops.maxvalue(a);
    }
    if ( width === undefined ) {
        width = Math.max(1, (max-min) / 250);
    }

    hist.min   = min;
    hist.max   = max;
    hist.width = width;

    reply = ndops._hist(a, width, min, max);
    hist.data = ndarray(reply, [reply.length]);

    return hist;
};

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
        var sect;
	var i;

        var proj = ndarray(ndops._proj(a, axis, a.shape[axis === 0 ? 1 : 0]), [a.shape[axis === 0 ? 1 : 0]]);
        
        proj.n   = a.shape[axis === 1 ? 0 : 1];
	proj.x   = a.shape[axis]

        proj.sum = ndops.ndarray([proj.n]);
        proj.avg = ndops.ndarray([proj.n]);
        proj.med = ndops.ndarray([proj.n]);

        var copy = ndops.assign(ndops.ndarray(a.shape), a);

        for ( i = 0; i < proj.n; i++ ) {
            if ( axis === 0 ) {
                sect = ndops.section(copy, [[i, i+1], [0, proj.x]]);
            } else {
                sect = ndops.section(copy, [[0, proj.x], [i, i+1]]);
            }

            proj.sum.set(i, ndops.sum(sect));
            proj.avg.set(i, ndops.sum(sect)/proj.n);
            proj.med.set(i, ndops.median(sect));
        }

        return proj;
};

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

ndops._rms = cwise({
          args: ["array", "scalar", "scalar", "scalar", "scalar", "index"]
        , pre: function(a, cx, cy, nx, ny) {
                this.rmsq = 0;
                this.n    = 0;

                this.r = nx*nx+ny*ny;
          }
        , body: function(a, cx, cy, nx, ny, index) {
                if ( a > 0 && index[0]*index[0] + index[1]*index[1] < this.r ) {
                    cy = (index[0] - cx) * a;
                    cx = (index[1] - cy) * a;
                    
                    this.rmsq += cx*cx + cy*cy;
                    this.n += 1;
                }
          }
        , post: function() {
                if ( this.n !== 0 ) {
                    return 2.0*Math.sqrt(this.rmsq/this.n-1);
                }

                return 0;
        }
});

ndops.rms = function(a, cx, cy) {
    var reply = ndops._rms(a, cx, cy, a.shape[0], a.shape[1]);

    return reply;
};

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

                this.r = nx*nx+ny*ny;
          }
        , body: function(a, nx, ny, index) {
                if ( a > 0 && index[0]*index[0] + index[1]*index[1] < this.r ) {
                    this.sum    += a;
                    this.sumx   += a * index[1];
                    this.sumxx  += a * index[1] * index[1];
                    this.sumy   += a * index[0];
                    this.sumyy  += a * index[0] * index[0];
                }
          }
        , post: function() {
                var reply = {};

                reply.sum  = this.sum;
                reply.cenx = this.sumx/this.sum;
                reply.ceny = this.sumy/this.sum;

                reply.rmom = ( this.sumxx - this.sumx * this.sumx / this.sum + this.sumyy - this.sumy * this.sumy / this.sum ) / this.sum;

                if ( reply.rmom <= 0 ) {
                    reply.fwhm = -1.0;
                } else {
                    reply.fwhm = Math.sqrt(reply.rmom)  * 2.354 / Math.sqrt(2.0);
                }

                return reply;
        }
});

ndops.centroid = function(a) {
    var reply = ndops._centroid(a, a.shape[0], a.shape[1]);

    return reply;
};

ndops.flatten = function() {
        var size = 0;
	var i, n, a;

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
};

ndops.median = function(a) {
        var data = ndops.assign(ndops.ndarray(a.shape), a);

        data = ndops.reshape(data, [a.size]);

        ndops.sort(data);

        var reply = data.get(Math.round(data.size/2.0));

        return reply;
};


imops.backgr = function(data, width) {
        var back = {};

        var pixels = ndops.flatten(
                             ndops.section(data, [[0, width], [0, data.shape[1]]])
                           , ndops.section(data, [[data.shape[0]-width, data.shape[0]], [0, data.shape[1]]])
                           , ndops.section(data, [[width, data.shape[0]-width], [0, width]])
                           , ndops.section(data, [[width, data.shape[0]-width], [data.shape[1]-width, data.shape[1]]]));


        var moment = ndops.moments(2, pixels);

        back.noise = Math.sqrt(moment[1] - moment[0]*moment[0]);
        back.value = ndops.median(pixels);

        return back;
};

imops.mksection = function(x, y, w, h) {
        return [[x-(w/2), x+(w/2)], [y-(h/2), y+(h/2)]];
};

imops._rproj = cwise({
          args: ["array", "scalar", "scalar", "scalar", "scalar", "index"]
        , pre: function(a, cx, cy, radius, length) {
                this.reply = new Float64Array(length*2);
                this.r = Math.sqrt(radius*radius);
                this.i = 0;
          }
        , body: function(a, cx, cy, radius, length, index) {
                var d = Math.sqrt((index[0]-cx)*(index[0]-cx) + (index[1]-cy)*(index[1]-cy));

                if ( d <= this.r ) { 
                    this.reply[this.i*2  ] = d;
                    this.reply[this.i*2+1] = a;

                    this.i++;
                }
          }
        , post: function() {
                return [this.reply, this.i];
        }
});

imops.rproj = function(im, center) {
    var radius = (im.shape[0]/2 + im.shape[1]/2) / 2;

    var raw = imops._rproj(im, center[0], center[1], radius, im.size);
    var vect = raw[0];
    var n    = raw[1];
    var i;

    var raw2d = ndarray(vect, [n, 2]);

    ndops.sort(raw2d);

    var radi = ndops.ndarray([n]);
    var data = ndops.ndarray([n]);

    for ( i = 0; i < im.size; i++ ) {
        radi.set(i, raw2d.get(i, 0));
        data.set(i, raw2d.get(i, 1));
    }

    return { radi: radi, data: data, radius: radius };
};

imops._encen = cwise({
	  args: ["array", "scalar", "scalar", "scalar", "index"]
	, pre: function(a, cx, cy, radius) {
	        this.reply = new Float64Array(radius);
		this.sum = 0;
		this.r   = radius;
		this.rsq = radius*radius;
	  }
	, body: function(a, cx, cy, radius, index) {
		var x = index[1] - cx;
		var y = index[0] - cy;

		var rsq = x*x+y*y;

		if ( a > 0 && rsq < this.rsq ) { 
		    this.reply[Math.round(Math.sqrt(rsq))] += a;
		    this.sum += a;
		}
	  }
	, post: function() {
		var tot = 0;
		var i;

		for ( i = 0; i < this.r; i++ ) {
		    tot += this.reply[i];

		    this.reply[i] = tot / this.sum;
		}

		return this.reply;
	}
});

imops.encen = function(im, center) {
    var radius = (im.shape[0]/2 + im.shape[1]/2) / 2;

    var reply = imops._encen(im, center[1], center[0], radius);

    return ndarray(reply, [reply.length]);
};

ndops.indexof = function(a, x) {
    var i;

    for ( i = 0; i < a.shape[0]; i++ ) {

	if ( x < a.get(i) ) { break; }
    }

    if ( i === 0          ) { return 0; }
    if ( i === a.shape[0] ) { return a.shape[0]; }

    return i + (x - a.get(i))/(a.get(i) - a.get(i-1));
};

ndops.gauss1d = function(radi, x0) {
    var reply = ndops.ndarray(radi.shape);

    var a = x0[0];
    var b = x0[1];
    var c = x0[2];
    var d = x0[3];


    ndops.fill(reply, function(i) {
        var x = radi.data[i]-b;

        return a * Math.pow(2.71828, - x*x / (2*c*c)) + d;
    });

    return reply;    
};

ndops.gsfit1d = function(radi, data, x0) {
    try {
        return numeric.uncmin(function(x) {
            var modl = ndops.gauss1d(radi, x);

            ndops.sub(modl, modl, data);
            ndops.mul(modl, modl, modl);

            return ndops.sum(modl);

        }, x0, 0.00001).solution;
    }
    catch(err) {
        return x0;
    }
};

imops.imstat = function (image, section, type) {
        var stat = {};
	var backgr;

        // Select a chunk of data contained in the region.
        //
        stat.sect = section;
        stat.imag = ndops.section(image, section);

        stat.min = ndops.minvalue(stat.imag);
        stat.max = ndops.maxvalue(stat.imag);

        backgr  = imops.backgr(stat.imag, 4);

        stat.backgr = backgr.value;
        stat.noise  = backgr.noise;

        stat.data = ndops.section(image, section);

        stat.data = ndops.ndarray(stat.imag.shape);
        ndops.subs(stat.data, stat.imag, stat.backgr);
        

        stat.centroid = ndops.centroid(stat.data, ndops.qcenter(stat.data));
        stat.rms      = ndops.rms(stat.data, ndops.qcenter(stat.data));

        stat.hist = ndops.hist(stat.imag);
        stat.hist.sum  = ndops.sum(stat.hist.data);


        stat.xproj   = ndops.proj(stat.imag, 1);
        stat.yproj   = ndops.proj(stat.imag, 0);
        stat.rproj   = imops.rproj(stat.imag, [stat.centroid.ceny, stat.centroid.cenx]);

        var fit = ndops.gsfit1d(stat.rproj.radi, stat.rproj.data
                                  , [stat.max, 0, stat.centroid.fwhm/2.355, stat.backgr]);
        stat.rproj.fitv = fit;

        stat.rproj.fit = { a: fit[0], b: fit[1], c: fit[2], d: fit[3] };


        stat.counts  = ndops.sum(stat.data);

        //stat.ee80    = imops.eener(.8, stat.data, [stat.centroid.ceny, stat.centroid.cenx], stat.counts-stat.backgr, stat.centroid.fwhm)[0];

        stat.centroid.cenx += section[0][0];
        stat.centroid.ceny += section[1][0];

        return stat;
};

exports.reg2section = function(xreg) {

    switch ( xreg.shape ) {

          case "circle":
              xreg.size = {};

              xreg.size.width  = xreg.radius*2;
              xreg.size.height = xreg.radius*2;

              break;

          case "ellipse":
              xreg.size = {};

              xreg.size.width  = xreg.eradius.x*2;
              xreg.size.height = xreg.eradius.y*2;

              break;

          default:
      }

      return imops.mksection(xreg.pos.x, xreg.pos.y, xreg.size.width, xreg.size.height);
};

exports.template = template;

exports.numeric  = numeric;
exports.ndarray  = ndarray;
exports.ndops    = ndops;
exports.imops    = imops;

