/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, bitwise: true */
/*globals $, JS9, imexam, alert */ 


(function() {
    "use strict";

    var imexam = require("./imexam");

    exports.bin1d = imexam.typed(function (data, n) {
	    
		var shape = imexam.typed.clone(data.shape).map(function(x) { return (x/n+0.5)|0; });
		var reply = imexam.typed.array(data.type, shape);
		var iX = 0;

		// ----
		    reply[(iX/n)|0] += data;
		// ----

		return reply;
	    });

    var _bin2d = imexam.typed(function (data, reply, n) {
	    
		var iX = 0;
		var iY = 0;

		// ----
		    reply[(iY/n)|0][(iX/n)|0] += data;
		// ----

		return reply;
	    });

    exports.bin2d = function (data, n) {
		var shape = imexam.typed.clone(data.shape).map(function(x) { return (x/n+0.5)|0; });
		var reply = imexam.typed.array(shape, data);
		
		return _bin2d(data, reply, n);
	    };




    exports.smooth_gaussian2d = function(data, sigma) {
	var xdat = imexam.typed.array(data.shape, "float32");
	var ydat = imexam.typed.array(data.shape, "float32");

	
	var a = 1;
	var b = 0;
	var c = sigma;
	var d = 0;

	var kern = [];

	for ( i = 0; i < 10; i++ ) {
	    kern[i] = a * Math.pow(2.71828, - i*i / (2*c*c)) + d;
	};

	var i, j, k;

	for ( i = 0; i < kern.length; i++ ) {
	    if ( kern[i] < 0.001 ) { 
		break;
	    }
	}
	kern.length = i-1;					// Clip

	var nerk = imexam.typed.clone(kern);
	var kern = kern.reverse();

	for ( i = 1; i < nerk.length; i++ ) {
	    kern[kern.length] = nerk[i];			// Dup
	}
	kern.shape[0] = kern.length;				// Fix shape

	kern = imexam.typed.div(kern, imexam.typed.sum(kern));	// Normalize

	var nx = data.shape[1];
	var ny = data.shape[0];
	var nk = kern.shape[0];

	for ( j = 0; j < ny; j++ ) {
	    for ( i = 0; i < nx; i++ ) {
		for ( k = -nk/2|0; k < nk/2|0; k++ ) {
		    if ( i+k >= 0 && i+k < ny ) {
			xdat.data[j*nx + i] += kern[k+nk/2|0] * data.data[j*nx+i+k];
		    }
		}
	    }
	}
	for ( j = 0; j < ny; j++ ) {
	    for ( i = 0; i < nx; i++ ) {
		for ( k = -nk/2|0; k < nk/2|0; k++ ) {
		    if ( j+k >= 0 && j+k < ny ) {
			ydat.data[j*nx + i] += kern[k+nk/2|0] * xdat.data[(j+k)*nx+i];
		    }
		}
	    }
	}

	return ydat;
    };

}());
