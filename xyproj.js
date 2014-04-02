/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");


    var projToolbar = "                                      	\
                 <select  class='proj_menu'> 			\
                        <option>sum</option>                    \
                        <option>avg</option>                    \
                        <option>med</option>                    \
                </select>";

    function projUpdate(im, xreg) {
	var div, proj, menx;

        if ( im === undefined ) {
	    div  = xreg.div;
	    proj = xreg.proj;
	    menx = xreg.menu;
	} else {
	    div  = this.div; 
	    menx = $(this.toolbar).find(".proj_menu")[0];

            proj = imexam.ndops.proj(imexam.getRegionData(im, xreg), this.plugin.opts.xyproj);

	    $(menx).change(function (event) {
		    projUpdate(undefined, { div: div, proj: proj, menu: menx });
		});
	}


	var xdata = [];
	var  data;
	var x;

	var proj_type = menx.options[menx.selectedIndex].value;

	$(div).empty();

	if ( proj_type === "sum" ) {
		data = proj.sum;
	}
	if ( proj_type === "avg" ) {
		data = proj.avg;
	}
	if ( proj_type === "med" ) {
		data = proj.med;
	}


	for ( x = 0;  x < data.length; x++ ) {
		xdata[x] = [x, data[x]];
	}

	$.plot(div, [xdata]);
    }

    function projInit() {
	imexam.fixupDiv(this);
        $(this.div).append("Create a region to see projection<br>");
    }

    JS9.RegisterPlugin("ImExam", "XProj", projInit, {
	    menu: "analysis",

            menuItem: "X Projection",
	    winTitle: "X Projection",
	    help:     "imexam/imexam.html#xyproj",

	    toolbarSeparate: true,
	    toolbarHTML: projToolbar,

            regionchange: projUpdate,

            winDims: [250, 250],

            xyproj: 0
    });

    JS9.RegisterPlugin("ImExam", "YProj", projInit, {
	    menu: "analysis",

            menuItem: "Y Projection",
	    winTitle: "Y Projection",
	    help:     "imexam/imexam.html#xyproj",

	    toolbarSeparate: true,
	    toolbarHTML: projToolbar,

            regionchange: projUpdate,

            winDims: [250, 250],

            xyproj: 1
    });
}());
