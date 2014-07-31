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

    exports.bin2d = imexam.typed(function (data, n) {
	    
		var shape = imexam.typed.clone(data.shape).map(function(x) { return (x/n+0.5)|0; });
		var reply = imexam.typed.array(data.type, shape);
		var iX = 0;
		var iY = 0;

		// ----
		    reply[(iX/n)|0][(iY/n)|0] += data;
		// ----

		return reply;
	    });

    exports.smooth_gaussian2d = function(data, sigma) {
	var xdat = imexam.typed.array("float32", data.shape);
	var ydat = imexam.typed.array("float32", data.shape);

	var kern = imexam.ndops.gauss1d(imexam.ndops.iota(10), [.0, sigma, 0.0]);
	var i, j, k;

	for ( i = 0; i < kern.shape[0]; i++ ) {
	    if ( kern[i] < 0.001 ) { 
		break;
	    }
	}
	kern.length = i-1;					// Clip
	kern = imexam.typed.clone(kern).reverse().concat(kern);	// Dup

	kern = imexam.typed.div(kern, imexam.typed.sum(kern));		// Normalize

	for ( j = 0; j < data.shape[0]; j++ ) {
	    for ( i = 0; i < data.shape[1]; i++ ) {
		for ( k = 0; kern.shape[0]; k++ ) {
		    if ( j + k < data.shape[1] ) {
			xdat[i][j] += kern[k] * data[i][j+k];
		    }
		}
	    }
	}
	for ( j = 0; j < data.shape[0]; j++ ) {
	    for ( i = 0; i < data.shape[1]; i++ ) {
		for ( k = 0; kern.shape[0]; k++ ) {
		    if ( i + k < data.shape[1] ) {
			ydat[i][j] += kern[k] * xdat[i+k][j];
		    }
		}
	    }
	}

	return ydat;
    };

}());
