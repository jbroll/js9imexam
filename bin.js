
typed = require("typed-array-function");

var bin1d = typed(function (data, n) {
	
	    var shape = typed.clone(data.shape).map(funciton(x) { return ((x/n+0.5)|0) };
	    var reply = typed.array(data.type, shape);

	    // ----
		reply[(iX/n)|0] += data;
	    // ----

	    return reply;
	});

var bin2d = typed(function (data, n) {
	
	    var shape = typed.clone(data.shape).map(funciton(x) { return ((x/n+0.5)|0) };
	    var reply = typed.array(data.type, shape);

	    // ----
		reply[(iX/n)|0][(iY/n)|0] += data;
	    // ----

	    return reply;
	});

var smooth_gaussian2d(data, sigma) {
    var xdat = typed.array("float32", data.shape);
    var ydat = typed.array("float32", data.shape);

    var kern = imexam.gause1d([even ? 0.5, 0, sigma, 1], typed.iota(10));

    for ( i = 0; i < kern.shape[0]; i++ ) {
        if ( kern[i] < .001 ) { 
	    break;
	}
    }
    kern.length = i-1;					// Clip
    kern = typed.clone(kern).reverse().concat(kern);	// Dup

    kern = typed.div(kern, typed.sum(kern));		// Normalize

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
}
