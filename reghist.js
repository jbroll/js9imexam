/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");


    function histStats(div, data, range) {
	console.log(range);
    }

    function histUpdate(im, xreg) {
        var div = this.div;

	    var imag = imexam.getRegionData(im, xreg);

            var hist    = imexam.ndops.hist(imag);
            hist.sum    = imexam.ndops.sum(hist.data);

            var n = 0;
            var skip = hist.sum * 0.001;
            var h = 0, i, value;

            $(div).empty();

            var hdata = [];

            for ( i = 0; i < hist.data.shape[0]; i++ ) {
                n += hist.data.get(i);

                if ( n > skip &&  n < hist.sum - skip ) { 
		    value = hist.data.get(h);

		    hdata[h] = [i*hist.width+hist.min, value];
		    h++;
		}
            }
	    
	    histStats(div, hist);

            var plot = $.plot(div, [hdata], { selection: { mode: "x" } });
	    imexam.flot.zoomStack(plot, function(plot, range) { histStats(div, hist, range); });
    }

    function histInit() {
	imexam.fixupDiv(this);
        $(this.div).append("Create a region to see histogram<br>");
    }

    JS9.RegisterPlugin("ImExam", "Histogram", histInit, {
	    menu: "analysis",

            menuItem: "Histogram",
            winTitle: "Histogram",
	    help:     "imexam/imexam.html#rghist",

	    toolbarSeparate: true,
	    toolbarHTML: " ",

            onregionschange: histUpdate,
            winDims: [250, 250],
    });

}());
